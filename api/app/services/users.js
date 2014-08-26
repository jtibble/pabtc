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

            var storedUser = storage.addUser( req.body );

            if (!storedUser) {
                responseBody.success = false;
                responseBody.issues = ['Could not create user'];
                res.send(responseBody);
            } else {
                responseBody = {
                    'sucess': true,
                    'data': storedUser
                };
                console.log('Created user with id ' + storedUser.id);
                res.send(responseBody);
            }

        }
    }
];