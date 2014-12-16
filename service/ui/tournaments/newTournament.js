
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
		
        var tournament = {
            name: $scope.Model.name,
            totalPlayers: $scope.Model.totalPlayers,
            registrationBeginDate: $scope.Model.registrationBeginDate,
            registrationCloseDate: $scope.Model.registrationCloseDate,
            date: $scope.Model.date
        };
        
        if( $scope.Model.prizeToggle ){
            if( $scope.Model.prizeType == 'creatorFunded' ){
                tournament.prizeAmount = $scope.Model.prizeAmount;
                tournament.prizeCurrency = $scope.Model.prizeCurrency;
            } else if( $scope.Model.prizeType == 'participantFunded' ){
                tournament.buyinAmount = $scope.Model.buyinAmount;
                tournament.buyinCurrency = $scope.Model.buyinCurrency;
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
        }, function(){
            $scope.Model.errorText = 'Please complete the form';
            console.log('error creating tournament');
        });
    };
    
    
});

