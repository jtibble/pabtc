app.controller('HeaderController', function($scope, $state, FrameworkAJAX){
    $scope.Actions = {};
    $scope.Model = {};
    
    $scope.Actions.goTo = function(state){
        $state.go( state );
    };
    
    $scope.Actions.logout = function(){
        FrameworkAJAX.sendRequest( {method: 'POST', url: '/api/v0/logout', data: {}}, function(){ 
            console.log('logged out');
        }, function(){ 
            console.log('failed to log out'); 
        });
    };
    
    // Fetch the session, if available
    FrameworkAJAX.sendRequest( {method: 'GET', url: '/api/v0/session', data: {}}, function(session){
        $scope.Model.sessionActive = true;
        $scope.Model.username = session.username;
    }, function(){
        $scope.Model.sessionActive = false; 
        $scope.Model.username = undefined;
    });
});