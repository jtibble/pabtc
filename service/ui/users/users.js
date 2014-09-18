
app.controller('UsersController', function($scope, FrameworkAJAX){
    $scope.Actions = {};
    $scope.Model = {
		newUser: {},
		newTournament: {},
        selectedUsers: []
	};
    
	var fetchUsers = function(){

		var userRequest = {
			method: 'GET',
			url: '/api/v0/users',
			data: {}
		};
		
		FrameworkAJAX.sendRequest(userRequest, function(data){
			$scope.Model.users = data;
		}, function(){ 
			console.log('error getting users');
		});
	};
    
    
    $scope.Actions.createUser = function(){
        var newUserRequest = {
            method: 'POST',
            url: '/api/v0/users',
            data: {
                name: $scope.Model.newUser.name
            }
        };
        FrameworkAJAX.sendRequest(newUserRequest, function(data){
			fetchUsers();
        }, function(){
            console.log('error creating new user');
        });
    };
    
    $scope.Actions.generateAPIKey = function(userId){
        var APIKeyRequest = {
            method: 'POST',
            url: '/api/v0/users/' + userId + '/generateAPIKey',
            data: {
                name: 'UI User'
            }
        };
        FrameworkAJAX.sendRequest(APIKeyRequest, function(data){
            console.log('API key created: '+data.key);
			$scope.Model.newTournament.APIKey = data.key;			
        }, function(){
            console.log('error creating API Key');
        });
    };
    $scope.Actions.selectUser = function(user){
        $scope.Model.selectedUsers.push(user);
    };
    $scope.Actions.removeFromSelection = function( index ){
        $scope.Model.selectedUsers.splice(index, 1);
    };
    
    
    fetchUsers();
});