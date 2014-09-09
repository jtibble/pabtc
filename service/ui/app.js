var app = angular.module('uiApp', []);

app.controller('LandingController', function ($scope) {
    $scope.Model = {
        users: [
            {
                name: 'asdf1'
            },
            {
                name: 'asdf2'
            },
            {
                name: 'asdf3'
            },
            {
                name: 'asdf4'
            }
        ]   
    };
});