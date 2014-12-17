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
        newRegistration.status = 'invoice';
        
        if( !invoice.id ){
            console.log('bitpay invoice id missing!');
            deferred.reject(new Error('bitpay invoice id missing'));
        }
    
        registrationCollection.save( newRegistration , function(error, registration){
            if( error ){
                deferred.reject('could not save registration');
            } else {              
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
    },
    
    findAndUpdateStatusByBitpayId: function( bitpayId, newStatus){
        var deferred = Q.defer();
          
        registrationCollection.findAndModify( {
            query: { bitpayId: bitpayId },
            update: { $set: {status: newStatus} },
            new: true
        }, function(error, updatedRegistration){
            if( !error && updatedRegistration ){
                deferred.resolve(updatedRegistration);
            } else {
                deferred.reject( new Error('could not update registration in db'));   
            }
        });
        
        return deferred.promise;
    }
};