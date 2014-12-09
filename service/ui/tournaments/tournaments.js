
var tournamentStatusList = [
    'new',
    'open',
    'closed',
    'active',
    'finished'
];

app.controller('TournamentsController', function($scope, FrameworkAJAX, $stateParams, SessionService, $modal){
    $scope.Actions = {};
    $scope.Model = {};
    
    for( var i in tournamentStatusList ){
        $scope.Model[ tournamentStatusList[i] + 'Tournaments' ] = [];
    }    
    
    
    if( $stateParams && $stateParams.id && $stateParams.id.length ){
        $scope.Model.selectedId = $stateParams.id;
    }
    
    
    $scope.Actions.updateSession = function( session ){
        if( session ){
            $scope.Model.username = session.username;
            $scope.Model.sessionActive = true;
        } else {
            $scope.Model.username = undefined;
            $scope.Model.sessionActive = false;
        }
    };
    
    SessionService.registerCallback( $scope.Actions.updateSession );
    $scope.Actions.updateSession( SessionService.lastSession );
    
	var fetchTournaments = function(status){
    
		var tournamentsRequest = {
			method: 'GET',
			url: '/api/v0/tournaments?status=' + status,
			data: {}
		};

		FrameworkAJAX.sendRequest(tournamentsRequest, function(data){
            $scope.Model[ status + 'Tournaments'] = data;
			//$scope.Model.tournaments = data;
		}, function(){ 
			console.log('error getting ' + status + ' tournaments');
		});
	};
    
    $scope.Actions.showNewTournamentModal = function(){
        var modalInstance = $modal.open({
            templateUrl: 'tournaments/newTournamentModal.html',
            controller: 'NewTournamentModalController',
            size: 'lg'
        });  
    };
    
    $scope.Actions.viewTournamentDetails = function( tournament ){
        $scope.Model.selectedTournament = tournament;  
        var modalInstance = $modal.open({
            templateUrl: 'tournaments/tournamentModal.html',
            controller: 'TournamentModalController',
            size: 'lg',
            resolve: {
                tournament: function () {
                    return $scope.Model.selectedTournament;
                }
            }
        });
    };
    
    $scope.Actions.register = function( tournament ){
        
		var request = {
			method: 'POST',
			url: '/api/v0/registrations',
			data: {tournamentId: tournament._id}
		};
        
        FrameworkAJAX.sendRequest( request, function( data ){
            console.log('registration added');
        }, function(){
            console.log('failed to register');
        });
    };
    
    
    for( var i in tournamentStatusList ){
        fetchTournaments( tournamentStatusList[i] );
    }  
});

