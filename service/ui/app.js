var app = angular.module('uiApp', []);

app.controller('LandingController', function ($scope, FrameworkAJAX) {
    
    
    $scope.Model = {};
	
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
	
	var fetchTournaments = function(){
    
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
		
	};
	
	fetchTournaments();
	fetchUsers();
    
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
			$scope.Model.APIKey = data.key;			
        }, function(){
            console.log('error creating API Key');
        });
    };
    
    $scope.Actions.createTournament = function(){
		if( !$scope.Model.APIKey ){
			console.log('Can\'t create tournament without an API key provided');
			return;
		}
		
        var APIKeyRequest = {
            method: 'POST',
            url: '/api/v0/tournaments',
            data: {
                name: 'UI Tournament'
            },
            headers: {
                APIKey: $scope.Model.APIKey
            }
        };
		
        FrameworkAJAX.sendRequest(APIKeyRequest, function(data){
            console.log('tournament created');
			
			fetchTournaments();
        }, function(){
            console.log('error creating tournament');
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