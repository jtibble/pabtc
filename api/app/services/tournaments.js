var storage = require('../storage.js');
var requestValidator = require('./requestValidator.js');

module.exports = [
    {
        'type': 'POST',
        'name': 'tournaments/create',
        'permission': 'write',
        'response': function (req, res) {

            var requiredProperties = ['name'];

            var responseBody = {
                success: false,
                issues: []
            };

            if ( !requestValidator.validate( req, requiredProperties )){
                responseBody.success = false;
                responseBody.issues = ['Missing request body properties. Check the API documentation.'];
                res.send(responseBody);
                return;
            }
            
            var userId = req.get('UserId');

            if (!userId) {
                responseBody.success = false;
                responseBody.issues = ['Missing UserId header'];
                res.send(responseBody);
            }

            var tournamentId = storage.addTournament(req.body, userId);

            if (!tournamentId) {
                responseBody.success = false;
                responseBody.issues = ['Could not create tournament'];
                res.send(responseBody);
            } else {
                responseBody = {
                    'sucess': true,
                    'data': {
                        'tournamentId': tournamentId
                    }
                };
                console.log('Created tournament with id ' + tournamentId);
                res.send(responseBody);
            }

        }
    }
];

/*,
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