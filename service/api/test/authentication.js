var RESTService = require('./RESTWrapper');
//var assert = require('assert');

describe('Authentication', function(){
    
    var user = {
        "name": "John Tibble",
        "username": "jtibble" + Math.floor(Math.random()*10000000).toString(),
        "password": "password"
    };
    
    before( function(done){
        
        RESTService.createUser( user ).then( function(storedUser){
            user = storedUser;
            done();
        }, function( response ){
            done('failed to create user: ' + response);
        });
        
        RESTService.enableCookies();
    });
    
    describe('Login', function(){
        it('Should log in successfully', function(done){

            RESTService.loginUser( user.username, user.password ).then( function(){
                
                var cookies = RESTService.getCookies();

                if( cookies && cookies.length == 1 && 
                    cookies[0].key == 'sessionId' ){
                    done();
                } else {
                    done('cookies not set correctly');   
                }
            }, function(error){
                done('login failed: ' + error);   
            });
            
        });
        
        it('Should fail login with wrong password', function(done){

            RESTService.loginUser( user.username, 'randomPassword' ).then( function(){
                
                var cookies = RESTService.getCookies();

                if( cookies && cookies.length == 1 && 
                    cookies[0].key == 'sessionId' ){
                    done('should not have gotten a session!');
                } else {
                    done('should not have returned 200 OK');   
                }
            }, function(error){
                done();   
            });
            
        });
        
        it('Should fail login with wrong username', function(done){

            RESTService.loginUser( 'randomUsername', user.password ).then( function(){
                
                var cookies = RESTService.getCookies();

                if( cookies && cookies.length == 1 && 
                    cookies[0].key == 'sessionId' ){
                    done('should not have gotten a session!');
                } else {
                    done('should not have returned 200 OK');   
                }
            }, function(error){
                done();   
            });
            
        });
    });
    
    describe('Logout', function(){
        it('Should log out successfully', function(done){
            RESTService.loginUser( user.username, user.password ).then( function(){
                
               return RESTService.logoutUser(); 
                
            }, function(){
                done('failed to log in');
            }).then( function(){
                
                var cookies = RESTService.getCookies();
                if( !cookies || cookies.length == 0 ){
                    done();
                } else {
                    done('did not delete cookie successfully');   
                }
                
            }, function(){
                done('failed to log out');  
            });
        });
    });
});
	