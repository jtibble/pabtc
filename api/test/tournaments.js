var RESTService = require('./serviceWrapper.js');
var assert = require('assert');

describe('Tournaments', function(){
    describe('Create Basic Tournament', function(){
        it('Should return a tournament id when called successfully', function(done){
            
            // Create user that will then create tournament
            var adminUser = {
                name: 'Admin User',
                permissions: {
                    'read': true,
                    'write': true,
                    'admin': true
                }
            };
            
            function CreateTournament(user){
                var tournament = {
                    name: 'Test Tournament'
                };
                
                RESTService.createTournament( tournament, user._id ).then( function(tournament){
                    if( tournament && tournament._id ){
                        done();  
                    } else {
                        done('bad tournament data');   
                    }
                });
            };
            
            RESTService.createUser(adminUser).then( CreateTournament, function(){ 
                done('could not create user');
            });
        });
    }); 
    
    describe('Create Basic Tournament - Insufficient Permissions', function(){
        it('Should fail to create a tournament', function(done){
            
            // Create user that will then create tournament
            var adminUser = {
                name: 'Un-Privileged User',
                permissions: {
                    'read': true
                }
            };
            
            function CreateTournament(user){
                var tournament = {
                    name: 'Test Tournament'
                };
                
                RESTService.createTournament( tournament, user._id ).then( function(tournament){
                    if( tournament && tournament._id ){
                        done('created tournament, which is incorrect');  
                    } else {
                        done();   
                    }
                });
            };
            
            RESTService.createUser(adminUser).then( CreateTournament, function(){ 
                done('could not create user');
            });
        });
    });   
    
    describe('Get Tournaments', function(){
        it('Should return list of tournaments', function(done){
            
            // Create user that will then create tournament
            var adminUser = {
                name: 'Writing User',
                permissions: {
                    'read': true,
                    'write': true,
                    'admin': true
                }
            };
            
            function CreateTournament(user){
                var tournament = {
                    name: 'Test Tournament'
                };
                
                RESTService.createTournament( tournament, user._id ).then( function(tournament){
                    if( tournament && tournament._id ){
                        
                        function GetTournaments(tournamentsList){
                            if( tournamentsList && tournamentsList.length ){
                                done();
                            } else {
                                done('bad tournament data');
                            }
                        };
                        
                        // Now that tournament has been created, try to find it again
                        RESTService.getTournamentsAsync().then( GetTournaments, function(){
                            done('could not fetch tournaments from service');
                        });
                        
                        
                    } else {
                        done('bad tournament data');   
                    }
                });
            };
            
            RESTService.createUser(adminUser).then( CreateTournament, function(){ 
                done('could not create user');
            });
        });
    });
});