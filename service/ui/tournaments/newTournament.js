
app.controller('NewTournamentModalController', function($scope, FrameworkAJAX, $modalInstance){
    $scope.Actions = {
        close: function(){
            $modalInstance.dismiss();   
        }
    };
    $scope.Model = {
        currencyOptions: ['USD', 'BTC', 'mBTC', 'μBTC']
    };
    
    
    $scope.Actions.createTournament = function(){
		
        var APIKeyRequest = {
            method: 'POST',
            url: '/api/v0/tournaments',
            data: {
                name: $scope.Model.name,
                status: $scope.Model.status,
                prizeAmount: $scope.Model.prizeAmount,
                prizeCurrency: $scope.Model.prizeCurrency,
                totalPlayers: $scope.Model.totalPlayers,
                registrationBeginDate: $scope.Model.registrationBeginDate,
                registrationCloseDate: $scope.Model.registrationCloseDate,
                date: $scope.Model.date
            }
        };
		
        FrameworkAJAX.sendRequest(APIKeyRequest, function(data){
            $modalInstance.dismiss();
        }, function(){
            console.log('error creating tournament');
        });
    };
    
    
});

