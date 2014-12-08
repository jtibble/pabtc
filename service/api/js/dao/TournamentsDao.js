var Schema = require('../model/Schema.js');

var UUID = require('node-uuid');
var Q = require('q');

var mongojs = require('mongojs');
var db = mongojs('test');
var tournamentsCollection = db.collection('tournaments');

var tournamentStatusList = require('../model/TournamentStatus.js');

module.exports = {
    create: function( params ){
        var deferred = Q.defer();
        
        var newTournament = Schema.create('tournament');
        var newTournamentKeys = Object.keys(newTournament);

        // Copy properties to new object if they exist in the schema
        for( var i in newTournamentKeys ){
            var keyName = newTournamentKeys[i];
            if( params[ keyName ] ){
                newTournament[ keyName ] = params[ keyName ];
            }
        }

        tournamentsCollection.save(newTournament, function(error, tournament){
            if( error ){
                deferred.reject('could not create tournament');
            } else {
                deferred.resolve(tournament);
            }
        });

        return deferred.promise;
    },
    find: function( query ){
        var deferred = Q.defer();
        var projection = {};

        tournamentsCollection.find(query, projection, function(error, tournamentsList){
            if( !error && tournamentsList ){
                deferred.resolve( tournamentsList );
            } else {
                deferred.reject( 'Could not fetch tournaments' );
            }
        });

        return deferred.promise;
    },
    update: function( tournamentId, updateParams ){
        var deferred = Q.defer();
        
        if( !updateParams ){
            deferred.reject( new Error('no update parameters specified'));
            return;
        }
        
        var updateKeys= {};
        
        // Selectively add keys to update. Don't add tons of keys from REST request, of course
        if( updateParams.status){
            if( tournamentStatusList.indexOf( updateParams.status ) != -1 ){                    
                updateKeys.status = updateParams.status;
            } else {
                console.log('tried to update tournament status to invalid value');
                deferred.reject('requested tournament status is not valid');
                return deferred.promise;
            }
        }
        
        console.log('TournamentDao updating tournament ' + tournamentId);
        
        tournamentsCollection.findAndModify( {
            query: {_id: tournamentId },
            update: { 
                $set: updateKeys
            },
            new: true
        }, function(error, updatedTournament){
            if( !error ){
                deferred.resolve(updatedTournament);
            } else {
                deferred.reject( new Error('could not update tournament in db'));   
            }
        });
        
        
        
        return deferred.promise;
    }/*,
    registerUsers: function( tournamentId, userIdList ){
        var deferred = Q.defer();

        //TODO: parallelize the tournament and users-checks

        //Find the tournament in the DB
        tournamentsCollection.find({_id: tournamentId}, function(error, tournamentsList){
            if( error || !tournamentsList || !tournamentsList.length || tournamentsList.length != 1){
                deferred.reject('Can\'t find tournament in db correctly');
                return;
            }

            var registeredPlayers = tournamentsList[0].registeredPlayers;

            // Get number of available slots
            var numAvailablePlayers = tournamentsList[0].totalPlayers - registeredPlayers.length;

            if( userIdList.length > numAvailablePlayers ){
                deferred.reject('Can\'t add players to tournament because it would over-fill tournament. Only ' + numAvailablePlayers + ' slots available still');   
                return;
            }

            // Find all specified users in the db by id and check that they exist
            usersCollection.find({ _id: { $in: userIdList} }, function(error, usersList){
                if( error || usersList.length != userIdList.length ){
                    deferred.reject('Can\'t find all users in db');
                    return;
                }

                // Add incoming users to the list of already-registered players
                registeredPlayers = registeredPlayers.concat(usersList);
                var query = {_id: tournamentId};
                var command = { $set: { registeredPlayers: registeredPlayers }};

                tournamentsCollection.update(query, command, function(error, updateStatus){
                    if(!error && updateStatus.ok && updateStatus.n == 1){
                        deferred.resolve({message: 'Updated tournament'});
                    } else {
                        deferred.reject('Could not update tournament in db');   
                    }
                });
            });  
        });

        return deferred.promise;
    }    */
};