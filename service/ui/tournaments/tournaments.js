
app.controller('TournamentsController', function($scope, FrameworkAJAX, $stateParams, SessionService){
    $scope.Actions = {};
    $scope.Model = {};
    
    
    
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
    
	var fetchTournaments = function(){
    
		var tournamentsRequest = {
			method: 'GET',
			url: '/api/v0/tournaments' + ($scope.Model.selectedId ? ('/' + $scope.Model.selectedId) : ''),
			data: {}
		};

		FrameworkAJAX.sendRequest(tournamentsRequest, function(data){
			$scope.Model.tournaments = data;
		}, function(){ 
			console.log('error getting tournaments');
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
			fetchTournaments();
        }, function(){
            console.log('error creating tournament');
        });
    };
    
    $scope.Actions.selectTournament = function( tournament ){
        $scope.Model.selectedTournament = tournament;  
    };
    $scope.Actions.registerUsersToTournament = function(){
        var userIdList = [];
        for( var i in $scope.Model.selectedUsers ){
            userIdList.push( $scope.Model.selectedUsers[i]._id);
        }
        
        var RegisterUsersRequest = {
            method: 'POST',
            url: $scope.Model.selectedTournament.href + '/registerUsers',
            data: {
                usersList: userIdList
            }
        };
		
        FrameworkAJAX.sendRequest(RegisterUsersRequest, function(data){
			fetchTournaments();
        }, function(){
            console.log('error registering users');
        });
        
    };
    
    
    fetchTournaments();
});

