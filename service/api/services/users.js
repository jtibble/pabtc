var storage = require('./storage.js');
var security = require('./security');
var requestValidator = require('./requestValidator.js');

function createHREF( id ){
    var domain = 'users';
    return 'http://localhost:8080/api/v0/' + domain + '/' + id;
}

module.exports = [
    {
        'type': 'POST',
        'name': 'login',
        'response': function (req, res){
            var responseBody = {};
            
            console.log('username/password: ' + req.body.username + '/' + req.body.password);
            
            security.login( req.body.username, req.body.password ).then( function(sessionId){
                res.cookie('sessionId', sessionId, {maxAge: 900000}); // 15 minutes
                res.status(200).send(responseBody);
            }, function(error){
                res.clearCookie('sessionId');
                responseBody.issues = ['Authentication failed'];
                res.status(401).send(responseBody); 
            });
        }
    },
    {
        'type': 'POST',
        'name': 'logout',
        'response': function (req, res){
            security.logout( req.cookies.sessionId ).then( function(){
                res.clearCookie('sessionId');
                res.status(200).send();
            }, function(){
                throw new Error('could not delete session from storage');   
            });
        }
    },
    {
        'type': 'POST',
        'name': 'users',
        'response': function (req, res) {
            var requiredProperties = ['name'];

            var responseBody = {};

            if ( !requestValidator.validate( req, requiredProperties )){
                responseBody.success = false;
                responseBody.issues = ['Missing request body properties. Check the API documentation.'];
                res.status(400).send(responseBody);
                return;
            }
            
            storage.users.create( req.body ).then( function(user){ 
                user.href = createHREF( user._id );
                console.log('Created user ' + user.name + ' with href ' + user.href);
                res.status(201).send(user);
            }, function(error){
                responseBody.success = false;
                responseBody.issues = ['Could not create user', error];
                res.status(500).send(responseBody);
            });
        }
    },
    {
        'type': 'GET',
        'name': 'users/:id?',
        'response': function (req, res) {

            var promise;
            if( req.params && req.params.id ){
                console.log('Requested users/' + req.params.id);
                promise = storage.users.find('_id', req.params.id);
            } else {
                promise = storage.users.find();
            }
            
            var responseBody = {};

            promise.then( function(usersList){
                if( usersList ){
                    for( var i in usersList){
                        usersList[i].href = createHREF( usersList[i]._id );
                    }
                    res.status(200).send(usersList);
                } else {
                    responseBody = {message: 'Could not find user/users'};
                    res.status(404).send(responseBody);
                }
            }, function(error){
                responseBody.issues = ['Could not find user/users', error];
                res.status(404).send(responseBody);
            });
        }
    },
    {
        'type': 'POST',
        'name': 'users/:id/generateAPIKey',
        'response': function (req, res) {

            var responseBody = {};
			
            if( !req.params || !req.params.id ){
				responseBody = {message: 'UserID is required to create an API Key'};
				res.status(400).send(responseBody);
            }

            storage.users.createAPIKey( req.params.id ).then( function(APIKey){
                if( APIKey ){
					responseBody = {
						message: 'WARNING: Do not lose this API key. It can only be generated once. No exceptions.',
						key: APIKey
					};
					res.status(201).send(responseBody);
                } else {
                	responseBody.issues = ['Error Creating API Key', error];
                    res.status(500).send(responseBody);
                }
            }, function(error){
                responseBody.issues = ['Error Creating API Key', error];
                res.status(500).send(responseBody);
            });
        }
    }
];