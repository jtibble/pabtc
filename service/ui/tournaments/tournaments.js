
app.controller('TournamentsController', function($scope, FrameworkAJAX){
    $scope.Actions = {};
    $scope.Model = {};
    
	var fetchTournaments = function(){
    
		var tournamentsRequest = {
			method: 'GET',
			url: '/api/v0/tournaments',
			data: {}
		};

		FrameworkAJAX.sendRequest(tournamentsRequest, function(data){
			$scope.Model.tournaments = data;
		}, function(){ 
			console.log('error getting tournaments');
		});
		
	};
    
    
    $scope.Actions.createTournament = function(){
		if( !$scope.Model.newTournament.APIKey ){
			console.log('Can\'t create tournament without an API key provided');
			return;
		}
		
        var APIKeyRequest = {
            method: 'POST',
            url: '/api/v0/tournaments',
            data: {
                name: $scope.Model.newTournament.name
            },
            headers: {
                APIKey: $scope.Model.newTournament.APIKey
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

