var storage = require('../storage.js');
var requestValidator = require('./requestValidator.js');

module.exports = [
    {
        'type': 'POST',
        'name': 'tournaments',
        'response': function (req, res) {

            var responseBody = {};
            
            var requiredProperties = ['name'];
            
            if ( !requestValidator.validate( req, requiredProperties )){
                responseBody.issues = ['Missing request body properties. Check the API documentation.'];
                res.status(400).send(responseBody);
                return;
            }
            
            var userId = req.get('UserId');

            if (!userId) {
                responseBody.success = false;
                responseBody.issues = ['Missing UserId header'];
                res.status(401).send(responseBody);
                return;
            }
            
            var tournamentPromise = storage.addTournamentAsync( req.body, userId );
            
            var successCallback = function(tournament){
                tournament.href = 'http://localhost:8080/api/v0/tournaments/' + tournament._id;
                res.status(201).send(tournament);
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
        'name': 'tournaments/:id',
        'response': function (req, res) {

            if( req.params && req.params.id ){
                console.log('Requested tournaments/' + req.params.id);
            }
            
            var responseBody = {
                success: false,
                issues: []
            };
            
            var tournamentPromise = storage.getTournamentsAsync(req.params.id);
            
            var successCallback = function(tournamentsList){
                if( tournamentsList && tournamentsList.length ){
                    res.status(200).send(tournamentsList);
                } else {
                    res.status(404).send('Could not find tournament/tournaments');   
                }
            };
            
            var errorCallback = function(error){
                responseBody.success = false;
                responseBody.issues = [error];
                res.status(500).send(responseBody);
            };
            
            tournamentPromise.then(successCallback, errorCallback);
        }
    }
];
