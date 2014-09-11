var RESTService = require('./serviceWrapper.js');
var assert = require('assert');

describe('Tournaments', function(){
    
    var user;
    var userAPIKey;
    
    before( function(done){
        var tournamentsTestUser = { name: 'TournamentsTestUser' };
        
        RESTService.createUser( tournamentsTestUser )
        .then( function(storedUser){
            user = storedUser;
            return RESTService.createUserAPIKey(user);
        })
        .then( function( APIKey ){ 
            userAPIKey = APIKey;
            done();
        })
    });
    
    describe('Create Basic Tournament', function(){
        it('Should create user, get API key, create tournament, and fetch that tournament', function(done){

            var tournament = {name: 'test tournmanet'};
            
            RESTService.createTournament( tournament, userAPIKey )
            .then( function(tournament){
                if( tournament && tournament.href && tournament.name && tournament.dateCreated ){
                    done();
                } else {
                    done('tournament did not contain all the expected properties');   
                }
            });
			
        });
    }); 
	
    describe('Create Basic Tournament - No API Key', function(){
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
	});
});