var request = require('request');
var Q = require('q');

var serviceURL = 'http://localhost:8080/api/v0/';

var debug = true;

var endpointURLs = {
    users: 'users', 
    login: 'login',
    logout: 'logout',
    session: 'session',
    tournaments: 'tournaments',
    registration: 'registration'
};

var cookiesEnabled = false;
var j = request.jar();

function postToService( endpoint, body ){
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
            deferred.reject('service returned bad response: ' + error);
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

function getResource( endpoint, query ){
    var deferred = Q.defer();
    
    var options = {
        method: 'GET',
        url: serviceURL + endpoint,
        json: true
    };
    
    if( query ){
        options.url += '?' + query;   
    }
    
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
    getSession: function(){
        return getResource( endpointURLs.session );  
    },
    getUsers: function(username){
        var endpoint = 'users' + (username ? ('/' + username) : '');
        return getResource( endpoint);
    },
    createTournament: function( tournament ){
        return postToService( endpointURLs.tournaments, tournament );
    },
    getTournaments: function(query){
        return getResource( endpointURLs.tournaments, query);
    },
    changeTournamentStatus: function(id, status){
        return postToService( endpointURLs.tournaments + '/' + id, {status: status});   
    },
    registerUserForTournament: function( tournamentId ){
        return postToService( endpointURLs.registration, {tournamentId: tournamentId});   
    }
};
