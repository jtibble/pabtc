var RESTService = require('./serviceWrapper.js');
var assert = require('assert');

describe('Tournaments', function(){
    describe('Create Basic Tournament', function(){
        it('Should create user, get API key, create tournament, and fetch that tournament', function(done){

            // Create user that will then create tournament
            var apiUser = { name: 'API User' };
            var numTournaments;
            
            RESTService.getTournaments()
            .then( function(tournamentsList){
                numTournaments = tournamentsList.length;
                return RESTService.createUser( apiUser )
            })
            .then( function(user){
                return RESTService.createUserAPIKey(user);
            })
            .then( function( APIKey ){
                var tournament = {name: 'test tournmanet'};
                return RESTService.createTournament( tournament, APIKey );
            })
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
            

            // Create user that will then create tournament
            var apiUser = { name: 'API User' };
            var numTournaments;
            
            RESTService.getTournaments()
            .then( function(tournamentsList){
                numTournaments = tournamentsList.length;
                return RESTService.createUser( apiUser )
            })
            .then( function(user){
                var tournament = {name: 'test tournmanet'};
                var APIKey = 'bogus API key!'
                return RESTService.createTournament( tournament, APIKey );
            })
            .then( function(tournament){
                done('should not have created tournament');           
            }, function(){
                done();
            });
			
        });
    }); 
    
    describe('Get Tournaments List', function(){
        it('Should create user, get API key, create tournament, and fetch all tournaments', function(done){

            // Create user that will then create tournament
            var apiUser = { name: 'API User' };
            var numTournaments;
            
            RESTService.getTournaments()
            .then( function(tournamentsList){
                numTournaments = tournamentsList.length;
                return RESTService.createUser( apiUser )
            })
            .then( function(user){
                return RESTService.createUserAPIKey(user);
            })
            .then( function( APIKey ){
                var tournament = {name: 'test tournmanet'};
                return RESTService.createTournament( tournament, APIKey );
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
});