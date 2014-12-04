var RESTService = require('./RESTWrapper');
var assert = require('assert');

describe('Tournaments', function(){
    
    var user;
    
    before( function(done){
        var user = {
            name: 'TestTournamentUser',
            username: 'testuser' + Math.floor(Math.random()*100000000).toString(),
            password: 'password'
        };
        
        RESTService.createUser( user )
        .then( function(storedUser){
            user = storedUser;
            return RESTService.loginUser( user.username, user.password );
        }, function(){
            done('could not create user');   
        })
        .then( function(){
            done();
        }, function(){
            done('could not log in user');   
        })
    });
    
    describe('Create Basic Tournament', function(){
    
        it('Should create tournament', function(done){

            var tournament = {name: 'test tournament'};

            RESTService.createTournament( tournament )
            .then( function(tournament){
                if( tournament && tournament.name && tournament.dateCreated ){
                    done();
                } else {
                    done('tournament did not contain all the expected properties');   
                }
            }, function(error){
                done('could not create tournament: ' + error);
            });

        });
        
        it('Should not be able to create tournament (no session)', function(done){

            var tournament = {name: 'test tournament'};

            RESTService.disableCookies();
            RESTService.createTournament( tournament )
            .then( function(tournament){
                if( tournament && tournament.name && tournament.dateCreated ){
                    done('should not have been able to create the tournament');
                } else {
                    done('tournament did not contain all the expected properties');   
                }
            }, function(error){
                done();
            });

        });
        
        it('Should not be able to create tournament (no name)', function(done){

            var tournament = {};
            
            RESTService.createTournament( tournament )
            .then( function(tournament){
                if( tournament && tournament.name && tournament.dateCreated ){
                    done('should not have been able to create the tournament');
                } else {
                    done('tournament did not contain all the expected properties');   
                }
            }, function(error){
                done();
            });

        });
    
    }); 
	
    /*describe('Create Basic Tournament - No API Key', function(){
        it('Should create user, try to create tournament with no API key, and fail', function(done){
                
            var tournament = {name: 'test tournmanet'};
            var bogusAPIKey = 'bogus API key!'
            
            RESTService.createTournament( tournament, bogusAPIKey )
            .then( function(tournament){
                done('should not have created tournament');           
            }, function(){
                done();
            });
			
        });
    }); 
    
    describe('Get Tournaments List', function(){
        it('Should create user, get API key, create tournament, and fetch all tournaments', function(done){

            var tournament = {name: 'test tournmanet'};
            var numTournaments;
            
            RESTService.getTournaments()
            .then( function(tournamentsList){
                numTournaments = tournamentsList.length;
                return RESTService.createTournament( tournament, userAPIKey );
            })
            .then( function(tournament){
                return RESTService.getTournaments();                
            })
            .then( function(tournamentsList){
                if( tournamentsList && tournamentsList.length && tournamentsList.length == (numTournaments + 1) ){
                    done();     
                } else {
                    done('failed to create tournament correctly');   
                }
            });
          
        });	
	});
    
    describe('Register Users For Tournament', function(){
        it('Should create tournament, and register users for it', function(done){

            // Create user that will then create tournament
            var tournament = {name: 'test registration tournmanet'};
            
            RESTService.createTournament( tournament, userAPIKey )
            .then( function(savedTournament){
                tournament = savedTournament;
                return RESTService.registerUsersForTournament( savedTournament._id, [user._id]);     
            })
            .then( function(registration){
                return RESTService.getTournaments(tournament._id);
            })
            .then( function(tournamentsList){
                if( tournamentsList.length != 1){
                    done('more than one tournament returned');
                    return;
                }
                
                if( tournamentsList[0]._id == tournament._id &&
                    tournamentsList[0].registeredPlayers[0].name == user.name ){
                        done();
                } else {
                    done('user could not be found in tournament they registered for');
                }
                
                
            });
          
        });	
	});*/
});