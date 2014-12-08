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
        
        // create registration-tracking object in DB and also link registration to tournament.registrations[] array
        
        // TODO next time, insert into tournaments collection as well
        
        registrationCollection.save( newRegistration, function(error, registration){
            if( error ){
                deferred.reject('could not save registration');
            } else {
                deferred.resolve( registration );
            }
        });
        
        return deferred.promise;
    }
};