var request = require('request');
var Q = require('q');
var bitcoin = require('bitcoinjs-lib');

var serviceURL = 'http://localhost:8080/api/v0/';

console.log('RESTWrapper pointing to ' + serviceURL);

var debug = false;

var endpointURLs = {
    users: 'users', 
    login: 'login',
    logout: 'logout',
    session: 'session',
    tournaments: 'tournaments',
    registration: 'registrations'
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
    },
    
    
    UserHelper: {
        createAndSignIn: function(name){
            var deferred = Q.defer();
            
            var user = {
                username: name ? name : ('testUser' + Math.floor(Math.random()*100000000).toString()) ,
                password: 'password',
                receivingAddress: bitcoin.ECKey.makeRandom().pub.getAddress().toString()
            };
            
            postToService( endpointURLs.users, user ).then( function(){
                postToService( endpointURLs.login, user).then( function(){
                    deferred.resolve(user);
                }).fail( function(error){
                    deferred.reject( new Error('could not sign in user: ' + error.message));
                });
            }).fail( function(error){
                deferred.reject( new Error('could not create user: ' + error.message ));
            });
            
            return deferred.promise;
        }
    },
    
    TournamentHelper: {
        createNoPrizeTournament: function(){
            
            var tournament = {
                name: 'testFreeTournament' + Math.floor(Math.random()*100000000).toString(),
                totalPlayers: 2
            };

            return postToService( endpointURLs.tournaments, tournament );
        },
        createPrizeTournament: function(){

            var currencyAmount = Math.floor( Math.random()*1000 );
            var currencyIndex = Math.floor( Math.random()*4 );

            var currencyList = ['USD', 'BTC', 'mBTC', 'uBTC'];
            var currency = currencyList[ currencyIndex ];

            var tournament = {
                name: 'testPrizeTournament' + Math.floor(Math.random()*100000000).toString(),
                totalPlayers: 2,
                prizeCurrency: currency,
                prizeAmount: currencyAmount
            };

            return postToService( endpointURLs.tournaments, tournament );
        },
        createBuyinTournament: function(){
            
            var tournament = {
                name: 'testBuyinTournament' + Math.floor(Math.random()*100000000).toString(),
                totalPlayers: 2,
                prizeAmount: 0,
                prizeCurrency: 'BTC',
                buyinCurrency: 'USD',
                buyinAmount: 1
            };

            return postToService( endpointURLs.tournaments, tournament );
        }
    }
};
