var request = require('request');
var Q = require('q');

var tempData = {};

module.exports = {
    
    makeRequestAsync: function( options ){
        var deferred = Q.defer();
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
            url: 'http://localhost:8080/api/v0/users/create',
            method: 'POST',
            body: user,
            json: true
        };
        
        return this.makeRequestAsync( options );
    },
    
    getUsersAsync: function(){
        var options = {
            url: 'http://localhost:8080/api/v0/users',
            method: 'GET',
            json: true
        };
        
        return this.makeRequestAsync( options );
    },
    
    createTournament: function( tournament, userId ){
        var options = {
            url: 'http://localhost:8080/api/v0/tournaments/create',
            method: 'POST',
            body: tournament,
            headers: {
                UserId: userId
            },
            json: true
        };
        
        return this.makeRequestAsync( options );
    },
    
    getTournamentsAsync: function(){
        var options = {
            url: 'http://localhost:8080/api/v0/tournaments',
            method: 'GET',
            json: true
        };
        
        return this.makeRequestAsync( options );
    }
};
