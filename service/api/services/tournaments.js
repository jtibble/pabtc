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
                responseBody = {message: 'Missing request body properties. Check the API documentation.'};
                res.status(400).send(responseBody);
                return;
            }
            
            var APIKey = req.get('APIKey');

            if (!APIKey) {
                responseBody = {message: 'Missing APIKey header'};
                res.status(403).send(responseBody);
                return;
            }
            
            var tournamentPromise = storage.addTournamentAsync( req.body, APIKey );
            
            var successCallback = function(tournament){
                res.status(201).send(tournament);
            };
            
            var errorCallback = function(error){
                responseBody = {message: error};
                res.send(responseBody);
            };
            
            tournamentPromise.then(successCallback, errorCallback);
        }
    },
    {
        'type': 'GET',
        'name': 'tournaments/:id?',
        'response': function (req, res) {            
            var responseBody = {};
            
            var tournamentPromise = storage.getTournamentsAsync(req.params.id);
            
            var successCallback = function(tournamentsList){
                if( tournamentsList && tournamentsList.length ){
                    res.status(200).send(tournamentsList);
                } else {
                    responseBody = {message: 'Could not find tournament/tournaments'};
                    res.status(404).send(responseBody);   
                }
            };
            
            var errorCallback = function(error){
                responseBody = {message: error};
                res.status(500).send(responseBody);
            };
            
            tournamentPromise.then(successCallback, errorCallback);
        }
    },
    {
        'type': 'GET',
        'name': 'tournaments/:id/addUser',
        'response': function (req, res) {            
            var responseBody = {};
            
            var requiredProperties = ['name'];
            
            var tournamentPromise = storage.getTournamentsAsync(req.params.id);
            
            var successCallback = function(tournamentsList){
                if( tournamentsList && tournamentsList.length ){
                    res.status(200).send(tournamentsList);
                } else {
                    responseBody = {message: 'Could not find tournament/tournaments'};
                    res.status(404).send(responseBody);   
                }
            };
            
            var errorCallback = function(error){
                responseBody = {message: error};
                res.status(500).send(responseBody);
            };
            
            tournamentPromise.then(successCallback, errorCallback);
        }
    }
];
