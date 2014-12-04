var Q = require('q');
var UUID = require('node-uuid');

var UserDao = require('../dao/UserDao');
var SessionDao = require('../dao/SessionDao');


module.exports = {
    login: function(username, password){
        var deferred = Q.defer();
        
        UserDao.find( 'username', username ).then( function( accountList ){
            
            if( accountList.length != 1 ){ 
                deferred.reject( new Error('More than one account with that username returned by dao'));
                return;
            }
            
            var account = accountList[0];
            console.log('found account: ' + JSON.stringify(account));
            console.log('incoming password is \'' + password + '\'');
            if( account.password == password ){
                console.log('password is correct');
                SessionDao.createSession().then( function(sessionId){
                    deferred.resolve( sessionId );   
                }, function(){
                    deferred.reject( new Error('Could not create session in db') );   
                });
            } else {
                console.log('password incorrect');
                deferred.reject( new Error('Could not authenticate'));  
            }
            
        }, function(){
             deferred.reject( new Error('Could not find user'));
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