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

        console.log('getUserAsync');
        var deferred = Q.defer();

        var callback = function (error, value) {
            console.log('user found');
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

        var checkUserCanWrite = function (user) {
            if (user && user.permissions && (user.permissions.write || users.permissions.write)) {
                return true;
            } else {
                return false;
            }
        };

        this.getUserAsync(userId).then(function (user) {
            console.log('checking if user can write to db');
            debugger;
            if (checkUserCanWrite(user)) {
                console.log('saving tourney to db now');
                tournamentsCollection.save(tournamentInfo, function(error, value){
                    console.log('resolving addTournamentAsync deferred');
                    deferred.resolve(value);
                });
            } else {
                deferred.reject('User did not have permission to create tournament.');
            }
        });

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