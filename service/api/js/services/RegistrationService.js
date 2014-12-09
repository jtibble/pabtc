var Q = require('q');

var RegistrationsDao = require('../dao/RegistrationDao');
var TournamentsDao = require('../dao/TournamentsDao');

var RegistrationStatus = require('../model/RegistrationStatus');

module.exports = {
    create: function( username, tournamentId ){
        var deferred = Q.defer();
        
        Q.all([
            TournamentsDao.find( {_id: tournamentId} ),
            RegistrationsDao.find( 'tournamentId', tournamentId )
        ])
        .then( function( resolvedPromises ){            
            var tournamentList = resolvedPromises[0];
            var registrationList = resolvedPromises[1];
            
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
                if( r.status == 'Finalized'){
                    numFinalizedRegistrations++;
                }
            });
            
            // Check that there is an open spot to register
            if( numFinalizedRegistrations <= tournament.totalPlayers ){   
                deferred.reject( new Error('Tournament is full of finalized players already'));
                return;
            }
            
            // Check that the user is not already registered for this tournament
            // TODO
                
                
            RegistrationsDao.create( username, tournamentId ).then( function( registration ){
                deferred.resolve( registration );
                return;
            });
        
        })
        .fail( function(error){
            deferred.reject( new Error('Failed to fetch previous registrations and tournament info from db: ' + error.message));
        });
        
        
        return deferred.promise;
    }
};