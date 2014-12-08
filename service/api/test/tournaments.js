var RESTService = require('./RESTWrapper');
var assert = require('assert');

describe('Tournaments', function(){
    
    var user;
    
    beforeEach( function(done){
        var user = {
            username: 'tournamenttestuser' + Math.floor(Math.random()*100000000).toString(),
            password: 'password'
        };
        
        RESTService.enableCookies();
        
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

            var tournament = {name: 'test tournament (no session)'};

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
    
    describe('Get Tournaments List', function(){
        it('Should get list of tournaments', function(done){

            var tournament = {name: 'test tournament for GET'};
            var numTournaments;
            
            RESTService.getTournaments()
            .then( function(tournamentsList){
                numTournaments = tournamentsList.length;
                return RESTService.createTournament( tournament );
            }, function(){
                done('failed to get tournaments list');   
            })
            .then( function(tournament){
                return RESTService.getTournaments();                
            }, function(){
                done('failed to create tournament');
            })
            .then( function(tournamentsList){
                if( tournamentsList && tournamentsList.length && tournamentsList.length == (numTournaments + 1) ){
                    done();     
                } else {
                    done('failed to create tournament correctly');   
                }
            }, function(){
                done('failed to get tournaments list again');
            });
          
        });	
	});
    
    describe('Change Tournament Status', function(){
        it('Should create tournament and change its status', function(done){
            
            var tournament = {name: 'Status Change Tournament'};
            
            RESTService.createTournament( tournament )
            .then( function(tournament){
                return RESTService.changeTournamentStatus( tournament._id, 'testStatus' );                
            }, function(){
                done('failed to create tournament');
            })
            .then( function(){
                return RESTService.getTournaments();
            }, function(){
                console.log('failed to change tournament status');
            })
            .then( function(tournamentsList){
                
                for( var i in tournamentsList ){
                    if( tournamentsList[i].status === 'testStatus' ){
                        done();
                        return;
                    }
                } 
                
                done('could not find tournament with changed status');
            }, function(){
                done('failed to get tournaments list');
            });    
        });
    });
    /*
    describe('Register Users For Tournament', function(){
        it('Should create tournament, and register users for it', function(done){

            // Create user that will then create tournament
            var tournament = {name: 'test registration tournament'};
            
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