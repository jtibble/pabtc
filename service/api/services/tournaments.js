var storage = require('./storage.js');
var requestValidator = require('./requestValidator.js');

function createHREF( id ){
    var domain = 'tournaments';
    return 'http://localhost:8080/api/v0/' + domain + '/' + id;
}

module.exports = [
    {
        'type': 'POST',
        'name': 'tournaments',
        'response': function (req, res) {

            var responseBody = {};
            
            var requiredProperties = ['name'];
            
            if ( !requestValidator.validate( req, requiredProperties )){
                responseBody = {message: 'Missing request body properties. Check the API documentation.'};
                res.status(400).send(responseBody);
                return;
            }
            
            var APIKey = req.get('APIKey');

            if (!APIKey) {
                responseBody = {message: 'Missing APIKey header'};
                res.status(403).send(responseBody);
                return;
            }
            
            storage.addTournamentAsync( req.body, APIKey ).then( function(tournament){
                tournament.href = createHREF(tournament._id);
                res.status(201).send(tournament);
            }, function(error){
                responseBody = {message: error};
                res.status(403).send(responseBody);
            });
        }
    },
    {
        'type': 'GET',
        'name': 'tournaments/:id?',
        'response': function (req, res) {            
            var responseBody = {};
            
            storage.getTournamentsAsync(req.params.id).then( function(tournamentsList){
                if( tournamentsList ){
                    for( var i in tournamentsList ){
                        tournamentsList[i].href = createHREF(tournamentsList[i]._id);
                    }
                    res.status(200).send(tournamentsList);
                } else {
                    responseBody = {message: 'Could not find tournament/tournaments'};
                    res.status(404).send(responseBody);   
                }
            },  function(error){
                responseBody = {message: error};
                res.status(500).send(responseBody);
            });
        }
    },
    {
        'type': 'POST',
        'name': 'tournaments/:id/registerUsers',
        'response': function (req, res) {      
            var responseBody = {};
            if ( !req.params.id || !req.body || !req.body.usersList){
                responseBody = {message: 'Bad request. Check the API documentation.'};
                res.status(400).send(responseBody);
                return;
            }
            
            storage.registerUsers( req.params.id, req.body.usersList ).then( function(registration){
                if( registration ){
                   res.status(200).send(registration); 
                } else {
                   res.status(500).send(registration); 
                }
            }, function(message){ 
                res.status(500).send( {message: message} ); 
            });
        }
    },
    {
        'type': 'POST',
        'name': 'tournaments/:id/beginTournament',
        'response': function (req, res) {            
            var responseBody = {};
            res.status(501).send({message: 'beginTournament service is not available yet'});
        }
    },
    {
        'type': 'POST',
        'name': 'tournaments/:id/concludeTournament',
        'response': function (req, res) {            
            var responseBody = {};
            res.status(501).send({message: 'concludeTournament service is not available yet'});
        }
    }
];
