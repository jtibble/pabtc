var Q = require('q');
var UUID = require('node-uuid');

var request = require('request');



module.exports = {
    createBuyinInvoice: function(amount, currency, description, username){
        
        var deferred = Q.defer();
        
        var invoice = {
            price: amount.toString(),
            currency: currency,
            itemDesc: 'PA-BTC Tournament Registration Fee: ' + description,
            notificationURL: 'http' + (global.config.ssl ? 's' : '') + '://' + global.config.domain + ':' + global.config.port + global.config.servicesPath + global.config.bitpayNotificationEndpoint,
            buyerName: username
        };
        
        
        var options = {
            method: 'POST',
            url: global.config.bitpayURL + 'invoice',
            json: true,
            body: invoice,
            auth: {
                user: global.config.bitpayAPIKey,
                pass: ""
            }
        };
        
        console.log('bitpay request: ' + JSON.stringify(options.body));
        request( options, function(error, response, body){
            console.log('bitpay response: ' + JSON.stringify(body));
            
            if( error ){
                deferred.reject( new Error( 'could not call bitpay at ' + options.url + ' to create invoice' ) );
            } else {
                console.log('Bitpay invoice ' + body.data.id + ' created');
                deferred.resolve( body.data );
            }
        });
        
        return deferred.promise;
    }
};