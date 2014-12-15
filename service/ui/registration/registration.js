app.controller('RegistrationController', function($scope, FrameworkAJAX, $state){
    $scope.Actions = {};
    $scope.Model = {};
    
    $scope.Actions.createUser = function(){
        var newUserRequest = {
            method: 'POST',
            url: '/api/v0/users',
            data: {
                username: $scope.Model.username,
                password: $scope.Model.password,
                receivingAddress: $scope.Model.receivingAddress
            }
        };
        FrameworkAJAX.sendRequest(newUserRequest, function(data){
			$state.go('login');
        }, function(){
            console.log('error creating new user');
        });
    };    
});