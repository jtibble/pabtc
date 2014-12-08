var RequestValidator = require('./RequestValidator');
var TournamentsService = require('../services/TournamentsService');
var AuthenticationService = require('../services/AuthenticationService');

var RegistrationService = require('../services/RegistrationService');

module.exports = [
    {
        'type': 'POST',
        'name': 'registrations',
        'response': function (req, res) {

            var responseBody = {};
            var requiredProperties = ['tournamentId'];
            
            if ( !RequestValidator.validate( req, requiredProperties )){
                responseBody = {message: 'Missing request body properties. Check the API documentation.'};
                res.status(400).send(responseBody);
                return;
            }
            
            var sessionId = req.cookies.sessionId;
            
            if( !sessionId ){
                console.log('Registration not created for user with missing sessionId');
                res.status(403).send(responseBody);
                return;   
            }
            
            // Check session and add the username to the new tournament
            AuthenticationService.checkAuthorization(sessionId).then( function(session){
                
                var username = session.username;
                
                RegistrationService.create( username, req.body.tournamentId ).then( function(registration){
                    console.log('User ' + registration.username + ' registered for tournament ' + registration.tournamentId );
                    res.status(200).send();
                }, function(error){
                    responseBody = {message: error.message};
                    res.status(403).send(responseBody);
                });
                
            }, function(error){
                console.log('Registration not created for user with invalid or expired session');
                res.status(403).send(responseBody);
                return; 
            });
            
        }
    }
];