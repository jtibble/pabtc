var storage = require('../storage.js');
var requestValidator = require('./requestValidator.js');

module.exports = [
    {
        'type': 'POST',
        'name': 'tournaments/create',
        'response': function (req, res) {

            var responseBody = {
                success: false,
                issues: []
            };
            
            var requiredProperties = ['name'];
            
            if ( !requestValidator.validate( req, requiredProperties )){
                responseBody.success = false;
                responseBody.issues = ['Missing request body properties. Check the API documentation.'];
                res.send(responseBody);
                return;
            }
            
            var userId = req.get('UserId');

            if (!userId) {
                responseBody.success = false;
                responseBody.issues = ['Missing UserId header'];
                res.send(responseBody);
                return;
            }
            
            var tournamentPromise = storage.addTournamentAsync( req.body, userId );
            
            var successCallback = function(tournament){
                responseBody.success = true;
                responseBody.data = tournament;
                res.send(responseBody);
            };
            
            var errorCallback = function(error){
                responseBody.success = false;
                responseBody.issues = [error];
                res.send(responseBody);
            };
            
            tournamentPromise.then(successCallback, errorCallback);
        }
    },
    {
        'type': 'GET',
        'name': 'tournaments',
        'response': function (req, res) {

            var responseBody = {
                success: false,
                issues: []
            };
            
            var tournamentPromise = storage.getTournamentsAsync();
            
            var successCallback = function(tournamentsList){
                responseBody.success = true;
                responseBody.data = tournamentsList;
                res.send(responseBody);
            };
            
            var errorCallback = function(error){
                responseBody.success = false;
                responseBody.issues = [error];
                res.send(responseBody);
            };
            
            tournamentPromise.then(successCallback, errorCallback);
        }
    }
];
