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
            
            RESTService.createUser(adminUser, function(){
                
                // When the user has been created, continue creating the tournament
                var tournament = {
                    name: 'Test Tournament'
                };

                RESTService.createTournament( tournament, RESTService.getLastUserId(), done );
            });
            
        });
    });   
});