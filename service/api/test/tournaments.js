var RESTService = require('./RESTWrapper');
var bitcoin = require('bitcoinjs-lib');
var assert = require('assert');

describe('Tournaments', function(){
        
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
        RESTService.enableCookies();
        RESTService.loginUser( tournamentCreator.username, tournamentCreator.password).then( function(){
            done();
        }).fail(function(){
            done('could not log in tournamentcreator before test'); 
        });
    });
    
    describe('Create Basic Tournament', function(){
    
        it('Should create no-prize tournament', function(done){

            RESTService.TournamentHelper.createNoPrizeTournament()
            .then( function(createdTournament){
                assert( createdTournament, 'tournament not created');
                assert.ok(createdTournament.name);
                done();
            }).fail( function(error){
                done('could not create tournament: ' + error.message);
            });

        });
    
        it('Should create prize tournament and fund it', function(done){

            var tournamentId;
            var invoiceAmount = Math.random()*900 + 100;
            
            // Prize tournaments are created with a prize but once it's stored in the db, 
            // the tournament has prizeAmount = 0 until the invoice is paid, 
            // so we have to create an arbitrary amount to fund and then fake-pay it
            // and check that it shows up in the tournament as the prizeAmount
            
            RESTService.TournamentHelper.createPrizeTournament()
            .then( function(createdTournament){
                tournamentId = createdTournament._id;
                
                assert( createdTournament, 'tournament not created');
                assert.ok(createdTournament.name);
                assert.ok(createdTournament.prizeAmount == 0 );
                assert.ok(createdTournament.prizeCurrency);
                
                
                var bitpayId = createdTournament.invoiceUrl.split('=')[1];
                
                return RESTService.fakePaymentForBitpayId( bitpayId, 
                                                          invoiceAmount,
                                                          createdTournament.prizeCurrency, 
                                                          'prize'  );
            }).then( function(invoiceReponse){    
                
                return RESTService.getTournaments( '_id=' + tournamentId);
                
            }).then( function(tournamentList){
                
                if( tournamentList.length == 1){
                    if( tournamentList[0].prizeAmount == invoiceAmount ){
                        done();
                    } else {
                        done('tournament prize not updated after payment');   
                    }
                } else {
                    done('can not find tournament again');       
                }
            
            }).fail( function(error){
                done('could not create tournament: ' + error.message);
            });

        });
    
        it('Should create buyin tournament', function(done){

            RESTService.TournamentHelper.createBuyinTournament()
            .then( function(createdTournament){
                assert( createdTournament, 'tournament not created');
                assert.ok(createdTournament.name);
                assert.ok(createdTournament.prizeAmount != undefined );
                assert.ok(createdTournament.prizeCurrency);
                assert.ok(createdTournament.buyinAmount != undefined );
                assert.ok(createdTournament.buyinCurrency);
                done();
            }).fail( function(error){
                done('could not create tournament: ' + error.message);
            });

        });
        
        it('Should not be able to create tournament (too small buyin amount)', function(done){

            var tournament = {
                name: 'testBuyinTournament' + Math.floor(Math.random()*100000000).toString(),
                totalPlayers: 2,
                prizeAmount: 0,
                prizeCurrency: 'BTC',
                buyinCurrency: 'μBTC',
                buyinAmount: 99
            };

            RESTService.createTournament( tournament)
            .then( function(createdTournament){
                done('should not have been able to create the tournament');
            }).fail( function(error){
                done();
            });

        });
        
        it('Should not be able to create tournament (no session)', function(done){

            RESTService.disableCookies();
            RESTService.TournamentHelper.createNoPrizeTournament().then( function(tournament){
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
            var numTournaments;
            
            RESTService.getTournaments()
            .then( function(tournamentsList){
                numTournaments = tournamentsList.length;
                return RESTService.TournamentHelper.createNoPrizeTournament();
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
            })
            .fail( function(error){
                done('failed with error ' + error.message);    
            });
          
        });	
	});
    
    describe('Change Tournament Status', function(){
        it('Should create tournament and change its status', function(done){
            var newStatus = 'open';
            var tournament;
            
            RESTService.TournamentHelper.createNoPrizeTournament().then( function(newTournament){
                tournament = newTournament;
                return RESTService.changeTournamentStatus( tournament._id, newStatus );                
            })
            .then( function(){
                return RESTService.getTournaments();
            })
            .then( function(tournamentsList){
                
                for( var i in tournamentsList ){
                    if( tournamentsList[i].status === newStatus ){
                        done();
                        return;
                    }
                } 
                
                done('could not find tournament with changed status');
            })
            .fail( function(error){
                done('failed with error ' + error.message);    
            });    
        });
        
        it('Should not be able to change tournament status (wrong user)', function(done){
            
            var newStatus = 'open';
            var tournament;
            
            RESTService.TournamentHelper.createNoPrizeTournament().then( function(newTournament){
                tournament = newTournament;
                return RESTService.UserHelper.createAndSignIn();
            }).then(function(){
                return RESTService.changeTournamentStatus( tournament._id, newStatus );                
            })
            .then( function(tournamentsList){
                done('failed to prevent random user from changing tournament status');
            }, function(){
                done();   
            })
            .fail( function(error){
                done('failed with error: ' + error.message);    
            }); 
        });
        
        it('Should not be able to change tournament status (illegal state change)', function(done){
            
            var openForRegistrationStatus = 'open';
            var closedForRegistrationStatus = 'closed';
            var activeRegistrationStatus = 'active';
            var finishedRegistrationStatus = 'finished';
            
            var tournament;
            
            RESTService.TournamentHelper.createNoPrizeTournament().then( function(newTournament){
                tournament = newTournament;
                return RESTService.changeTournamentStatus( tournament._id, openForRegistrationStatus );                
            })
            .then( function(){
                return RESTService.changeTournamentStatus( tournament._id, closedForRegistrationStatus );
            })
            .then( function(){
                return RESTService.changeTournamentStatus( tournament._id, openForRegistrationStatus );
            })
            .then( function(){
                return RESTService.changeTournamentStatus( tournament._id, activeRegistrationStatus );
            })
            .then( function(){
                return RESTService.changeTournamentStatus( tournament._id, openForRegistrationStatus );
            })
            .then( function(){
                done('should not have been able to transition to that tournament status');
            }, function(){
                done();   
            })
            .fail( function(error){
                done('failed with error: ' + error.message);    
            }); 
        });
        
        xit('Should not be able to change tournament status (paid tournament not funded)', function(done){
            
            var activeRegistrationStatus = 'active';
            
            var tournament;
            
            RESTService.TournamentHelper.createPrizeTournament().then( function(newTournament){
                tournament = newTournament;
                return RESTService.changeTournamentStatus( tournament._id, activeRegistrationStatus );                
            })
            .then( function(){
                done('failed, the state changed to active without prize being funded');
            }, function(){
                done()   
            })
            .fail( function(error){
                done('failed with error: ' + error.message);    
            }); 
        });
    });

});