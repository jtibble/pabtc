var Q = require('q');
var bitpay = require('bitpay');

module.exports = {
    createInvoice: function(amount, currency){
        var deferred = Q.defer();
        
        var invoice = {
            amount: amount,
            currency: currency 
        };
        
        //POST to bitpay and get the invoice in return
        
        deferred.resolve( );
        
        return deferred.promise;
    },
};