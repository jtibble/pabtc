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
    addTournament: function (tournamentInfo, userId) {
        if (!tournamentInfo || !userId) {
            return false;
        }
        
        //var promise = 
        
        var callback = function( error, value ){
            var user = value[0];
            debugger;
        };

        var storedUser = usersCollection.find({_id: userId}, callback);
        
        
    },
    searchTournaments: function (searchInfo, userId) {
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

    },

    addUser: function (userConfig) {
        if (!userConfig) {
            return false;
        }

        userConfig._id = UUID.v4({
            rng: UUID.nodeRNG
        });
        
        usersCollection.save( userConfig );

        return userConfig;
    },
    deleteUser: function (id) {

    },
    searchUsers: function (searchInfo) {

    }
};