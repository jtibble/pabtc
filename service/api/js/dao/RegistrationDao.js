var Schema = require('../model/Schema.js');

var UUID = require('node-uuid');
var Q = require('q');

var mongojs = require('mongojs');
var db = mongojs('test');
var registrationCollection = db.collection('registrations');

var RegistrationStatusList = require('../model/RegistrationStatus');

module.exports = {
    create: function( username, tournamentId ){
        var deferred = Q.defer();
        
        var newRegistration = Schema.create('registration');
        newRegistration.username = username;
        newRegistration.tournamentId = tournamentId;
        newRegistration.status = RegistrationStatusList[0];
                
        registrationCollection.save( newRegistration, function(error, registration){
            if( error ){
                deferred.reject('could not save registration');
            } else {
                deferred.resolve( registration );
            }
        });
        
        return deferred.promise;
    },
    find: function( parameterName, value ){
        var deferred = Q.defer();
        
        var query = {};
        
        query[ parameterName ] = value;
            
        registrationCollection.find( query, function(error, registration){
            if( error ){
                deferred.reject('could not find registration');
            } else {
                deferred.resolve( registration );
            }
        });
        
        
        return deferred.promise;
    }
};