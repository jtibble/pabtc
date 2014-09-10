var storage = require('../storage.js');
var requestValidator = require('./requestValidator.js');

module.exports = [
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
            
            var successCallback = function(user){                
                console.log('Created user ' + user.name + ' with href ' + user.href);
                res.status(201).send(user);
            };
            
            var errorCallback = function(error){
                responseBody.success = false;
                    responseBody = {message: 'Could not create user'};
                res.status(500).send(responseBody);
            };

            storage.addUserAsync( req.body ).then(successCallback, errorCallback);
        }
    },
    {
        'type': 'GET',
        'name': 'users/:id?',
        'response': function (req, res) {

            if( req.params && req.params.id ){
                console.log('Requested users/' + req.params.id);
            }
            
            var responseBody = {};

            var successCallback = function(usersList){
                if( usersList ){
                    for( var i in usersList){
                        usersList[i].APIKey = usersList[i].APIKey ? true : false;
                    }
                    res.status(200).send(usersList);
                } else {
                    responseBody = {message: 'Could not find user/users'};
                    res.status(404).send(responseBody);
                }
            };
            
            var errorCallback = function(error){
                responseBody.issues = ['Could not find user/users'];
                res.status(404).send(responseBody);
            };

            storage.getUsersAsync( req.params.id ).then(successCallback, errorCallback);
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

            var successCallback = function(APIKey){
				
                if( APIKey ){
					responseBody = {
						message: 'WARNING: This API key can only be generated once. If you lose it, you will need to create a new account. No exceptions.',
						key: APIKey
					};
					res.status(201).send(responseBody);
                } else {
                	responseBody.issues = ['Error Creating API Key', error];
                    res.status(500).send(responseBody);
                }
            };
            
            var errorCallback = function(error){
                responseBody.issues = ['Error Creating API Key', error];
                res.status(500).send(responseBody);
            };

            storage.createAPIKey( req.params.id ).then(successCallback, errorCallback);
        }
    }
];