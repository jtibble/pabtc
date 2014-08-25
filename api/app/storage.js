var UUID = require('node-uuid');

//var mongojs = require('mongojs');
//var db = mongojs('test');
//var collection = db.collection('testCollection');


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

        var storedUser = localDB.users[userId];
        if (storedUser && storedUser.permissions && storedUser.permissions.write) {

            tournamentInfo.id = UUID.v4({
                rng: UUID.nodeRNG
            });
            localDB.tournaments[tournamentInfo.id] = tournamentInfo;
            return tournamentInfo.id;

        } else {
            return false;
        }
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

        userConfig.id = UUID.v4({
            rng: UUID.nodeRNG
        });
        localDB.users[userConfig.id] = userConfig;

        return userConfig;
    },
    deleteUser: function (id) {

    },
    searchUsers: function (searchInfo) {

    }
};