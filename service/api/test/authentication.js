var RESTService = require('./serviceWrapper');
//var assert = require('assert');

describe('Authentication', function(){
    
    var user = {
        "name": "John Tibble",
        "username": "jtibble" + Math.floor(Math.random()*10000000).toString(),
        "password": "password"
    };
    
    before( function(done){
        
        RESTService.createUser( user )
        .then( function(storedUser){
            user = storedUser;
            done();
        }, function( response ){
            done('failed to create user: ' + response);
        });
        
    });
    
    describe('Login', function(){
        it('Should log in successfully', function(done){

            
            RESTService.enableCookies();
            
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

            
            RESTService.enableCookies();
            
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

            
            RESTService.enableCookies();
            
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
});
	