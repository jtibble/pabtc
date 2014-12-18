var RegistrationService = require('../services/RegistrationService');
var TournamentsService = require('../services/TournamentsService');
var RequestValidator = require('./RequestValidator');
var request = require('request');

module.exports = [
    {
        'type': 'POST',
        'name': 'invoice/:invoiceType',
        'response': function (req, res){
            var responseBody = {};
            
            if( !req.params.invoiceType ){
                res.status(404).send('Unknown invoice type!');
                return;
            }
            
            console.log('BitPay notification received');
            
            // Validate that the request came from a white-listed IP address!
            // GET https://bitpay.com/ipAddressList.txt, split['|'].contains(), add localhost
            // If good, then update registration status
            
            
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

                if( invoice.status != 'complete' ){
                    console.log('Sending 200 OK to Bitpay for status ' + invoice.status);
                    res.status(200).send();
                    return;
                }
                
                if( req.params.invoiceType == 'registration' ){
                    
                    console.log('Updating registration status');
                    RegistrationService.updateRegistrationStatus( invoice ).then( function(){
                        console.log('Registration updated for BitPay invoice ' + invoice.id);
                        res.status(200).send(); 
                    }).fail( function(error){
                        console.log('Failed to update registration from bitpay callback: ' + error.message);
                        res.status(500).send('could not update registration');
                    });
                    
                } else if( req.params.invoiceType == 'prize' ){
                 
                    console.log('Updating tournament prize');
                    TournamentsService.updatePrize( invoice ).then( function(){
                        console.log('Tournament prize updated for BitPay invoice ' + invoice.id);
                        res.status(200).send();
                    }).fail( function(error){
                        console.log('Failed to update tournament from bitpay callback: ' + error.message);
                        res.status(500).send('could not update tournament prize');
                    });
                    
                } else {
                    var errorText = 'Unknown or missing invoiceType: ' + req.params.invoiceType;
                    res.status(403).send(errorText);
                }
            });
        }
    }
]