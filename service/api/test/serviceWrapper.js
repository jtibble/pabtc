var request = require('request');
var Q = require('q');

var serviceURL = 'http://localhost:8080/api/v0/';

module.exports = {
    
    // GET Resources
    getByHREF: function(href){
        var deferred = Q.defer();
        
        var options = {
            method: 'GET',
            url: href,
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
    
    getUsers: function(id){
        var endpoint = 'users' + (id ? ('/' + id) : '');
        return this.getByHREF( serviceURL + endpoint);
    },
    
    getTournaments: function(id){
        var endpoint = 'tournaments' + (id ? ('/' + id) : '');
        return this.getByHREF( serviceURL + endpoint);
    },
    
    // CREATE Resources
    
    postToService: function( options ){
        var deferred = Q.defer();
        
        options.method = 'POST';
        options.url = serviceURL + options.endpoint;
        options.json = true;
        
        request( options, function(error, response, body){
            if( error || !response || !response.statusCode ){
                deferred.reject('service returned bad response');
                return;
            }
            
            if( response && (response.statusCode == '200' || response.statusCode == '201')){
                deferred.resolve(body);
                return;
            } else {
                deferred.reject('service returned HTTP ' + response.statusCode);
                return;
            }
        });
        return deferred.promise;
    },
    
    createUser: function( user ){
        return this.postToService( {
            endpoint: 'users',
            body: user
        } );
    },
    
    createTournament: function( tournament, APIKey ){
        return this.postToService( {
            endpoint: 'tournaments',
            body: tournament,
            headers: {
                APIKey: APIKey
            }
        } );
    },
    
    registerUsersForTournament: function(tournamentId, usersList){
        return this.postToService( {
            endpoint: 'tournaments' + '/' + tournamentId + '/registerUsers',
            body: { usersList: usersList }
        } );
    },
    
	createUserAPIKey: function(user){      
        var deferred = Q.defer();
        
        var options = {
            url: user.href + '/generateAPIKey',
            method: 'POST',
            json: true
        };
        
        request( options, function(error, response, body){
            if( !error && response ){
                deferred.resolve(body.key); // Return key property on response body
                return;
            } else {
                console.log('error creating user API key');
                deferred.reject('service returned HTTP ' + response.statusCode);
            }
            return;    
        });
        return deferred.promise;
	}
};
