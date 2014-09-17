var storage = require('./storage.js');
var requestValidator = require('./requestValidator.js');

function createHREF( id ){
    var domain = 'users';
    return 'http://localhost:8080/api/v0/' + domain + '/' + id;
}

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
            
            storage.users.create( req.body ).then( function(user){ 
                user.href = createHREF( user._id );
                console.log('Created user ' + user.name + ' with href ' + user.href);
                res.status(201).send(user);
            }, function(error){
                responseBody.success = false;
                responseBody = {message: 'Could not create user'};
                res.status(500).send(responseBody);
            });
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

            storage.users.find('_id', req.params.id).then( function(usersList){
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
                responseBody.issues = ['Could not find user/users'];
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