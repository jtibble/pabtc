var RESTService = require('./RESTWrapper');
var bitcoin = require('bitcoinjs-lib');

var Q = require('q');

describe('Registrations', function(){
    
    var tournamentCreator = {
        username: 'tournamentCreator' + Math.floor(Math.random()*100000000).toString(),
        password: 'password',
        receivingAddress: bitcoin.ECKey.makeRandom().pub.getAddress().toString()
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
    
    
    describe('Register Users For No-Prize Tournament', function(){
        it('Should create no-prize tournament, and register user for it', function(done){

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
    
    describe('Register Users For Prize Tournament', function(){
        it('Should register user for prize tournament', function(done){
            
            var tournament;
            var user;
            
            RESTService.TournamentHelper.createPrizeTournament().then( function( newTournament){
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
                done();
            }).fail( function( error ){
                done( error.message );    
            }); 
        });
        
        it('Should fail to register for prize tournament (missing receiving address)', function(done){
              
            var tournament;
            var user = {
                username: 'missingReceivingAddressUser' + + Math.floor(Math.random()*100000000).toString(),
                password: 'password'
            };
            
            RESTService.TournamentHelper.createPrizeTournament().then( function( newTournament){
                tournament = newTournament;
                return RESTService.changeTournamentStatus( tournament._id, 'open' );                
            })
            .then( function(){
                return RESTService.createUser(user);
            })
            .then( function(){
                return RESTService.loginUser( user.username, user.password );  
            })
            .then( function(){
                return RESTService.registerUserForTournament( tournament._id );
            })
            .then( function(){
                done('should fail to create registration because no receiving address set');
            }, function(){
                done();
            }).fail( function( error ){
                done('failed with error: ' + error.message);    
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
        it('Registration to free tournament should change status to \'paid\'', function(done){
                
            var tournament;
            
            RESTService.TournamentHelper.createNoPrizeTournament().then( function( newTournament){
                tournament = newTournament;
                return RESTService.changeTournamentStatus( tournament._id, 'open' );                
            })
            .then( function(){
                return RESTService.UserHelper.createAndSignIn();
            })
            .then( function(){
                return RESTService.registerUserForTournament( tournament._id );
            })
            .then( function( registration ){
                if( registration.status == 'paid' ){
                    done();
                } else {
                    done('registration status is not changed to paid for free tournament');   
                };
            }).fail( function( error ){
                done('failed with error: ' + error.message);    
            }); 
        });
        
        it('Registration to buyin tournament should change status to \'invoice\'', function(done){
              
            var tournament;
            
            RESTService.TournamentHelper.createBuyinTournament().then( function( newTournament){
                tournament = newTournament;
                return RESTService.changeTournamentStatus( tournament._id, 'open' );                
            })
            .then( function(){
                return RESTService.UserHelper.createAndSignIn();
            })
            .then( function(){
                return RESTService.registerUserForTournament( tournament._id );
            })
            .then( function( registration ){
                if( registration.status == 'invoice' ){
                    done();
                } else {
                    console.log( JSON.stringify( registration ));
                    done('registration status is not correct for buyin tournament');   
                };
            }).fail( function( error ){
                done('failed with error: ' + error.message);    
            }); 
        });
        
        it('Should provide payment and have registration status changed to \'paid\'', function(done){
            
            var tournament;
            
            RESTService.TournamentHelper.createBuyinTournament().then( function( newTournament){
                tournament = newTournament;
                return RESTService.changeTournamentStatus( tournament._id, 'open' );                
            })
            .then( function(){
                return RESTService.UserHelper.createAndSignIn();
            })
            .then( function(){
                return RESTService.registerUserForTournament( tournament._id );
            })
            .then( function( registration ){
                return RESTService.fakePaymentForBitpayId( registration.bitpayId, tournament.buyinAmount, tournament.buyinCurrency, 'registration' );
            })
            .then( function(){
                return RESTService.getTournaments( '_id=' + tournament._id );   
            })
            .then( function(tournamentsList){
                if( tournamentsList.length != 1 ){
                    done('wrong number of tournaments returned: ' + tournamentsList.length);
                    return;
                }
                
                var registrationStatus = tournamentsList[0].registrations[0].status
                if( registrationStatus == 'paid'){
                    done();
                } else {
                    done('status is incorrect: ' + registrationStatus );   
                }
                
            }).fail( function( error ){
                done('failed with error: ' + error.message);    
            }); 
        });
    });
    
});