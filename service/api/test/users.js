var RESTService = require('./serviceWrapper.js');

describe('Users', function(){
    describe('Create User', function(){
        it('Should return a new user href when called successfully', function(done){
            
            var user = {
                name: 'TestUser',
                username: 'testuser' + Math.floor(Math.random()*100000000).toString(),
                password: 'password'
            };
            
            RESTService.createUser( user ).then( function(user){
                if( user && user.href && user.name){
                    done();
                } else {
                    done('request succeeded, but received bad user data: ' + JSON.stringify(user));   
                }
            }, function(error){
                done('failed to create user: ' + error);   
            });
            
        });
    });
    
    describe('Get Users List', function(){
        it('Should get list of users', function(done){
              
            var user = {
                name: 'TestUser',
                username: 'testuser' + Math.floor(Math.random()*100000000).toString(),
                password: 'password'
            };
            var numUsers;
            
            RESTService.getUsers().then( function(usersList){
                if( usersList && usersList.length){
                    numUsers = usersList.length;
                } else {
                    done('could not get users list');
                }
                return RESTService.createUser( user );
            }, function(){
                done('can\'t get list of users');   
            })
            .then( function(user){
                return RESTService.getUsers();
            }, function(){
                done('couldn\'t create user');   
            })
            .then( function(usersList){
                if( usersList && usersList.length && usersList.length == (numUsers+1) ){
                    done();
                } else {
                    done( 'bad data for usersList' );   
                }
            }, function(){
                done('couldn\'t get list of users again');   
            });
            
        });
    });
    
    /*describe('Get User', function(){
        it('Should get a specific user', function(done){
            
            var user = { name: 'John Tibble'};
            var createdUser;
            
            RESTService.createUser( user ).then( function(storedUser) {
                createdUser = storedUser;
                return RESTService.getByHREF(createdUser.href);
            })
            .then( function( userList ){
                if( userList && userList.length && userList[0].href && userList[0].href == createdUser.href ){
                    done();
                } else {
                    done( 'bad data retrieved for user' );   
                }
            });

        });
    });*/
});