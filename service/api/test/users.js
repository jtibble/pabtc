var RESTService = require('./serviceWrapper.js');

describe('Users', function(){
    describe('Create User', function(){
        it('Should return a new user href when called successfully', function(done){
            
            var user = {
                name: 'John Tibble'
            };
            
            function callback(user) {
                if( user && user.href ){
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
    
    describe('Get Users List', function(){
        it('Should get list of users', function(done){
            
            var user = {
                name: 'John Tibble'
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
    
    describe('Get User', function(){
        it('Should get a specific user', function(done){
            
            var newUser = {
                name: 'John Tibble'
            };
            
            function callback(createdUser) {
                function UserCallback( userList ){
                    if( userList && userList.length && userList[0].href && userList[0].href == createdUser.href ){
                        done();
                    } else {
                        done( 'bad data retrieved for user' );   
                    }
                };

                RESTService.getByHREF(createdUser.href).then(UserCallback, function(){
                    done('could not get user from REST service');
                });  
            }

            RESTService.createUser( newUser ).then( callback, function(error){
                done('could not create user: ' + error);
            });
        });
    });
});