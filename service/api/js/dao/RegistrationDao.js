var Schema = require('../model/Schema.js');

var UUID = require('node-uuid');
var Q = require('q');

var mongojs = require('mongojs');
var db = mongojs('test');
var registrationCollection = db.collection('registrations');

var RegistrationStatusList = require('../model/RegistrationStatus');

module.exports = {
    createWithInvoice: function( username, tournamentId, invoice ){
        var deferred = Q.defer();
        
        var newRegistration = Schema.create('registration');
        newRegistration.username = username;
        newRegistration.tournamentId = tournamentId;
        newRegistration.bitpayId = invoice.id;
        newRegistration.bitpaySecret = invoice.posData;
        newRegistration.status = 'new';
    
        registrationCollection.save( newRegistration , function(error, registration){
            if( error ){
                deferred.reject('could not save registration');
            } else {
                console.log('registration for tournament created');
                
                // Erase the secret so the user can't change the status themselves
                newRegistration.bitpaySecret = undefined;
                
                deferred.resolve( registration );
            }
        });
        
        return deferred.promise;
    }, 
    
    createPaid: function( username, tournamentId ){
        var deferred = Q.defer();
        
        var newRegistration = Schema.create('registration');
        newRegistration.username = username;
        newRegistration.tournamentId = tournamentId;
        newRegistration.status = 'paid';
        
        registrationCollection.save( newRegistration, function(error, registration){
            if( error ){
                deferred.reject('could not save registration');
            } else {
                console.log('registration for tournament created');
                deferred.resolve( registration );
            }
        });
        
        return deferred.promise; 
    },
    
    find: function( parameterName, value ){
        var deferred = Q.defer();        
        var query = {};
        
        query[ parameterName ] = value;
            
        registrationCollection.find( query, function(error, registrationList){
            if( error ){
                deferred.reject('could not find registrations by that query in db');
            } else {
                deferred.resolve( registrationList );
            }
        });
        
        return deferred.promise;
    }
};