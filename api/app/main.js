var express = require('express');
var bodyParser = require('body-parser')

//var mongojs = require('mongojs');
//var db = mongojs('test');
//var collection = db.collection('testCollection');

var sys = require('sys');
var exec = require('child_process').exec;

var storage = require('./storage.js');


var Service = function(config){
    var server = express();	
	server.use(bodyParser.json())
	server.use( express.static(__dirname + config.staticContentPath));
	
	var apiPath = config.apiPath;
    console.log('Creating Service in ' + apiPath);
    return {
        createService: function(){
            
            for( var i=0; i<config.endpoints.length; i++){
                var serviceType = config.endpoints[i].type;
                var serviceName = config.endpoints[i].name;
                var serviceResponse = config.endpoints[i].response;
                this.addService(serviceType, serviceName, serviceResponse);
            }
			
			var port = process.env.PORT || 80;
			server.listen( port );
            console.log('%s listening at %s', server.name, port);
        },
        
        addService: function( serviceType, serviceName, response ){
			var fullServiceName = apiPath + serviceName;
			switch (serviceType){
				case 'GET':
					server.get( fullServiceName, response );
					console.log('Created GET \'' + fullServiceName + '\'');
				case 'POST':
					server.post( fullServiceName, response );
					console.log('Created POST \'' + fullServiceName + '\'');
					break;
				default:
					console.log('Unknown serviceType \'' + serviceType + '\'');
			}
        }
    };
    
};


var config = {
	'staticContentPath': '/www',
	'apiPath': '/api/v0/',
	'endpoints': [
		{
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
		},
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
				
				// Validate incoming request body 
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
						'data': [
							{'tournamentId': tournamentId}
						]
					};
					console.log('Created tournament with id ' + tournamentId);
					res.send( responseBody );
				}
				
			}
		}
	]
};

var service = Service(config);
service.createService();
