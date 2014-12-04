var request = require('request');
var Q = require('q');

var serviceURL = 'http://localhost:8080/api/v0/';

var endpointURLs = {
    users: 'users', 
    login: 'login',
    logout: 'logout',
    tournaments: 'tournaments'
};

var cookiesEnabled = false;
var j = request.jar();

function postToService( endpoint, body, debug ){
    var deferred = Q.defer();

    var options = {
        method: 'POST',
        url: serviceURL + endpoint,
        json: true,
        body: body
    };
    
    if( cookiesEnabled ){
        options.jar = j;
    }

    if( debug ){
        console.log('Cookies Enabled? ' + cookiesEnabled);
        console.log('POSTing ' + JSON.stringify(options.body) + ' to ' + options.url);
    }
    
    request( options, function(error, response, body){
        
        if( error || !response || !response.statusCode ){
            deferred.reject('service returned bad response');
            return;
        }

        if( response && (response.statusCode == '200' || response.statusCode == '201')){
            
            if( debug ){
                console.log('resolving promise with data to caller');
                console.log('cookies: ' + j.getCookies( serviceURL ));
            }
            deferred.resolve(body);
            return;
        } else {
            var errorMessages = 'service returned HTTP ' + response.statusCode;
            if( response.body && response.body.length ){
                errorMessages += ' ' + JSON.stringify(response.body);   
            }
            deferred.reject(errorMessages);
            return;
        }
    });
    return deferred.promise;
}

function getResource( href ){
    var deferred = Q.defer();

    var options = {
        method: 'GET',
        url: href,
        json: true
    };
    
    if( cookiesEnabled ){
        options.jar = j;
    }

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
}




module.exports = {
    
    // Authentication
    enableCookies: function(){
        cookiesEnabled = true;
    },
    disableCookies: function(){
        cookiesEnabled = false;
    },
    getCookies: function(){
        return j.getCookies( serviceURL );
    },
    
    
    createUser: function( user ){
        return postToService( endpointURLs.users, user );
    },
    
    loginUser: function( username, password ){
        
        var body = {
            username: username,
            password: password
        };
        
        return postToService( endpointURLs.login, body );
    },
    
    logoutUser: function(){
        return postToService( endpointURLs.logout, {} );
    },
    
    
    
    
    getUsers: function(username){
        var endpoint = 'users' + (username ? ('/' + username) : '');
        return getResource( serviceURL + endpoint);
    },
    
    createTournament: function( tournament, APIKey ){
        return postToService( endpointURLs.tournaments, tournament );
    }
    
    /*,
    
    getTournaments: function(id){
        var endpoint = 'tournaments' + (id ? ('/' + id) : '');
        return getResource( serviceURL + endpoint);
    },
    
    // CREATE Resources
    
    
    
    
    registerUsersForTournament: function(tournamentId, usersList){
        return postToService( {
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
	}*/
};
