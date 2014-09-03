var request = require('request');
var Q = require('q');

var serviceURL = 'http://localhost:8080/api/v0/';

module.exports = {
    
    makeRequestAsync: function( options ){
        var deferred = Q.defer();
        
        options.url = serviceURL + options.endpoint;
        options.json = true;
        
        request( options, function(error, response, body){
            if( !error && response && response.statusCode == 200 && body ){
                deferred.resolve(body.data);
                return;
            } else {
                deferred.reject(error);
            }
            return;    
        });
        return deferred.promise;
    },
    
    createUser: function( user ){
        var options = {
            endpoint: 'users/create',
            method: 'POST',
            body: user
        };
        
        return this.makeRequestAsync( options );
    },
    
    getUsersAsync: function(){
        var options = {
            endpoint: 'users',
            method: 'GET'
        };
        
        return this.makeRequestAsync( options );
    },
    
    createTournament: function( tournament, userId ){
        var options = {
            endpoint: 'tournaments/create',
            method: 'POST',
            body: tournament,
            headers: {
                UserId: userId
            }
        };
        
        return this.makeRequestAsync( options );
    },
    
    getTournamentsAsync: function(){
        var options = {
            endpoint: 'tournaments',
            method: 'GET'
        };
        
        return this.makeRequestAsync( options );
    }
};
