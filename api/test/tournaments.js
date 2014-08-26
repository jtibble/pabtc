var RESTService = require('./serviceWrapper.js');

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
                if (!error && response && response.statusCode == 200) {
                    if( body.data && body.data.id ){
                       
                        // When the user has been created, continue creating the tournament
                        var tournament = {
                            name: 'Test Tournament'
                        };

                        RESTService.createTournament( tournament, body.data.id, done );
                        
                    } else {
                        throw 'POST succeeded, but received bad data: ' + JSON.stringify(body);   
                    }
                } else {
                    throw 'Failed to create user';
                }
            }
            
            RESTService.createUser(adminUser, callback);
            
        });
    });   
});