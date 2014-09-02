var storage = require('../storage.js');
var requestValidator = require('./requestValidator.js');

module.exports = [
    {
        'type': 'POST',
        'name': 'users/create',
        'response': function (req, res) {
            var requiredProperties = ['name', 'permissions'];

            var responseBody = {
                success: false,
                issues: []
            };

            if ( !requestValidator.validate( req, requiredProperties )){
                responseBody.success = false;
                responseBody.issues = ['Missing request body properties. Check the API documentation.'];
                res.send(responseBody);
                return;
            }
            
            var successCallback = function(user){
                responseBody = {
                    'sucess': true,
                    'data': user
                };
                console.log('Created user ' + user.name + ' with id ' + user._id);
                res.send(responseBody);
            };
            
            var errorCallback = function(error){
                responseBody.success = false;
                responseBody.issues = ['Could not create user'];
                res.send(responseBody);
            };

            storage.addUserAsync( req.body ).then(successCallback, errorCallback);
        }
    }
];