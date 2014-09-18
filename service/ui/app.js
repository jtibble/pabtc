var app = angular.module('uiApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    
  $urlRouterProvider.otherwise("/home");
    
  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "partials/home.html"
    })
    .state('users', {
      url: "/users",
      templateUrl: "partials/users.html",
      controller: "UsersController"
    })
    .state('tournaments', {
      url: "/tournaments",
      templateUrl: "partials/tournaments.html",
      controller: "TournamentsController"
    });
});

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

app.controller('TournamentsController', function($scope, FrameworkAJAX){
    $scope.Actions = {};
    $scope.Model = {};
    
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
    
    
    $scope.Actions.createTournament = function(){
		if( !$scope.Model.newTournament.APIKey ){
			console.log('Can\'t create tournament without an API key provided');
			return;
		}
		
        var APIKeyRequest = {
            method: 'POST',
            url: '/api/v0/tournaments',
            data: {
                name: $scope.Model.newTournament.name
            },
            headers: {
                APIKey: $scope.Model.newTournament.APIKey
            }
        };
		
        FrameworkAJAX.sendRequest(APIKeyRequest, function(data){
			fetchTournaments();
        }, function(){
            console.log('error creating tournament');
        });
    };
    
    $scope.Actions.selectTournament = function( tournament ){
        $scope.Model.selectedTournament = tournament;  
    };
    $scope.Actions.registerUsersToTournament = function(){
        var userIdList = [];
        for( var i in $scope.Model.selectedUsers ){
            userIdList.push( $scope.Model.selectedUsers[i]._id);
        }
        
        var RegisterUsersRequest = {
            method: 'POST',
            url: $scope.Model.selectedTournament.href + '/registerUsers',
            data: {
                usersList: userIdList
            }
        };
		
        FrameworkAJAX.sendRequest(RegisterUsersRequest, function(data){
			fetchTournaments();
        }, function(){
            console.log('error registering users');
        });
        
    };
    
    
    fetchTournaments();
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