var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var services = require('./services.js');

var Service = function (config) {
    var server = express();
    server.use(bodyParser.json())
    server.use(express.static(__dirname + config.staticContentPath));

    var apiPath = config.apiPath;
    console.log('Creating Service in ' + apiPath);
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

            var port = process.env.PORT || 80;
            server.listen(port);
            console.log('%s listening at %s', server.name, port);
        }
    };
};

var service = Service(services);
service.initialize();