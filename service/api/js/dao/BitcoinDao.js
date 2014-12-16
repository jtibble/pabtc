var Q = require('q');
var UUID = require('node-uuid');
var fs = require('fs');

console.log('Loading Bitpay API key');
var APIKey = fs.readFileSync('api.key').toString();

var request = require('request');

var baseURL = 'https://test.bitpay.com/api/'

var APIWrapper = {
    post: function(endpoint, body){
        var deferred = Q.defer();
        
        var options = {
            method: 'POST',
            url: baseURL + endpoint,
            json: true,
            body: body,
            auth: {
                user: APIKey,
                pass: ""
            }
        };
        
        console.log('bitpay request: ' + JSON.stringify(body));
        request( options, function(error, response, body){
            console.log('bitpay response: ' + JSON.stringify(body));
            
            if( error || (body && body.error) ){
                deferred.reject( new Error( error || body.error ) );
                return;
            } else {
                console.log('Bitpay invoice ' + body.id + ' created');
                deferred.resolve( body );
            }
        });
        
        return deferred.promise;
    }
};


module.exports = {
    createBuyinInvoice: function(amount, currency, description, username){
        
        var invoice = {
            price: amount.toString(),
            currency: currency,
            itemDesc: 'PA-BTC Tournament Registration Fee: ' + description,
            notificationURL: 'https://pa-btc.com/api/v0/invoices',
            buyerName: username
        };
        
        return APIWrapper.post( 'invoice', invoice );
    }
};