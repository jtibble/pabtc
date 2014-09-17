var Schema = require('./schema.js');

var UUID = require('node-uuid');
var Q = require('q');

var mongojs = require('mongojs');
var db = mongojs('test');
var usersCollection = db.collection('users');
var tournamentsCollection = db.collection('tournaments');

db.runCommand({ping:1}, function(err, res) {
    if(!err && res.ok){
        console.log("MongoDB connection successful");
    } else {
        throw 'Failed to connect to MongoDB: check that it\'s running';   
    }
});

var usersStorage = {
    create: function( params ){
        var deferred = Q.defer();

        var newUser = Schema.create('user');
        var newUserKeys = Object.keys(newUser);

        // Copy properties to new object if they exist in the schema
        for( var i in newUserKeys ){
            var keyName = newUserKeys[i];
            if( params[ keyName ] ){
                newUser[ keyName ] = params[ keyName ];
            }
        }

        usersCollection.save(newUser, function(error, user){
            if( error ){
                deferred.reject('could not create user');
            } else {
                deferred.resolve(user);
            }
        });

        return deferred.promise;
    },
    update: function( user ){
        var deferred = Q.defer();
        return deferred.promise;
    },
    find: function( property, value ){
        var deferred = Q.defer();

        var query = {};
        if( property && value){
            query[property] = value;
        }

        usersCollection.find(query, function (error, usersList) {
            if (error || !usersList || !usersList.length){
                deferred.reject('no users found');
            } else {
                deferred.resolve(usersList); // Only return one user
            }
        });

        return deferred.promise;
    },
    createAPIKey: function( userId){
        var deferred = Q.defer();

        console.log('User id=' + userId + ' is requesting an API key');

        this.find('_id', userId).then( function( userList){
            debugger;
            if( !userList || !userList.length ){
                deferred.reject('error finding user in db');
                return;
            }

            var user = userList[0];

            // Prevent the user from re-creating an API key
            if( user && user.APIKey ){
                deferred.reject('API key already created! Cannot recreate.');
                return;
            }

            // Generate new key
            var APIKey = UUID.v4({rng: UUID.nodeRNG});
            var searchQuery = {_id: user._id};
            var updateParameter = { $set: { APIKey: APIKey } };

            // Update user in DB
            usersCollection.update( searchQuery,updateParameter, {}, function(error, updateStatus){
                if( !error && updateStatus.ok && updateStatus.n == 1 ){

                    // Find the updated user and return the API key in the response
                    usersCollection.find( searchQuery, function(error, userList){
                        if(!error && userList && userList.length && userList[0].APIKey){

                            console.log('User id=' + userId + ' had an API key created at ' + (new Date()).toISOString());
                            deferred.resolve(userList[0].APIKey);
                        } else {
                            deferred.reject('Set API key but couldn\'t return it successfully.');
                        }
                    });

                } else {
                    deferred.reject( 'Could not create API key' );
                }
            });
        });


        return deferred.promise;
    }
};

var tournamentsStorage = {
    create: function( params, APIKey ){
        var deferred = Q.defer();

        // Find the user creating the tournament by API key
        usersStorage.find('APIKey', APIKey).then( function(userList){
            if (!userList || userList.length != 1 || userList[0].APIKey != APIKey) {
                deferred.reject('User API key is not correct');
                return;
            }

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

        }, function(error){
            deferred.reject(error);
        });

        return deferred.promise;
    },
    update: function( tournament ){
        var deferred = Q.defer();
        return deferred.promise;
    },
    find: function( property, value ){
        var deferred = Q.defer();

        var query = {};

        if( property && value ){
            query[property] = value;   
        }

        tournamentsCollection.find(query, function(error, tournamentsList){
            if( !error && tournamentsList ){
                deferred.resolve( tournamentsList );
            } else {
                deferred.reject( 'Could not fetch tournaments' );
            }
        });

        return deferred.promise;
    },
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

                tournamentsCollection.update({_id: tournamentId}, { $set: { registeredPlayers: registeredPlayers }}, function(error, updateStatus){
                    if(!error && updateStatus.ok && updateStatus.n == 1){
                        deferred.resolve({message: 'Updated tournament'});
                    } else {
                        deferred.reject('Could not update tournament in db');   
                    }
                });
            });  
        });

        return deferred.promise;
    }    
};
    
module.exports = {
    users: usersStorage,
    tournaments: tournamentsStorage
};                                 