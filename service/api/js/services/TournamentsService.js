var Q = require('q');

var RegistrationsDao = require('../dao/RegistrationDao');
var TournamentsDao = require('../dao/TournamentsDao');

module.exports = {
    create: function( newTournament ){
        return TournamentsDao.create( newTournament );
    },
    find: function( query ){
        var deferred = Q.defer();
        
        TournamentsDao.find( query ).then( function(tournamentList){
            
            // Get registration info for each of these tournaments
            // TODO: Make this parallel!
            
            console.log('finding registrations before returning tournament list');
            
            var tournamentUpdatePromiseList = [];
            
            for( var i in tournamentList ){
                tournamentUpdatePromiseList.push( RegistrationsDao.find('tournamentId', tournamentList[i]._id) );
            }
            
            Q.all( tournamentUpdatePromiseList ).then( function(registrationSearchResults){
                for( var i in registrationSearchResults ){
                    tournamentList[i].registrations = registrationSearchResults[i];
                }
                
                deferred.resolve( tournamentList );
            });
            
            
        }).fail( function(error){
            deferred.reject( error.message ); 
        });
        
        return deferred.promise;
    },
    update: function( id, updateParams ){
        return TournamentsDao.update( id, updateParams );   
    }
};