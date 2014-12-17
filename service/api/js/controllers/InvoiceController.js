var RegistrationService = require('../services/RegistrationService');
var RequestValidator = require('./RequestValidator');
var request = require('request');

module.exports = [
    {
        'type': 'POST',
        'name': 'invoice',
        'response': function (req, res){
            var responseBody = {};
            
            console.log('BitPay notification incoming');
            
            // Validate that the request came from a white-listed IP address!
            // GET https://bitpay.com/ipAddressList.txt, split['|'].contains(), add localhost
            // If good, then update registration status
            
            console.log('fetching bitpay ip whitelist from ' + global.config.bitpayIPAddresses);
            
            request( {url: global.config.bitpayIPAddresses, method: 'GET'}, function(error, response, body){
                if( error ){
                    console.log('could not fetch bitpay IP address whitelist');
                    console.log('error: ' + JSON.stringify(error));
                    res.status(500).send( error );
                    return;
                }
                
                var IPList = body.split('|').concat('127.0.0.1');
                
                if( IPList.indexOf( req.ip ) == -1 ){
                    console.log('Unauthorized attempt to change registration status! IP address ' + req.ip);
                    res.status(403).send('Unauthorized attempt to change registration status!');
                    return;
                }
                    
                var invoice = req.body;
                
                console.log('invoice: ' + JSON.stringify(invoice));

                console.log('Received BitPay notification: id ' + invoice.id + ' has status ' + invoice.status);

                if( invoice.status != 'complete' ){
                    console.log('sending acknowledgement of status ' + invoice.status);
                    res.status(200).send();
                    return;
                }

                RegistrationService.updateRegistrationStatus( invoice ).then( function(){
                    console.log('updated registration');
                    res.status(200).send(); 
                }).fail( function(error){
                    console.log('failed update registration from bitpay callback: ' + error.message);
                    res.status(500).send('could not update registration');
                });
            });
        }
    }
]