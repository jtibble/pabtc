var request = require('request');


module.exports = [
    {
        'type': 'GET',
        'name': 'bitpay/ipList',
        'response': function (req, res) {
            res.status(200).send(req.ip.toString());
        }
    },
    {
        'type': 'POST',
        'name': 'bitpay/invoice',
        'response': function (req, res) {
            
            var randomId = Math.floor(Math.random()*10000000).toString()
            
            var mockInvoice = {
                "id": randomId,
                "url": "https://test.bitpay.com/invoice?id=" + randomId,
                "status": "new",
                "btcPrice": req.body.price.toString(),
                "price": req.body.price,
                "currency": req.body.currency,
                "invoiceTime": 1418833532976,
                "expirationTime": 1418834432976,
                "currentTime": 1418833533001,
                "btcPaid": "0.0000",
                "rate": 1,
                "exceptionStatus": false,
                "buyerFields": {
                    "buyerName": "MOCK"
                }
            };
            
            var timeout = setTimeout( function(){
                
                var mockUpdatedInvoice = JSON.parse(JSON.stringify(mockInvoice));
                mockUpdatedInvoice.status = 'complete';
                mockUpdatedInvoice.btcPaid = req.body.price;
                
                var options = {
                    url: req.body.notificationURL,
                    method: 'POST',
                    json: true,
                    body: mockUpdatedInvoice
                };
                
                console.log('Mock Bitpay is calling notification endpoint ' + options.url);
                request( options, function(error, response, body){
                    if( error ){
                        console.log('Mock Bitpay got error from calling notification endpoint');
                        console.log('error: ' + JSON.stringify(error) + '    response: ' + JSON.stringify(response));
                        return;
                    }
                });
                
                clearTimeout(timeout);
                
            }, (Math.random()%3 + 5)*1000);
            
            console.log('Mock Bitpay is responding with mock invoice');
            res.status(200).send( mockInvoice );
        }
    }
];