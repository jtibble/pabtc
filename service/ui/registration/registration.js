app.controller('RegistrationController', function($scope, FrameworkAJAX){
    $scope.Actions = {};
    $scope.Model = {};
    
    $scope.Actions.createUser = function(){
        var newUserRequest = {
            method: 'POST',
            url: '/api/v0/users',
            data: {
                username: $scope.Model.username,
                password: $scope.Model.password
            }
        };
        FrameworkAJAX.sendRequest(newUserRequest, function(data){
			fetchUsers();
        }, function(){
            console.log('error creating new user');
        });
    };    
});