var storage = require('./storage.js');
var sys = require('sys');
var exec = require('child_process').exec;

module.exports = {
	'staticContentPath': '/www',
	'apiPath': '/api/v0/',
	'endpoints': [
		/*{
			'type': 'POST',
			'name': 'newReleaseHook',
			'response': function(req, res) {
				console.log('Received request to UPDATE REPOSITORY');
				exec('git pull', function(error, stdout, stderr){
					sys.puts( 'STDOUT:\n' + stdout );
					sys.puts( 'STDERR:\n' + stderr );
				});
				var response = {
					'sucess': true
				};
				res.send(response);
			}
		},*/
		{
			'type': 'POST',
			'name': 'users/create',
			'response': function(req, res) {
				
				var responseBody = {
					success: false,
					issues: []
				};
				
				if( !req.body ){
					responseBody.success = false;
					responseBody.issues = [ 'Missing request body' ];
					res.send( responseBody );
				}
                
                var user = req.body;

				if( !user.name ){
					responseBody.success = false;
					responseBody.issues = [ 'Missing user name' ];
					res.send( responseBody );
				}
                
				if( !user.permissions ){
					responseBody.success = false;
					responseBody.issues = [ 'Missing user permissions' ];
					res.send( responseBody );
				}
				/*
				var userId = req.get('UserId');
				console.log('userid: ' + userId);
				
				if( !userId ){
					responseBody.success = false;
					responseBody.issues = [ 'Missing UserId header' ];
					res.send( responseBody );
				}		*/		
				
				var storedUser = storage.addUser( user );
				
				if( !storedUser ){
					responseBody.success = false;
					responseBody.issues = [ 'Could not create user' ];
					res.send( responseBody );
				} else {
					responseBody = {
						'sucess': true,
						'data': storedUser					
					};
					console.log('Created user with id ' + storedUser.id);
					res.send( responseBody );
				}
				
			}
		}/*,
		{
			'type': 'POST',
			'name': 'tournaments/create',
			'response': function(req, res) {
				
				var responseBody = {
					success: false,
					issues: []
				};
				
				if( !req.body ){
					responseBody.success = false;
					responseBody.issues = [ 'Missing request body' ];
					res.send( responseBody );
				}
				 
				var tournamentName = req.body.name;
				
				if( !tournamentName ){
					responseBody.success = false;
					responseBody.issues = [ 'Missing tournament name' ];
					res.send( responseBody );
				}
				
				var userId = req.get('UserId');
				console.log('userid: ' + userId);
				
				if( !userId ){
					responseBody.success = false;
					responseBody.issues = [ 'Missing UserId header' ];
					res.send( responseBody );
				}				
				
				var tournamentId = storage.addTournament( req.body, userId );
				
				if( !tournamentId ){
					responseBody.success = false;
					responseBody.issues = [ 'Could not create tournament' ];
					res.send( responseBody );
				} else {
					responseBody = {
						'sucess': true,
						'data': {
							'tournamentId': tournamentId
						}						
					};
					console.log('Created tournament with id ' + tournamentId);
					res.send( responseBody );
				}
				
			}
		},
		{
			'type': 'GET',
			'name': 'tournaments',
			'response': function(req, res) {
				
                var responseBody = {};
                
				var userId = req.get('UserId');
				console.log('userid: ' + userId);
				
				if( !userId ){
					responseBody.success = false;
					responseBody.issues = [ 'Missing UserId header' ];
					res.send( responseBody );
				}				
				
				var tournamentList = storage.searchTournaments({}, userId);
				
				if( !tournamentList ){
					responseBody.success = false;
					responseBody.issues = [ 'Could not search tournaments' ];
					res.send( responseBody );
				} else {
					responseBody = {
						'sucess': true,
						'data': {
							'tournamentList': tournamentList
						}						
					};
					console.log('Returned ' + Object.keys(tournamentList).length + ' tournaments');
					res.send( responseBody );
				}
				
			}
		}*/
	]
};