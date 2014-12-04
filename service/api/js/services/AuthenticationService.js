var Q = require('q');
var UUID = require('node-uuid');

var UserDao = require('../dao/UserDao');
var SessionDao = require('../dao/SessionDao');


module.exports = {
    login: function(username, password){
        var deferred = Q.defer();
        
        UserDao.findByUsernameWithPassword( username ).then( function( accountList ){
            
            if( accountList.length == 0 ){
                console.log('Could not find user \'' + username + '\' in database');
                deferred.reject('User not found');
                return;
            }
            
            if( accountList.length > 1 ){ 
                console.log('More than one account with username \'' + username + '\' found by dao');
                deferred.reject( new Error('More than one account with that username returned by dao'));
                return;
            }
            
            var account = accountList[0];
            if( account.password == password ){
                SessionDao.createSession().then( function(sessionId){
                    deferred.resolve( sessionId );   
                }, function(){
                    deferred.reject( new Error('Could not create session in db') );   
                });
            } else {
                deferred.reject( new Error('Could not authenticate'));  
            }
            
        }, function(){
             deferred.reject( new Error('UserDao could not find user'));
        });
        
        return deferred.promise;
    },
    
    checkAuthorization: function(sessionId, requestedPermission){
        var deferred = Q.defer();
        // retrieve session from database
        // if session is still valid,
        // compare requested permission to stored permissions
        // if successful, return true else false
        // if session has timed out, call logout and return error to caller
        
        deferred.resolve(true);
        
        return deferred.promise;
    },
    
    logout: function(sessionId){
        var deferred = Q.defer();
        // delete session from database
        // (caller will delete cookie)
        deferred.resolve();
        
        return deferred.promise;
    }
};