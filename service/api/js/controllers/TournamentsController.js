var RequestValidator = require('./RequestValidator');
var TournamentsService = require('../services/TournamentsService');
var AuthenticationService = require('../services/AuthenticationService');

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
            
            if( req.body.buyinAmount > 0){            
                if( req.body.buyinCurrency == 'USD' && req.body.buyinAmount < 0.01 ||
                    req.body.buyinCurrency == 'BTC' && req.body.buyinAmount < 0.0001 ||
                    req.body.buyinCurrency == 'mBTC' && req.body.buyinAmount < 0.1 ||
                    req.body.buyinCurrency == 'μBTC' && req.body.buyinAmount < 100 ){
                    responseBody = {message: 'Buyin amount too small. Must be more than 100 μBTC'};
                    res.status(400).send(responseBody);
                    return;
                }
            }
            
            if( req.body.prizeAmount > 0 ){
                if( req.body.prizeCurrency == 'USD' && req.body.prizeAmount < 0.01 ||
                    req.body.prizeCurrency == 'BTC' && req.body.prizeAmount < 0.0001 ||
                    req.body.prizeCurrency == 'mBTC' && req.body.prizeAmount < 0.1 ||
                    req.body.prizeCurrency == 'μBTC' && req.body.prizeAmount < 100 ){
                    responseBody = {message: 'Prize amount too small. Must be more than 100 μBTC'};
                    res.status(400).send(responseBody);
                    return;
                }
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
        'name': 'tournaments',
        'response': function (req, res) {            
            var responseBody = {};
            
            TournamentsService.find( req.query ).then( function(tournamentsList){
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
    },
    {
        'type': 'POST',
        'name': 'tournaments/:id',
        'response': function (req, res) {      
            var responseBody = {};
            
            TournamentsService.update( req.params.id, req.body ).then( function(){
                res.status(200).send();
            }, function(error){
                res.status(500).send( error.message ); 
            });
        }
    }
    /*,
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
