var RESTService = require('./serviceWrapper.js');

describe('Users', function(){
    describe('Create Admin User', function(){
        it('Should return a new user id when called successfully', function(done){
            
            var user = {
                name: 'John Tibble',
                permissions: {
                    'admin': true,
                    'read': true,
                    'write': true
                }
            };
            
            function callback(user) {
                if( user && user._id ){
                    done();
                } else {
                    done('request succeeded, but received bad user data: ' + JSON.stringify(user));   
                }
            }

            RESTService.createUser( user ).then( callback, function(error){
                done('could not create user: ' + error);
            });
        });
    });
    
    describe('Create Incomplete User', function(){
        it('Should return an error', function(done){
            
            var user = {
                name: 'John Tibble' // Missing permissions
            };
            
            function callback(user) {
                if( user && user._id ){
                    done('user created, which is incorrect');
                } else {
                    done();
                }
            }

            RESTService.createUser( user ).then( callback, function(error){
                done('could not create user: ' + error);
            });
        });
    });
    
    describe('Get Users', function(){
        it('Should get list of users', function(done){
            
            var user = {
                name: 'John Tibble',
                permissions: {
                    'admin': true,
                    'read': true,
                    'write': true
                }
            };
            
            function callback(user) {
                function UsersListCallback( usersList ){
                    if( usersList && usersList.length ){
                        done();
                    } else {
                        done( 'bad data for usersList' );   
                    }
                };

                RESTService.getUsers().then(UsersListCallback, function(){
                    done('could not get users from REST service');
                });  
            }

            RESTService.createUser( user ).then( callback, function(error){
                done('could not create user: ' + error);
            });
        });
    });
});