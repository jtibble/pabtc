
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
            url: 'http://localhost:8080/api/v0/tournaments/' + $scope.Model._id,
            data: {
                status: status
            }
        };
		
        FrameworkAJAX.sendRequest(request, function(data){
			console.log('updated status');
            $modalInstance.dismiss();  
        }, function(){
            console.log('error registering users');
        }); 
    };
    
    
       
    $scope.Actions.register = function(){
        
		var request = {
			method: 'POST',
			url: '/api/v0/registrations',
			data: {tournamentId: $scope.Model._id}
		};
        
        FrameworkAJAX.sendRequest( request, function( data ){
            if( data.invoiceUrl ){
                window.open( data.invoiceUrl, '_blank');   
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

