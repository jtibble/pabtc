var request = require('request');
var Q = require('q');

var serviceURL = 'http://localhost:8080/api/v0/';

module.exports = {
    
    makeRequestAsync: function( options ){
        var deferred = Q.defer();
        
        options.url = serviceURL + options.endpoint;
        options.json = true;
        
        request( options, function(error, response, body){
            if( !error && response ){
                deferred.resolve(body);
                return;
            } else {
                deferred.reject('service returned HTTP ' + response.statusCode);
            }
            return;    
        });
        return deferred.promise;
    },
    
    getResourceByHREF: function(href){
        var deferred = Q.defer();
        
        var options = {
            url: href,
            method: 'GET',
            json: true,
        };
        
        request( options, function(error, response, body){
            if( !error && response ){
                deferred.resolve(body);
                return;
            } else {
                deferred.reject('service returned HTTP ' + response.statusCode);
            }
            return;    
        });
        return deferred.promise;
    },
    
    createUser: function( user ){
        var options = {
            endpoint: 'users',
            method: 'POST',
            body: user
        };
        
        return this.makeRequestAsync( options );
    },
    
    getUsers: function(id){
        var options = {
            endpoint: 'users',
            method: 'GET'
        };
        
        if( id ){
            options.endpoint += '/' + id;
        }
        
        return this.makeRequestAsync( options );
    },
    
    createTournament: function( tournament, userId ){
        var options = {
            endpoint: 'tournaments',
            method: 'POST',
            body: tournament,
            headers: {
                UserId: userId
            }
        };
        
        return this.makeRequestAsync( options );
    },
    
    getTournaments: function(id){
        var options = {
            endpoint: 'tournaments',
            method: 'GET'
        };
        
        if( id ){
            options.endpoint += '/' + id;
        }
        
        return this.makeRequestAsync( options );
    }
};
