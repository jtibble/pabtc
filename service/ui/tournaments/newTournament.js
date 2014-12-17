
app.controller('NewTournamentModalController', function($scope, FrameworkAJAX, $modalInstance){
    $scope.Actions = {
        close: function(){
            $modalInstance.dismiss();   
        }
    };
    $scope.Model = {
        currencyOptions: ['USD', 'BTC', 'mBTC', 'μBTC'],
        prizeAmount: 0,
        prizeCurrency: 'BTC',
        buyinAmount: 0,
        buyinCurrency: 'BTC'
    };
    
    
    $scope.Actions.createTournament = function(){
		
        var tournament = {
            name: $scope.Model.name,
            totalPlayers: $scope.Model.totalPlayers,
            registrationBeginDate: $scope.Model.registrationBeginDate,
            registrationCloseDate: $scope.Model.registrationCloseDate,
            date: $scope.Model.date
        };
        
        if( $scope.Model.prizeToggle ){
            if( $scope.Model.prizeType == 'creatorFunded'){
                tournament.buyinAmount = 0;
                tournament.buyinCurrency = 'BTC';
                tournament.prizeAmount = $scope.Model.prizeAmount;
                tournament.prizeCurrency = $scope.Model.prizeCurrency;
            } else {
                tournament.buyinAmount = $scope.Model.buyinAmount;
                tournament.buyinCurrency = $scope.Model.buyinCurrency;
                tournament.prizeAmount = 0;
                tournament.prizeCurrency = 'BTC';
            }
        }
        
        var APIKeyRequest = {
            method: 'POST',
            url: '/api/v0/tournaments',
            data: tournament
        };
        
        FrameworkAJAX.sendRequest(APIKeyRequest, function(data){
            if( data.invoiceUrl ){
                window.open( data.invoiceUrl, '_blank');   
            }
            $modalInstance.dismiss();
        }, function(data, status, headers){
            $scope.Model.errorText = data.message;
            console.log('error creating tournament');
        });
    };
    
    
});

