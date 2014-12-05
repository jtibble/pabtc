//var storage = require('./storage.js');
var RequestValidator = require('../RequestValidator.js');
var TournamentsService = require('../services/TournamentsService');
var AuthenticationService = require('../services/AuthenticationService');

function createHREF( id ){
    var domain = 'tournaments';
    return 'http://localhost:8080/api/v0/' + domain + '/' + id;
}

module.exports = [
    {
        'type': 'POST',
        'name': 'tournaments',
        'response': function (req, res) {

            var responseBody = {};
            var requiredProperties = ['name'];
            
            if ( !RequestValidator.validate( req, requiredProperties )){
                responseBody = {message: 'Missing request body properties. Check the API documentation.'};
                res.status(400).send(responseBody);
                return;
            }
            
            var sessionId = req.cookies.sessionId;
            
            if( !sessionId ){
                console.log('Tournament \'' + req.body.name + '\' not created for user with missing sessionId');
                res.status(403).send(responseBody);
                return;   
            }
            
            // Check session and add the username to the new tournament
            AuthenticationService.checkAuthorization(sessionId).then( function(session){
                
                req.body.createdBy = session.username;
                
                TournamentsService.create( req.body ).then( function(tournament){
                    console.log('Tournament \'' + tournament.name + '\' created by user \'' + session.username + '\'');
                    res.status(201).send(tournament);
                }, function(error){
                    responseBody = {message: error.message};
                    res.status(403).send(responseBody);
                });
                
            }, function(error){
                console.log('Tournament \'' + req.body.name + '\' not created for user with invalid or expired session');
                res.status(403).send(responseBody);
                return; 
            });
            
        }
    },
    {
        'type': 'GET',
        'name': 'tournaments/:id?',
        'response': function (req, res) {            
            var responseBody = {};
            
            TournamentsService.find().then( function(tournamentsList){
                if( tournamentsList ){
                    res.status(200).send(tournamentsList);
                } else {
                    responseBody = {message: 'Could not find tournament/tournaments'};
                    res.status(404).send(responseBody);   
                }
            },  function(error){
                responseBody = {message: error.message};
                res.status(500).send(responseBody);
            });
        }
    }/*,
    {
        'type': 'POST',
        'name': 'tournaments/:id/registerUsers',
        'response': function (req, res) {      
            var responseBody = {};
            if ( !req.params.id || !req.body || !req.body.usersList){
                responseBody = {message: 'Bad request. Check the API documentation.'};
                res.status(400).send(responseBody);
                return;
            }
            
            storage.tournaments.registerUsers( req.params.id, req.body.usersList ).then( function(registration){
                if( registration ){
                   res.status(200).send(registration); 
                } else {
                   res.status(500).send(registration); 
                }
            }, function(message){ 
                res.status(500).send( {message: message} ); 
            });
        }
    },
    {
        'type': 'POST',
        'name': 'tournaments/:id/beginTournament',
        'response': function (req, res) {            
            var responseBody = {};
            res.status(501).send({message: 'beginTournament service is not available yet'});
        }
    },
    {
        'type': 'POST',
        'name': 'tournaments/:id/concludeTournament',
        'response': function (req, res) {            
            var responseBody = {};
            res.status(501).send({message: 'concludeTournament service is not available yet'});
        }
    }*/
];
