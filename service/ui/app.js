var app = angular.module('uiApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    
  $urlRouterProvider.otherwise("/home");
    
    $stateProvider
    .state('home', {
        url: "/home",
        templateUrl: "home/home.html"
    })
    .state('login', {
        url: "/login",
        templateUrl: "login/login.html",
        controller: "LoginController"
    })
    .state('registration', {
        url: "/registration",
        templateUrl: "registration/registration.html",
        controller: "RegistrationController"
    })
    .state('users', {
        url: "/users",
        templateUrl: "users/users.html",
        controller: "UsersController"
    })
    .state('tournaments', {
        url: "/tournaments",
        templateUrl: "tournaments/tournaments.html",
        controller: "TournamentsController"
    });
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

app.directive('header', function(){
  return {
    templateUrl: '/header/header.html',
    controller: 'HeaderController'
  };
});