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
    
    return ;
});