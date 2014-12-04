var Schema = require('../model/Schema.js');

var UUID = require('node-uuid');
var Q = require('q');

var mongojs = require('mongojs');
var db = mongojs('test');
var sessionCollection = db.collection('sessions');

module.exports = {
    createSession: function(){
        var deferred = Q.defer();
        
        var newSession = Schema.create('session');
        
        sessionCollection.save( newSession, function(error, result){
            if( !error && result ){
                deferred.resolve( result._id );
            } else {
                deferred.reject( new Error('Could not save session in db'));   
            }
        });
        
        return deferred.promise;
    },
    findSession: function(sessionId){
        var deferred = Q.defer();
        
        return deferred.promise;
    },
    deleteSession: function(){
        var deferred = Q.defer();
        
        return deferred.promise;
    }
};