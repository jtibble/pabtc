var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var request = require('request');
var fs = require('fs');
var mongojs = require('mongojs');
var Q = require('q');

// Get ENV variable and initialize config
global.config = JSON.parse(fs.readFileSync('service/config/' + process.env.ENV + '.json').toString());

// Retrieve BitPay API key from database before proceeding
var db = mongojs('test');
var keysCollection = db.collection('keys');
var deferred = Q.defer();

keysCollection.find({}, function(error, keyList){
    if( !error && keyList.length == 1 ){
        global.config.bitpayAPIKey = keyList[0].key;
        console.log('Configured for ' + process.env.ENV + ' environment');
        deferred.resolve();
    } else {
        process.exit(1);   
    }
});


// Service-generator helper function
var Service = function (serviceDefinitions) {
    var server = express();
    server.use(bodyParser.json());
    server.use(cookieParser());
    console.log('dirname: ' + __dirname);
    server.use(express.static(__dirname + global.config.staticContentPath));

    var apiPath = global.config.servicesPath;
    console.log('Creating Services');
    return {
        
        addEndpoint: function (serviceMethod, serviceName, response) {
            var fullServiceName = apiPath + serviceName;
            switch (serviceMethod) {
            case 'GET':
                server.get(fullServiceName, response);
                console.log('Created GET \'' + fullServiceName + '\'');
                break;
            case 'POST':
                server.post(fullServiceName, response);
                console.log('Created POST \'' + fullServiceName + '\'');
                break;
            default:
                console.log('Unknown serviceMethod \'' + serviceMethod + '\'');
            }
        },
        
        initialize: function () {

            for (var i = 0; i < serviceDefinitions.length; i++) {
                var serviceMethod = serviceDefinitions[i].type;
                var serviceName = serviceDefinitions[i].name;
                var serviceResponse = serviceDefinitions[i].response;
                this.addEndpoint(serviceMethod, serviceName, serviceResponse);
            }

            server.listen( global.config.port );
            console.log('server listening on port %s \n=========', global.config.port);
        }
    };
};


deferred.promise.then( function(){
    
    //Services Definitions
    var UsersController = require('./api/js/controllers/UsersController');
    var TournamentsController = require('./api/js/controllers/TournamentsController');
    var AuthenticationController = require('./api/js/controllers/AuthenticationController');
    var RegistrationCollection = require('./api/js/controllers/RegistrationController');
    var InvoiceController = require('./api/js/controllers/InvoiceController');

    var servicesArray = AuthenticationController.concat(UsersController).concat(TournamentsController).concat(RegistrationCollection).concat(InvoiceController);


    // Mock BitPay integration if requested by config
    if( global.config.mockBitpay ){
        console.log('loading bitpay mock');
        var BitPayController = require('./api/js/controllers/mock/BitPay.js');
        servicesArray = servicesArray.concat(BitPayController);
    }

    
    var service = Service(servicesArray);
    service.initialize();
});