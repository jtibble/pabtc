var Q = require('q');

var RegistrationsDao = require('../dao/RegistrationDao');
var TournamentsDao = require('../dao/TournamentsDao');
var tournamentStatusList = require('../model/TournamentStatus.js');

function isValidStateTransition( currentState, futureState ){
    var currentStateIndex = tournamentStatusList.indexOf( currentState );
    var futureStateIndex = tournamentStatusList.indexOf( futureState );
    
    // Going forward is always allowed
    if( futureStateIndex > currentStateIndex ) return true;
    
    // Not-changing state is not allowed
    if( futureStateIndex == currentStateIndex ) return false;
    
    // Going backwards is allowed as long as you are in state 1 or 2 and not going to state 0 ('new')
    if( futureStateIndex < currentStateIndex && currentStateIndex < 3 && futureStateIndex != 0){
        return true;
    } else {
        return false;
    }
}

module.exports = {
    create: function( newTournament ){
        return TournamentsDao.create( newTournament );
    },
    find: function( query ){
        var deferred = Q.defer();
        
        TournamentsDao.find( query ).then( function(tournamentList){
            
            // Get registration info for each of these tournaments and join before returning            
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
    update: function( id, updateParams, username ){
        var deferred = Q.defer();
        
        // Get tournament and check if it was created by this user
        TournamentsDao.findById( id ).then( function( tournament ){
            
            if( tournament.createdBy == username ){
                
                if( updateParams.status && !isValidStateTransition( tournament.status, updateParams.status )){
                    var errorText = 'Illegal tournament status transition. Cannot go from ' + tournament.status + ' to ' + updateParams.status;
                    console.log( errorText );
                    deferred.reject( new Error( errorText )); 
                    return;
                }
                
                
                TournamentsDao.update( id, updateParams ).then( function(updatedTournament){
                    deferred.resolve( updatedTournament );
                }).fail(function(error){
                    deferred.reject(new Error('could not update tournament ' + error.message));
                });
            } else {
                deferred.reject( new Error('tournament cannot be updated by any user except its creator')); 
            }
        }).fail(function(error){
            deferred.reject(new Error('could not find tournament by that id: ' + error.message)); 
        });
        
        return deferred.promise;
        
    }
};