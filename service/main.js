var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var request = require('request');
var fs = require('fs');
var mongojs = require('mongojs');
var Q = require('q');

// Check environment variable
if( !process.env.NODE_ENV ){
    console.log('set NODE_ENV = "local", "dev", or "prod"');
    process.exit(1);
}

// Get ENV variable and initialize config
global.config = JSON.parse(fs.readFileSync('service/config/' + process.env.NODE_ENV + '.json').toString());

console.log('config file loaded');

// Retrieve BitPay API key from database before proceeding
var db = mongojs('test');
var keysCollection = db.collection('keys');
var configPromise = Q.defer();

keysCollection.find({}, function(error, keyList){
    if( !error && keyList.length == 1 ){
        global.config.bitpayAPIKey = keyList[0].key;
        console.log('Configured for ' + process.env.NODE_ENV + ' environment');
        configPromise.resolve();
    } else {
        console.log('Error! Could not find API key in db');
        process.exit(1);   
    }
});


//Services Definitions
var UsersController = require('./api/js/controllers/UsersController');
var TournamentsController = require('./api/js/controllers/TournamentsController');
var AuthenticationController = require('./api/js/controllers/AuthenticationController');
var RegistrationCollection = require('./api/js/controllers/RegistrationController');
var InvoiceController = require('./api/js/controllers/InvoiceController');

var servicesArray = AuthenticationController.concat(UsersController).concat(TournamentsController).concat(RegistrationCollection).concat(InvoiceController);

var httpsCredentials = {
    key: fs.readFileSync('key.key'),
    cert: fs.readFileSync('pa-btc_com.crt.crt')
};
    
var server = express();
server.use(bodyParser.json());
server.use(cookieParser());
console.log('dirname: ' + __dirname);

configPromise.promise.then( function(){

    server.use(express.static(__dirname + global.config.staticContentPath));

    // Mock BitPay integration if requested by config
    if( global.config.mockBitpay ){
        console.log('Loading bitpay mock');
        var BitPayController = require('./api/js/controllers/mock/BitPay.js');
        servicesArray = servicesArray.concat(BitPayController);
    }
    
    var apiPath = global.config.servicesPath;

    for( var i in servicesArray ){
        var serviceMethod = servicesArray[i].type;
        var serviceName = servicesArray[i].name;
        var serviceResponse = servicesArray[i].response;
        
        var fullServiceName = apiPath + serviceName;
        switch (serviceMethod) {
            case 'GET':
                server.get(fullServiceName, serviceResponse);
                console.log('Created GET \'' + fullServiceName + '\'');
                break;
            case 'POST':
                server.post(fullServiceName, serviceResponse);
                console.log('Created POST \'' + fullServiceName + '\'');
                break;
            default:
                console.log('Unknown serviceMethod \'' + serviceMethod + '\'');
        }
    }

    // server.listen( global.config.port );
    var httpsServer = https.createServer( httpsCredentials, server);
    httpsServer.listen( global.config.port );
    console.log('server listening on port %s \n=========', global.config.port);

}).fail( function(error){
    console.log('failed to initialize application: ' + error.message);  
});