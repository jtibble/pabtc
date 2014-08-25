var userServices = require('./services/users.js');
var tournamentServices = require('./services/tournaments.js');
var utilityServices = require('./services/utility.js');

module.exports = {
    'staticContentPath': '/www',
    'apiPath': '/api/v0/',
    'endpoints': [
        userServices,
        tournamentServices
        //utilityServices
    ]
};