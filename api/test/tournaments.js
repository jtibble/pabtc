var RESTService = require('./serviceWrapper.js');
var assert = require('assert');

describe('Tournaments', function(){
    describe('Create Basic Tournament', function(){
        it('Should return a tournament id when called successfully', function(done){
            
            // Create user that will then create tournament
            var adminUser = {
                name: 'Admin User',
                permissions: {
                    'read': true,
                    'write': true,
                    'admin': true
                }
            };
            
            function callback(error, response, body) {
                assert( !error && response && response.statusCode == 200); 
                assert( body && body.data && body.data._id );

                var tournament = {
                    name: 'Test Tournament'
                };

                RESTService.createTournament( tournament, body.data._id, done );  
            }
            
            RESTService.createUser(adminUser, callback);
        });
    });   
});