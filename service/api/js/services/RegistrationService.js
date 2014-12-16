var Q = require('q');
var UUID = require('node-uuid');

var RegistrationsDao = require('../dao/RegistrationDao');
var TournamentsDao = require('../dao/TournamentsDao');
var UserDao = require('../dao/UserDao');
var BitcoinDao = require('../dao/BitcoinDao');

var RegistrationStatus = require('../model/RegistrationStatus');

module.exports = {
    create: function( username, tournamentId ){
        var deferred = Q.defer();
        
        Q.all([
            UserDao.find( 'username', username ),
            TournamentsDao.find( {_id: tournamentId} ),
            RegistrationsDao.find( 'tournamentId', tournamentId )
        ])
        .then( function( resolvedPromises ){
            var userList = resolvedPromises[0];
            var tournamentList = resolvedPromises[1];
            var registrationList = resolvedPromises[2];
            
            // Check that there is only one user returned
            if( userList.length != 1 ){
                console.log( JSON.stringify( userList ));
                deferred.reject( new Error('More than one matching user found'));
                return;
            }
            
            var user = userList[0];
            
            // Check that the tournament exists
            if( tournamentList.length == 0 ){
                deferred.reject( new Error('tournament not found'));   
                return;
            }
            
            // Check that there is only one tournament returned
            if( tournamentList.length > 1 ){
                deferred.reject( new Error('More than one matching tournament found'));
                return;
            }
            
            var tournament = tournamentList[0];
            
            // Check that the tournament has the correct status
            if( tournament.status !== 'open' ){
                deferred.reject( new Error('tournament is not open for registrations at this time') );
                return;
            }
            
            var numFinalizedRegistrations = 0;
            
            registrationList.forEach( function(r){
                if( r.status == 'paid'){
                    numFinalizedRegistrations++;
                }
            });
            
            // Check that there is an open spot to register
            if( numFinalizedRegistrations >= tournament.totalPlayers ){   
                deferred.reject( new Error('Tournament is full'));
                return;
            }
            
            // Check that the user is not already registered for this tournament
            for( var i in registrationList ){
                if( registrationList[i].username == username ){
                    deferred.reject( new Error('cannot register for tournament twice'));
                    return;
                }
            }
            
            
            // If the tournament has a prize or a buyin, make sure the user included a bitcoin address
            if( ((tournament.prizeAmount && tournament.prizeAmount > 0) ||
                (tournament.buyinAmount && tournament.buyinAmount > 0)) &&
                !user.receivingAddress ){
                deferred.reject( new Error('user requires a receiving address to register for this tournament'));
                return;              
            }
            
            if( tournament.buyinAmount == 0 ){
                RegistrationsDao.createPaid( username, tournamentId ).then(function(registration){
                    deferred.resolve(registration);
                    return;
                });
            } else {
                
                var invoiceAmount = tournament.buyinAmount;
                var invoiceCurrency = tournament.buyinCurrency;
                
                if( invoiceCurrency == 'mBTC' ){
                    invoiceAmount /= 1000;
                    invoiceCurrency = 'BTC'
                } else if ( invoiceCurrency == 'μBTC' ){
                    invoiceAmount /= 1000000;  
                    invoiceCurrency = 'BTC' 
                }
                
                BitcoinDao.createBuyinInvoice( invoiceAmount, 
                                               invoiceCurrency,
                                               tournament.name,
                                               username ).then(function(invoice){
                    return RegistrationsDao.createWithInvoice( username, tournamentId, invoice );
                }).then( function(registration){
                    deferred.resolve( registration ); 
                }).fail( function(error){
                    deferred.reject( new Error('failed to create invoice with bitpay and registration: ' + error.message));
                });
            }
            
            
        
        })
        .fail( function(error){
            deferred.reject( new Error('Failed to fetch previous registrations and tournament info from db: ' + error.message));
        });
        
        
        return deferred.promise;
    },
    
    updateRegistrationStatus: function( invoice ){
        var deferred = Q.defer();
        
        // TODO: Also update tournament prize if it's a buyin tournament
        if( invoice.status == 'complete' ){
            invoice.status = 'paid';   
        }
        
        var registration;
        var tournament;
        
        RegistrationsDao.findAndUpdateStatusByBitpayId( invoice.id, 
                                                        invoice.status ).then( function( fetchedRegistration ){
            
            registration = fetchedRegistration;
            return TournamentsDao.findById( registration.tournamentId );
            
        }).then( function(fetchedTournament){

            tournament = fetchedTournament;
            
            if( tournament.buyinAmount > 0 ){

                var bitcoinPaid = invoice.btcPaid;
                var paidAmountInCorrectCurrency = bitcoinPaid;


                if( tournament.prizeCurrency == 'USD' ){
                    paidAmountInCorrectCurrency = bitcoinPaid * invoice.exRates.USD;
                } else if( tournament.prizeCurrency == 'mBTC' ){
                    paidAmountInCorrectCurrency = bitcoinPaid * 1000;   
                } else if (tournament.prizeCurrency == 'μBTC' ){
                    paidAmountInCorrectCurrency = bitcoinPaid * 1000000;   
                }

                TournamentsDao.addPrizeAmountToTournamentById( registration.tournamentId, 
                                                               paidAmountInCorrectCurrency ).then( function(){
                    console.log('updated tournament prize');
                    deferred.resolve();
                }).fail( function(error){
                    deferred.reject( new Error('Failed to add prize amount to tournament: ' + error.message));
                });
            } else {
                deferred.resolve();
            }
            
        }).fail(function(error){
            deferred.reject( new Error('could not find registration with that invoice id: ' + error.message)); 
        });
        
        return deferred.promise;
    }
};







