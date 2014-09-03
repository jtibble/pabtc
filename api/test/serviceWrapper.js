var request = require('request');
var Q = require('q');

var tempData = {};

module.exports = {
    
    createUser: function( user ){
        var deferred = Q.defer();
        
        var options = {
            url: 'http://localhost:8080/api/v0/users/create',
            method: 'POST',
            body: user,
            json: true
        };

        request( options, function(error, response, body){
            if( error ){
                deferred.reject(error);
                return;
            }
            
            if( response && response.statusCode == 200 && body ){
                deferred.resolve(body.data);
                return;
            }
        });
        
        return deferred.promise;
    },
    
    getUsersAsync: function(){
        
        var deferred = Q.defer();
        
        var options = {
            url: 'http://localhost:8080/api/v0/users',
            method: 'GET',
            json: true
        };

        request( options, function(error, response, body){
            if( error ){
                deferred.reject(error);
                return;
            }
            
            if( response && response.statusCode == 200 && body ){
                deferred.resolve(body.data);
                return;
            }
        });
        
        return deferred.promise;
    },
    
    createTournament: function( tournament, userId ){
        
        var deferred = Q.defer();
        
        var options = {
            url: 'http://localhost:8080/api/v0/tournaments/create',
            method: 'POST',
            body: tournament,
            headers: {
                UserId: userId
            },
            json: true
        };

        request( options, function(error, response, body){
            if( error ){
                deferred.reject(error);
            }
            
            if( response && response.statusCode == 200 && body ){
                deferred.resolve(body.data);
            }
        }); 
        
        return deferred.promise;
    },
    
    getTournamentsAsync: function(){
        
        var deferred = Q.defer();
        
        var options = {
            url: 'http://localhost:8080/api/v0/tournaments',
            method: 'GET',
            json: true
        };

        request( options, function(error, response, body){
            if( error ){
                deferred.reject(error);
            }
            
            if( response && response.statusCode == 200 && body ){
                deferred.resolve(body.data);
            }
        });
        
        return deferred.promise;
    }
};
