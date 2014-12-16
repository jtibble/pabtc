var RegistrationService = require('../services/RegistrationService');
var RequestValidator = require('./RequestValidator');

var request = require('request');

module.exports = [
    {
        'type': 'POST',
        'name': 'invoices',
        'response': function (req, res){
            var responseBody = {};
            
            // Validate that the request came from a white-listed IP address!
            // GET https://bitpay.com/ipAddressList.txt, split['|'].contains(), add localhost
            // If good, then update registration status
            request( {url: 'https://bitpay.com/ipAddressList.txt', method: 'GET'}, function(error, response, body){
                if( error ){
                    res.status(500).send();
                    return;
                }
                
                var IPList = body.split('|').concat('127.0.0.1');
                
                if( IPList.indexOf( req.ip ) != -1 ){
                    
                    var invoiceId = req.body.id;
                    var invoiceStatus = req.body.status;
                    
                    RegistrationService.updateRegistrationStatus( invoiceId, invoiceStatus ).then( function(){
                        res.status(200).send(); 
                    }).fail( function(error){
                        console.log('failed update registration from bitpay callback: ' + error.message);
                        res.status(500).send();
                    });
                } else {
                    console.log('Unauthorized attempt to change registration status!');
                    res.status(403).send('Unauthorized attempt to change registration status!');
                }
            });
        }
    }
]