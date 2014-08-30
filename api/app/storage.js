var Q = require('q');
var UUID = require('node-uuid');

var mongojs = require('mongojs');
var db = mongojs('test');
var usersCollection = db.collection('users');
var tournamentsCollection = db.collection('tournaments');


console.log('Initializing Storage');

var localDB = {
    tournaments: {},
    users: {}
};

module.exports = {
    getUserAsync: function (userId) {

        var deferred = Q.defer();

        var callback = function (error, value) {
            if (value && value.length) {
                var user = value[0];
                deferred.resolve(user);
            } else {
                deferred.reject('Could not retrieve user from db by id');
            }
        };

        usersCollection.find({
            _id: userId
        }, callback);

        return deferred.promise;

    },
    addTournamentAsync: function (tournamentInfo, userId) {

        var deferred = Q.defer();

        if (!tournamentInfo || !userId) {
            deferred.reject('Improper call to addTournamentAsync');
        }
        
        var userFetchedCallback = function(user){
            if (user && user.permissions && (user.permissions.write || user.permissions.write)) {
                
                tournamentInfo._id = UUID.v4({
                    rng: UUID.nodeRNG
                });
                
                tournamentsCollection.save(tournamentInfo, function(error, tournament){
                    deferred.resolve(tournament);
                });
            } else {
                deferred.reject('User ' + user._id + ' does not have permission to create tournament.');
            }
        };
        
        var userFetchFailedCallback = function(message){
            deferred.reject('Could not find user');
        };

        this.getUserAsync(userId).then( userFetchedCallback, userFetchFailedCallback );

        return deferred.promise;
    },
    /*searchTournaments: function (searchInfo, userId) {
        if (!searchInfo || !userId) {
            return false;
        }

        var storedUser = localDB.users[userId];
        if (storedUser && storedUser.permissions && storedUser.permissions.read) {
            return localDB.tournaments;
        } else {
            return false;
        }
    },
    deleteTournament: function (id, userId) {

    },*/

    addUser: function (userConfig) {
        if (!userConfig) {
            return false;
        }

        userConfig._id = UUID.v4({
            rng: UUID.nodeRNG
        });

        usersCollection.save(userConfig);

        return userConfig;
    }
    /*,
    deleteUser: function (id) {

    },
    searchUsers: function (searchInfo) {

    }*/
};