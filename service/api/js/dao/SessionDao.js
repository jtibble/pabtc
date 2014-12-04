var Schema = require('./schema.js');

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
                deferred.reject();   
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

//var usersCollection = db.collection('users');
//var tournamentsCollection = db.collection('tournaments');

/*db.runCommand({ping:1}, function(err, res) {
    if(!err && res.ok){
        console.log("MongoDB connection successful");
    } else {
        throw 'Failed to connect to MongoDB: check that it\'s running';   
    }
});*/