var app = angular.module('uiApp', []);

app.controller('LandingController', function ($scope, FrameworkAJAX) {
    
    var userRequest = {
        method: 'GET',
        url: '/api/v0/users',
        data: {}
    };
    
    $scope.Model = {};
    
    FrameworkAJAX.sendRequest(userRequest, function(data){
        $scope.Model.users = data;
    }, function(){ 
        console.log('error getting users');
    });
    
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
    
    $scope.Actions = {};
    
    $scope.Actions.createUser = function(){
        var newUserRequest = {
            method: 'POST',
            url: '/api/v0/users',
            data: {
                name: 'UI User'
            }
        };
        FrameworkAJAX.sendRequest(newUserRequest, function(data){
            console.log('user created');
        }, function(){
            console.log('error creating new user');
        });
        
    };
    
});




app.provider('FrameworkAJAX', function(){
	return {
		$get: ['$http', function( $http ){
			return {
				sendRequest: function(request, successCallback, errorCallback){
					
					if( !request.method || !request.url || !request.data ){
						console.log('Error making AJAX request: missing method, url, or data.');
						return;
					}
					
					return $http( request ).success( successCallback ).error( errorCallback );
				}
			};
		}]		
	};
});