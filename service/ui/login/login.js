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
        FrameworkAJAX.sendRequest(request, function(response){
            console.log('logged in');
            SessionService.getSession();
            $state.go('home');
        }, function(){
            console.log('login failed');
        });
    };    
});