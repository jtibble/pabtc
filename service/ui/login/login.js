app.controller('LoginController', function($scope, FrameworkAJAX, $state, SessionService){
    $scope.Actions = {};
    $scope.Model = {};
    
    $scope.Actions.login = function(){
        var request = {
            method: 'POST',
            url: '/api/v0/login',
            data: {
                username: $scope.Model.username,
                password: $scope.Model.password
            }
        };
        FrameworkAJAX.sendRequest(request, angular.bind(this, function(response){
            console.log('logged in');
            $scope.Model.statusText = undefined;
            SessionService.getSession();
            $state.go('home');
        }), angular.bind(this, function(){
            $scope.Model.statusText = "Login Failed. Please try again."
            console.log('login failed');
        }));
    };    
});