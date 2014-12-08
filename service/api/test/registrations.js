var RESTService = require('./RESTWrapper');
describe('Registrations', function(){
    
    var user;
    
    beforeEach( function(done){
        var user = {
            username: 'registrationtestuser' + Math.floor(Math.random()*100000000).toString(),
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
    
    describe('Register Users For Tournament', function(){
        xit('Should create tournament, and register user for it', function(done){

              
            var tournament = {name: 'Registration Tournament'};
            
            RESTService.createTournament( tournament )
            .then( function( newTournament){
                tournament = newTournament;
                console.log('new tourney id = ' + newTournament._id);
                return RESTService.changeTournamentStatus( newTournament._id, 'Registration Open' );                
            }, function(){
                done('failed to create tournament');
            })
            .then( function(){
                return RESTService.registerUserForTournament( tournament._id );
            }, function(){
                done('failed to change tournament status');
            })
            .then( function(){
                return RESTService.getTournaments('status=Registration Open');
            }, function(){
                done('failed to register user for tournament');
            }).then( function( tournamentsList ){
                for( var i in tournamentsList ){
                    if( tournamentsList[i]._id == tournament._id){
                        var regPlayers = tournamentsList[i].registeredPlayers;
                        console.log( regPlayers.length + ' registered players found');
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
            }, function(){
                done('could not get tournament list');   
            }); 
          
        });	
	});
    
});