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
        
        userConfig.dateCreated = (new Date()).toISOString();

        userConfig._id = UUID.v4({
            rng: UUID.nodeRNG
        });
        userConfig.href= 'http://localhost:8080/api/v0/users/' + userConfig._id;
        
        usersCollection.save(userConfig, function(error, value){
            if( error ){
                deferred.reject('could not create user');
            } else {
                deferred.resolve(value);
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
                
                tournamentInfo._id = UUID.v4({ rng: UUID.nodeRNG });
                tournamentInfo.dateCreated = (new Date()).toISOString();
                tournamentInfo.createdBy = user._id;
                tournamentInfo.href = 'http://localhost:8080/api/v0/tournaments/' + tournamentInfo._id;
                
                tournamentsCollection.save(tournamentInfo, function(error, tournament){
                    deferred.resolve(tournament);
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