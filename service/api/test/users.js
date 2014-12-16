var RESTService = require('./RESTWrapper');
var bitcoin = require('bitcoinjs-lib');

describe('Users', function(){
    describe('Create User', function(){
        it('Should return a new user when called correctly', function(done){
            
            var user = {
                username: 'testuser' + Math.floor(Math.random()*100000000).toString(),
                password: 'password',
                receivingAddress: bitcoin.ECKey.makeRandom().pub.getAddress().toString()
            };
            
            RESTService.createUser( user ).then( function(user){
                if( user && user.username && user.dateCreated ){
                    done();
                } else {
                    done('request succeeded, but received bad user data: ' + JSON.stringify(user));   
                }
            }, function(error){
                done('failed to create user: ' + error);   
            });
            
        });
        
        it('Should fail when called incorrectly', function(done){
            
            var user = {
                username: 'testuser' + Math.floor(Math.random()*100000000).toString()
            };
            
            RESTService.createUser( user ).then( function(user){
                if( user && user.username && user.dateCreated ){
                    done('should not have succeeded');
                } else {
                    done('request succeeded, but received bad user data: ' + JSON.stringify(user));   
                }
            }, function(error){
                done();   
            });
            
        });
    });
    
    describe('Get Users List', function(){
        it('Should get list of users', function(done){
              
            var user = {
                name: 'TestUser',
                username: 'testuser' + Math.floor(Math.random()*100000000).toString(),
                password: 'password',
                receivingAddress: bitcoin.ECKey.makeRandom().pub.getAddress().toString()
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
});