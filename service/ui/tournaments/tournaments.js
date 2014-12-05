
app.controller('TournamentsController', function($scope, FrameworkAJAX, $stateParams, SessionService, $modal){
    $scope.Actions = {};
    $scope.Model = {
        pendingTournaments: [],
        activeTournaments: [],
        concludedTournaments: []
    };
    
    
    
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
    
    
    $scope.Actions.createTournament = function(){
		
        var APIKeyRequest = {
            method: 'POST',
            url: '/api/v0/tournaments',
            data: {
                name: $scope.Model.newTournament.name
            }
        };
		
        FrameworkAJAX.sendRequest(APIKeyRequest, function(data){
            fetchTournaments('pending');
        }, function(){
            console.log('error creating tournament');
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
    
    fetchTournaments('pending');
    fetchTournaments('active');
    fetchTournaments('concluded');
});

