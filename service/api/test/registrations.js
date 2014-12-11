var RESTService = require('./RESTWrapper');

var Q = require('q');

describe('Registrations', function(){
    
    var tournamentCreator = {
        username: 'tournamentCreator' + Math.floor(Math.random()*100000000).toString(),
        password: 'password'
    };
    
    before( function(done){
        
        RESTService.enableCookies();
        
        RESTService.createUser( tournamentCreator )
        .then( function(storedUser){
            tournamentCreator = storedUser;
            done();
        }).fail( function(error){
            done('failed to create tournamentCreator user');    
        });
    });
    
    beforeEach( function(done){
        RESTService.loginUser( tournamentCreator.username, tournamentCreator.password).then( function(){
            done();
        }).fail(function(){
            done('could not log in tournamentcreator before test'); 
        });
    });
    
    
    describe('Register Users For Tournament', function(){
        it('Should create tournament, and register user for it', function(done){

            var tournament;
            var user;
            
            RESTService.TournamentHelper.createNoPrizeTournament().then( function( newTournament){
                tournament = newTournament;
                return RESTService.changeTournamentStatus( tournament._id, 'open' );                
            })
            .then( function(){
                return RESTService.UserHelper.createAndSignIn();
            })
            .then( function(newUser){
                user = newUser;
                return RESTService.registerUserForTournament( tournament._id );
            })
            .then( function(){
                return RESTService.getTournaments('status=open');
            }).then( function( tournamentsList ){
                for( var i in tournamentsList ){
                    if( tournamentsList[i]._id == tournament._id){
                        var regPlayers = tournamentsList[i].registrations;
                        if( regPlayers && regPlayers.length && regPlayers[0].username == user.username ){
                            done();
                            return;
                        } else {
                            done('registered player not found in tournament correctly');
                            return;
                        }
                    }
                }
                done('could not find tournament the player registered with');
                return;
            }).fail( function( error ){
                done( error.message );    
            }); 
          
        });
        
        it('Should not be able to register for full tournament', function(done){
            
            var tournament;
            var user1;
            var user2;
            
            RESTService.TournamentHelper.createNoPrizeTournament().then( function( newTournament){
                tournament = newTournament;
                return RESTService.changeTournamentStatus( tournament._id, 'open' );                
            })
            .then( function(){
                return RESTService.UserHelper.createAndSignIn();
            })
            .then( function(newUser){
                user1 = newUser;
                return RESTService.registerUserForTournament( tournament._id );
            })
            .then( function(){
                return RESTService.UserHelper.createAndSignIn();
            })
            .then( function(newUser){
                user2 = newUser;
                return RESTService.registerUserForTournament( tournament._id );
            })
            .then( function(){
                return RESTService.UserHelper.createAndSignIn();
            })
            .then( function(newUser){
                user3 = newUser;
                return RESTService.registerUserForTournament( tournament._id );
            })
            .then( function(){
                done('third user should not have been allowed to register for tournament');
            }, function(){
                done();
            }).fail( function( error ){
                done( 'failed full-tournament registration test because: ' + error.message );    
            }); 
        });
        
        it('Should not be able to register for a tournament twice', function(done){
             
            var tournament;
            var user;
            
            RESTService.TournamentHelper.createNoPrizeTournament().then( function( newTournament){
                tournament = newTournament;
                return RESTService.changeTournamentStatus( tournament._id, 'open' );                
            })
            .then( function(){
                return RESTService.UserHelper.createAndSignIn();
            })
            .then( function(newUser){
                user = newUser;
                return RESTService.registerUserForTournament( tournament._id );
            })
            .then( function(){
                return RESTService.registerUserForTournament( tournament._id );
            })
            .then( function(){
                done('user should not have been able to register for tournament twice');
            }, function(){
                done();
            }).fail( function( error ){
                done( 'failed double-registration test because: ' + error.message );    
            }); 
        });
        
        it('Should not be able to register for tournament that is not open', function(done){
            
            var tournament;
            var user;
            
            RESTService.TournamentHelper.createNoPrizeTournament().then( function( newTournament){
                tournament = newTournament;
                return RESTService.UserHelper.createAndSignIn();
            })
            .then( function(newUser){
                user = newUser;
                return RESTService.registerUserForTournament( tournament._id );
            })
            .then( function(){
                done('user should not have been able to register for non-open tournament');
            }, function(){
                done();
            }).fail( function( error ){
                done( 'failed non-open-registration test because: ' + error.message );    
            }); 
        });
        
        
	});
    
    describe('Cancellation', function(){
        xit('Cancelling registration to free tournament should change status to \'cancelled\'', function(done){
            
        });
        xit('Cancelling registration to paid tournament should refund and change status to \'cancelled\'', function(done){
            
        });
        xit('Should not be able to cancel registration when tournament is \'active\'', function(done){
            
        });
        
    });
    describe('Payment', function(){
        xit('Registration to free tournament should change status to \'paid\'', function(done){
            
        });
        
        xit('Registration to buyin tournament should change status to \'invoice\'', function(done){
            
        });
        
        xit('Should provide payment and have registration status changed to \'paid\'', function(done){
            
        });
        
        xit('Should provide payment and have registration status changed', function(done){
            
        });
        xit('Should provide payment and have registration status changed', function(done){
            
        });
    });
    
});