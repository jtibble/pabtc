var Q = require('q');
var UUID = require('node-uuid');

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

var localDB = {
    tournaments: {},
    users: {}
};

module.exports = {

    addUserAsync: function (userConfig) {
        var deferred = Q.defer();
        
        if (!userConfig) {
            deferred.reject('No userconfig provided');
        }
        
        var newId = UUID.v4({rng: UUID.nodeRNG});
        
        userRecord = {
            _id: newId,
            dateCreated: (new Date()).toISOString(),
            href: 'http://localhost:8080/api/v0/users/' + newId,
            name: userConfig.name,
            permissions: {
				'read': true	
			}
        };
        
        usersCollection.save(userRecord, function(error, user){
            if( error ){
                deferred.reject('could not create user');
            } else {
                delete user._id;
                deferred.resolve(user);
            }
        });

        return deferred.promise;
    },
                  
    getUserByAPIKeyAsync: function (APIKey) {

        var deferred = Q.defer();

        var callback = function (error, value) {
            if (error || !value || !value.length){
                deferred.reject('no user found');
            } else {
                deferred.resolve(value[0]); // Only return one user
            }
        };

        usersCollection.find({ APIKey: APIKey }, callback);

        return deferred.promise;

    },
    
    getUsersAsync: function(id){

        var deferred = Q.defer();

        var callback = function (error, usersList) {
            if (error){
                deferred.reject('could not retrieve usersList from db');
            } else {
                deferred.resolve(usersList);
            }
            return;
        };
        
        var searchQuery = {};
        if( id ){
            searchQuery._id = id;
        }
        
        usersCollection.find(searchQuery, callback);

        return deferred.promise;
    },
    
    addTournamentAsync: function (tournamentInfo, APIKey) {

        var deferred = Q.defer();
        
        var userFetchedCallback = function(user){
            if (user && user.APIKey == APIKey) {
                
                var newId = UUID.v4({rng: UUID.nodeRNG});

                tournamentRecord = {
                    _id: newId,
                    dateCreated: (new Date()).toISOString(),
                    href: 'http://localhost:8080/api/v0/touraments/' + newId,
                    createdBy: user._id,
                    name: tournamentInfo.name
                };
                
                tournamentsCollection.save(tournamentRecord, function(error, tournament){
                    if( error ){
                        deferred.reject('could not create tournament');
                    } else {
                        delete tournament._id;
                        deferred.resolve(tournament);
                    }
                });
                
            } else {
                deferred.reject('User does not have permission to create tournament.');
            }
        };
        
        var userFetchFailedCallback = function(message){
            deferred.reject('Could not find user. ' + message);
        };

        this.getUserByAPIKeyAsync(APIKey).then( userFetchedCallback, userFetchFailedCallback );

        return deferred.promise;
    },
    
    getTournamentsAsync: function(id){
        
        var deferred = Q.defer();
        
        var searchQuery = {};
        if( id ){
            searchQuery._id = id;
        }
        
        tournamentsCollection.find(searchQuery, function(error, tournamentsList){
            if( !error && tournamentsList ){
                deferred.resolve( tournamentsList );
            } else {
                deferred.reject( 'Could not fetch tournaments' );
            }
        });
        
        return deferred.promise;
    },
	
	createAPIKey: function(userId){
        var deferred = Q.defer();
        
        var searchQuery = {_id: userId};
		console.log('User id=' + userId + ' is requesting an API key');
		
		// Find the user in the DB
		usersCollection.find( searchQuery, function(error, userList){
			if( error || !userList || !userList.length ){
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