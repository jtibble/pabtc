
app.controller('TournamentModalController', function($scope, FrameworkAJAX, tournament, $modalInstance){
    $scope.Actions = {
        close: function(){
            $modalInstance.dismiss();   
        }
    };
    $scope.Model = tournament;
    
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
    
    $scope.Actions.setStatus = function( status ){
        var request = {
            method: 'POST',
            url: 'http://localhost:8080/api/v0/tournaments/' + $scope.Model._id,
            data: {
                status: status
            }
        };
		
        FrameworkAJAX.sendRequest(request, function(data){
			console.log('updated status');
        }, function(){
            console.log('error registering users');
        }); 
    };
    
    
});

