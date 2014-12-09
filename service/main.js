var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var request = require('request');

//Services Definitions
var UsersController = require('./api/js/controllers/UsersController');
var TournamentsController = require('./api/js/controllers/TournamentsController');
var AuthenticationController = require('./api/js/controllers/AuthenticationController');
var RegistrationCollection = require('./api/js/controllers/RegistrationController');

var servicesConfig = {
    'staticContentPath': '/ui',
    'apiPath': '/api/v0/',
    'endpoints': AuthenticationController.concat(UsersController).concat(TournamentsController).concat(RegistrationCollection)
};


var port = 80;

// Pull port out of argv if it was passed
if( process.argv.length > 2 ){
    for( var i = 1; i< process.argv.length; i++){
        var param = process.argv[i];
        
        if( param.match(/-port=[\d]+/) != 0 ){
            port = param.split('=')[1];
            console.log('setting port to ' + port);
        }
    }
}

var Service = function (config) {
    var server = express();
    server.use(bodyParser.json());
    server.use(cookieParser());
    console.log('dirname: ' + __dirname);
    server.use(express.static(__dirname + config.staticContentPath));

    var apiPath = config.apiPath;
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

            for (var i = 0; i < config.endpoints.length; i++) {
                var serviceMethod = config.endpoints[i].type;
                var serviceName = config.endpoints[i].name;
                var serviceResponse = config.endpoints[i].response;
                this.addEndpoint(serviceMethod, serviceName, serviceResponse);
            }

            server.listen(port);
            console.log('%s listening on port %s \n=========', server.name, port);
        }
    };
};

var service = Service(servicesConfig);
service.initialize();