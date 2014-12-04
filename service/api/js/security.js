var Q = require('q');
var UUID = require('node-uuid');

var UserDao = require('UserDao');
var SessionDao = require('SessionDao');

var activeSessionId;

module.exports = {
    login: function(username, password){
        var deferred = Q.defer();
        
        UserDao.findUser( username ).then( function( account ){
            
            if( account.password == password ){
                SessionDao.createSession().then( function(sessionId){
                    deferred.resolve( sessionId );   
                }, function(){
                    deferred.reject( new Error('Could not create session in db') );   
                });
            } else {
                deferred.reject( new Error('Could not authenticate');   
            }
            
        }, function(){
             deferred.reject( new Error('Could not find user');
        });
        
    },
    
    checkAuthorization: function(sessionId, requestedPermission){
        var deferred = Q.defer();
        // retrieve session from database
        // if session is still valid,
        // compare requested permission to stored permissions
        // if successful, return true else false
        // if session has timed out, call logout and return error to caller
        
        if( sessionId == activeSessionId ){
            deferred.resolve();
        } else {
            deferred.reject();
        }
        
        return deferred.promise;
    },
    
    logout: function(sessionId){
        var deferred = Q.defer();
        // delete session from database
        // (caller will delete cookie)
        activeSessionId = undefined;
        deferred.resolve();
        
        return deferred.promise;
    }
};