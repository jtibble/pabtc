var RegistrationService = require('../services/RegistrationService');
var RequestValidator = require('./RequestValidator');

module.exports = [
    {
        'type': 'POST',
        'name': 'invoices',
        'response': function (req, res){
            var responseBody = {};
            
            var invoiceId = req.body.id;
            var invoiceStatus = req.body.status;
            
            RegistrationService.updateRegistrationStatus( invoiceId, invoiceStatus ).then( function(){
                res.status(200).send(); 
            }).fail( function(error){
                console.log('failed update registration from bitpay callback: ' + error.message);
                res.status(500).send();
            });
            
        }
    }
]