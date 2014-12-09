var RegistrationsDao = require('../dao/RegistrationDao');
var TournamentsDao = require('../dao/TournamentsDao');

var RegistrationStatus = require('../model/RegistrationStatus');

module.exports = {
    create: function( username, tournamentId ){
        var deferred = Q.defer();
        
        // Fetch registrations for tournamentId
        // Fetch tournament by tournamentId
        
        Q.all([
            TournamentsDao.find( '_id=' + tournamentId ),
            RegistrationsDao.find( 'tournamentId', tournamentId )
        ])
        .then( function( resolvedPromises ){            
            var tournamentList = resolvedPromises[0];
            var registrationList = resolvedPromises[1];
            
            if( tournamentList.length != 1 ){
                deferred.reject('More than one matching tournament found');
                return;
            }
            
            var tournament = tournamentList[0];
            
            var numFinalizedRegistrations = 0;
            
            registrationList.forEach( function(r){
                if( r.status == 'Finalized'){
                    numFinalizedRegistrations++;
                }
            });
            
            
            if( numFinalizedRegistrations < tournament.totalPlayers ){
                
                RegistrationsDao.create( username, tournamentId ).then( function(){
                    deferred.resolve();    
                });
                
            } else {
                deferred.reject('Tournament is full of finalized players already');   
            }
        
        })
        .fail( function(error){
            deferred.reject('Failed to fetch necessary registrations and tournament info from db: ' + error.message);
        });
        
        
        return deferred.promise;
    }
};