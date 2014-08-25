var request = require('request');

var tempData = {};

module.exports = {
    getLastUserId: function(){
        return tempData.lastUserId;
    },
    
    createUser: function( user, done ){
        var options = {
            url: 'http://localhost/api/v0/users/create',
            method: 'POST',
            body: user,
            json: true
        };

        function callback(error, response, body) {
            if (!error && response && response.statusCode == 200) {
                if( body.data && body.data.id ){
                    console.log('User created with id ' + body.data.id);
                    tempData.lastUserId = body.data.id;
                    done();
                } else {
                    throw 'POST succeeded, but received bad data: ' + JSON.stringify(body);   
                }
            } else {
                throw 'Failed to create user';
            }
        }

        request( options, callback );
    },
    
    createTournament: function( tournament, userId, done ){
        
        var options = {
            url: 'http://localhost/api/v0/tournaments/create',
            method: 'POST',
            body: tournament,
            headers: {
                UserId: userId  
            },
            json: true
        };

        function callback(error, response, body) {
            if (!error && response && response.statusCode == 200) {
                if( body.data && body.data.tournamentId ){
                    console.log('Tournament created with id ' + body.data.tournamentId);
                    done();
                } else {
                    throw 'POST succeeded, but received bad data: ' + JSON.stringify(body);   
                }
            } else {
                throw 'Failed to create tournament';
            }
        }

        request( options, callback ); 
    }
};