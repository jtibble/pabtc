var Q = require('q');
var UUID = require('node-uuid');
var fs = require('fs');
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
        
        request( options, function(error, response, body){
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
    createInvoice: function(amount, currency, guid){
        
        var invoice = {
            price: amount.toString(),
            currency: currency,
            itemDesc: 'PA-BTC Tournament Registration Fee',
            notificationURL: 'https://pa-btc.com/api/v0/invoices',
            posData: guid
        };
        
        return APIWrapper.post( 'invoice', invoice );
    }
};