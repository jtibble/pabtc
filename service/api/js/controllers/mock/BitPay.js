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

            var replyURL = req.body.notificationURL;
            
            var mockInvoice = {
                "facade": "public/invoice",
                "data": {
                    "url": "https://test.bitpay.com/invoice?id=AKCduGiqD7Cj7x7cTs3ngL",
                    "status": "new",
                    "btcPrice": "3.3000",
                    "btcDue": "0.0000",
                    "price": 3.3,
                    "currency": "BTC",
                    "exRates": {
                        "USD": 332.62
                    },
                    "itemDesc": "PA-BTC Tournament Registration Fee: MOCK TOURNAMENT",
                    "invoiceTime": 1418763745361,
                    "expirationTime": 1418764645361,
                    "currentTime": 1418785976719,
                    "id": Math.floor(Math.random()*100000000),
                    "btcPaid": "3.3000",
                    "rate": 1,
                    "exceptionStatus": false,
                    "token": "A3o6wwJ8s7xpfSbT3ivimTXQGtGNAt595b5FHyaDwDKagkA2GN5QqguKhSyCxKMJwD"
                }
            };
            
            var timeout = setTimeout( function(){
                
                var mockUpdatedInvoice = JSON.parse(JSON.stringify(mockInvoice));
                mockUpdatedInvoice.data.status = 'complete';
                
                var options = {
                    url: replyURL,
                    method: 'POST',
                    json: true,
                    body: mockUpdatedInvoice
                };
                
                console.log('calling notification endpoint');
                request( options, function(error, response, body){
                    if( error ){
                        console.log('Mock Bitpay got error from calling notification endpoint ' + options.url);
                        console.log('error: ' + JSON.stringify(error) + '    response: ' + JSON.stringify(response));
                    } else {
                        console.log('Mock Bitpay got 200 OK from the notification endpoint');
                    }
                });
                
                clearTimeout(timeout);
                
            }, (Math.random()%3 + 5)*1000);
            
            console.log('Mock Bitpay is responding with mock invoice');
            res.status(200).send( mockInvoice );
        }
    }
];