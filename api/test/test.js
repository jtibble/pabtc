var request = require('request');
var assert = require("assert")


/*console.log('Adding Users');

for( var i in fakeUsers ){
	var user = fakeUsers[i];
	var storedUser = module.exports.addUser( user );
	
	if( storedUser ){
		console.log('User \'' + storedUser.name + '\' stored in DB with id ' + storedUser.id);
	} else {
		console.log('Could not add user ' + user.name);	
	}
}*/

describe('Users', function(){
    describe('Create Admin User', function(){
        it('Should return a new user id when called successfully', function(done){
            
            var requestBody = {
                name: 'John Tibble',
                permissions: {
                    'read': true,
                    'write': true,
                    'admin': true
                }
            };

            var options = {
                url: 'http://localhost/api/v0/users/create',
                method: 'POST',
                body: requestBody,
                followAllRedirects: true,
                json: true
            };

            function callback(error, response, body) {
                if (!error && response && response.statusCode == 200) {
                    console.log('User created with ID ' + body.data.id);
                    done();
                } else {
                    if( response && response.statusCode ){ 
                        console.log('HTTP Status Code ' + response.statusCode );
                    }
                    if( error ){
                        console.log(error);
                    }
                    throw 'Failed to create user';
                }
            }
            
            request( options, callback );
        });
    });
    

        /*var fakeUsers = [
                {
                    name: 'John Tibble',
                    permissions: {
                        'read': true,
                        'write': true,
                        'admin': true
                    }
                },
                {
                    name: 'Read User',
                    permissions: {
                        'read': true
                    }
                },
                {
                    name: 'Full (non-admin) User',
                    permissions: {
                        'read': true,
                        'write': true
                    }
                },
                {
                    name: 'Read User 2',
                    permissions: {
                        'read': true
                    }
                },
                {
                    name: 'No Permissions User',
                    permissions: {}
                }
        ];*/
    
    /*describe('Create', function(){
        it('should return a new user id when called successfully', function(done){
            
            var requestBody = {};

            var options = {
                url: 'http://localhost/api/v0/users/create',
                method: 'POST',
                json: requestBody
            };

            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var responseBody = JSON.parse(body);
                    console.log('User created with ID ' + responseBody.data.userId);
                    done();
                } else {
                    throw 'Failed to create user';
                }
            }
            
            request( options, callback );
        })
    });*/
});