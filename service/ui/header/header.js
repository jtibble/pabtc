app.controller('HeaderController', function($scope, $state, FrameworkAJAX, SessionService){
    $scope.Actions = {};
    $scope.Model = {};
    
    $scope.Actions.goTo = function(state){
        $state.go( state );
    };
    
    $scope.Actions.logout = function(){
        FrameworkAJAX.sendRequest( {method: 'POST', url: '/api/v0/logout', data: {}}, function(){ 
            console.log('logged out');
            SessionService.getSession();
        }, function(){ 
            console.log('failed to log out'); 
        });
    };
    
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
    SessionService.getSession();
});