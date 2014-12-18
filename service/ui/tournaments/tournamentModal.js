
app.controller('TournamentModalController', function($scope, FrameworkAJAX, tournament, $modalInstance){
    $scope.Actions = {
        close: function(){
            $modalInstance.dismiss();   
        }
    };
    $scope.Model = tournament;
    
    $scope.Actions.setStatus = function( status ){
        var request = {
            method: 'POST',
            url: '/api/v0/tournaments/' + $scope.Model._id,
            data: {
                status: status
            }
        };
		
        FrameworkAJAX.sendRequest(request, function(data){
            $modalInstance.dismiss();  
        }, function(data){
            $scope.Model.errorText = 'Error updating tournament status: ' + data;
        }); 
    };
    
     
    $scope.Actions.register = function(){
        
		var request = {
			method: 'POST',
			url: '/api/v0/registrations',
			data: {tournamentId: $scope.Model._id}
		};
        
        FrameworkAJAX.sendRequest( request, function( data ){
            if( data.bitpayId ){
                window.open( 'http://test.bitpay.com/invoice?id=' + data.bitpayId, '_blank');   
            }
            $modalInstance.dismiss();  
        }, function(data, status, headers, config){
            if( status == 403 ){
                $scope.Model.errorText = 'Please sign in before registering';
            } else {
                $scope.Model.errorText = 'Error. Please contact admin@pa-btc.com or create an issue on Github';
            }
        });
    };
    
});

