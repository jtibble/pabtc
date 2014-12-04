var AuthenticationService = require('../services/AuthenticationService');

var cookieAge = 900000; // 15 minutes

module.exports = [
    {
        'type': 'POST',
        'name': 'login',
        'response': function (req, res){
            var responseBody = {};
            
            AuthenticationService.login( req.body.username, req.body.password ).then( function(sessionId){
                console.log('User ' + req.body.username + ' logged in');
                res.cookie('sessionId', sessionId, {maxAge: cookieAge});
                res.status(200).send(responseBody);
            }, function(error){
                console.log('User ' + req.body.username + ' failed to log in because ' + error.message);
                res.clearCookie('sessionId');
                responseBody.issues = ['Authentication failed', error.message];
                res.status(401).send(responseBody); 
            });
        }
    },
    {
        'type': 'POST',
        'name': 'logout',
        'response': function (req, res){
            AuthenticationService.logout( req.cookies.sessionId ).then( function(){
                res.clearCookie('sessionId');
                res.status(200).send();
            }, function(){
                throw new Error('could not delete session from storage');   
            });
        }
    },
]