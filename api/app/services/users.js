var storage = require('../storage.js');

module.exports = {
    'type': 'POST',
    'name': 'users/create',
    'response': function (req, res) {

        var responseBody = {
            success: false,
            issues: []
        };

        if (!req.body) {
            responseBody.success = false;
            responseBody.issues = ['Missing request body'];
            res.send(responseBody);
        }

        var user = req.body;

        if (!user.name) {
            responseBody.success = false;
            responseBody.issues = ['Missing user name'];
            res.send(responseBody);
        }

        if (!user.permissions) {
            responseBody.success = false;
            responseBody.issues = ['Missing user permissions'];
            res.send(responseBody);
        }

        var storedUser = storage.addUser(user);

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
};