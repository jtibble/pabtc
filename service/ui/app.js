var app = angular.module('uiApp', ['ui.router', 'ui.bootstrap']);

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

app.directive('bitpaydonate', function(){
    return {
        templateUrl: '/bitpaydonate/bitpaydonate.html'
    };
});

app.provider('SessionService', function(){
    return {
        $get: function(FrameworkAJAX){
            return {
                callbacks: [],
                lastSession: undefined,
                getSession: function(){
                    
                      // Fetch the session, if available
                    FrameworkAJAX.sendRequest( {method: 'GET', url: '/api/v0/session', data: {}}, angular.bind(this, function(session){
                        this.lastSession = session;
                        this.notifyListeners(session);
                    }), angular.bind(this, function(){
                        this.lastSession = undefined;
                        this.notifyListeners( undefined );
                    }));
                },
                registerCallback: function( callback ){
                    this.callbacks.push( callback );
                },
                notifyListeners: function(session){
                    for( var i in this.callbacks ){
                        this.callbacks[i]( session );
                    }  
                }
            };   
        }
    };
     
});