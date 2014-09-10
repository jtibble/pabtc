var RESTService = require('./serviceWrapper.js');
var assert = require('assert');

describe('Tournaments', function(){
    describe('Create Basic Tournament', function(){
        it('Should create user, get API key, create tournament, and fetch that tournament', function(done){
            
            // Create user that will then create tournament
            var apiUser = { name: 'API User' };
            
            RESTService.createUser(apiUser).then( function(user){
				
				RESTService.createUserAPIKey(user).then( function(APIKey){
					
					var tournament = { name: 'Test Tournament' };
					
					RESTService.createTournament( tournament, APIKey ).then( function(tournament){
						
						if( tournament && tournament.href && tournament.name && tournament.createdBy){
							done();
						} else {
							done('tournament was missing data');   
						}
						
					}, function(){ done('couldn\'t call service to create tournament with api key'); });
				}, function(){ done('couldn\'t call service to create api key for user'); });
			}, function(){ done('couldn\'t call service to create user'); });
			
        });
    }); 
	
    describe('Create Basic Tournament - No API Key', function(){
        it('Should create user, try to create tournament with no API key, and fail', function(done){
            
            // Create user that will then create tournament
            var apiUser = { name: 'Regular User' };
            
            RESTService.createUser(apiUser).then( function(user){
				
				var tournament = { name: 'Test Tournament' };

				RESTService.createTournament( tournament, 'asdf12345' ).then( function(tournament){
					
					if( tournament && tournament.href && tournament.name && tournament.createdBy){
						done('incorrectly created tournament');
					} else {
						done();   
					}

				}, function(){ done('couldn\'t call service to create tournament'); });
				
			}, function(){ done('couldn\'t call service to create user'); });
			
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