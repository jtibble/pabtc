var storage = require('../storage.js');

module.exports = {
    'type': 'POST',
    'name': 'tournaments/create',
    'permission': 'write',
    'response': function (req, res) {

        var responseBody = {
            success: false,
            issues: []
        };

        if (!req.body) {
            responseBody.success = false;
            responseBody.issues = ['Missing request body'];
            res.send(responseBody);
        }

        var tournamentName = req.body.name;

        if (!tournamentName) {
            responseBody.success = false;
            responseBody.issues = ['Missing tournament name'];
            res.send(responseBody);
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
};

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