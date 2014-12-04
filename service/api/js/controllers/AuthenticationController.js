var AuthenticationService = require('../services/AuthenticationService');

var cookieAge = 900000; // 15 minutes

module.exports = [
    {
        'type': 'POST',
        'name': 'login',
        'response': function (req, res){
            var responseBody = {};
            
            console.log('username/password: ' + req.body.username + '/' + req.body.password);
            
            AuthenticationService.login( req.body.username, req.body.password ).then( function(sessionId){
                res.cookie('sessionId', sessionId, {maxAge: cookieAge});
                res.status(200).send(responseBody);
            }, function(error){
                res.clearCookie('sessionId');
                responseBody.issues = ['Authentication failed', error];
                res.status(401).send(responseBody); 
            });
        }
    },
    {
        'type': 'POST',
        'name': 'logout',
        'response': function (req, res){
            AuthenticationService.logout( req.cookies.sessionId ).then( function(){
                console.log('session destroyed, clearing client session cookie');
                res.clearCookie('sessionId');
                res.status(200).send();
            }, function(){
                throw new Error('could not delete session from storage');   
            });
        }
    },
]