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
            permissions: userConfig.permissions
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
                  
    getUserByIdAsync: function (userId) {

        var deferred = Q.defer();

        var callback = function (error, value) {
            if (error || !value || !value.length){
                deferred.reject('no user found');
            } else {
                deferred.resolve(value[0]);
            }
        };

        usersCollection.find({ _id: userId }, callback);

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
    
    addTournamentAsync: function (tournamentInfo, userId) {

        var deferred = Q.defer();

        if (!tournamentInfo || !userId) {
            deferred.reject('Improper call to addTournamentAsync');
        }
        
        var userFetchedCallback = function(user){
            if (user && user.permissions && (user.permissions.write || user.permissions.write)) {
                
                
                var newId = UUID.v4({rng: UUID.nodeRNG});

                tournamentRecord = {
                    _id: newId,
                    dateCreated: (new Date()).toISOString(),
                    href: 'http://localhost:8080/api/v0/touraments/' + newId,
                    createdBy: user._id,
                    name: tournamentInfo.name
                };
                
                tournamentsCollection.save(tournamentInfo, function(error, tournament){
                    if( error ){
                        deferred.reject('could not create tournament');
                    } else {
                        delete tournament._id;
                        deferred.resolve(tournament);
                    }
                });
                
            } else {
                deferred.reject('User ' + user._id + ' does not have permission to create tournament.');
            }
        };
        
        var userFetchFailedCallback = function(message){
            deferred.reject('Could not find user. ' + message);
        };

        this.getUserByIdAsync(userId).then( userFetchedCallback, userFetchFailedCallback );

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
    }
};