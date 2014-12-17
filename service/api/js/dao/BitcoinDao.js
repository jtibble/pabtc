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
            notificationURL: 'http' + (global.config.ssl ? 's' : '') + '://' + global.config.domain + ':' + global.config.port + global.config.servicesPath + global.config.notificationEndpoint,
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
    
        console.log('BitcoinDao requesting invoice from Bitpay');
        
        request( options, function(error, response, body){
            
            if( error || !response || !response.statusCode ){
                deferred.reject('service returned bad response: ' + error);
                return;
            }
            
            if (!error && response.statusCode == 200) {
                deferred.resolve(body);
            } else {
                var errorMessages = 'Bitpay service returned HTTP ' + response.statusCode;
                if( response.body && response.body.length ){
                    errorMessages += ' ' + JSON.stringify(response.body);   
                }
                if( body ){
                    errorMessages += ' ' + JSON.stringify(body);   
                }
                deferred.reject( new Error(errorMessages));
            }
            
        });
        
        return deferred.promise;
    }
};