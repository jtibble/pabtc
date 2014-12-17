var Schema = require('../model/Schema.js');

var UUID = require('node-uuid');
var Q = require('q');

var mongojs = require('mongojs');
var db = mongojs('test');
var tournamentsCollection = db.collection('tournaments');

var tournamentStatusList = require('../model/TournamentStatus.js');

module.exports = {
    create: function( params ){
        var deferred = Q.defer();
        
        var newTournament = Schema.create('tournament');
        var newTournamentKeys = Object.keys(newTournament);

        // Copy properties to new object if they exist in the schema
        for( var i in newTournamentKeys ){
            var keyName = newTournamentKeys[i];
            if( params[ keyName ] ){
                newTournament[ keyName ] = params[ keyName ];
            }
        }

        tournamentsCollection.save(newTournament, function(error, tournament){
            if( error ){
                deferred.reject(new Error('could not create tournament'));
            } else {
                deferred.resolve(tournament);
            }
        });

        return deferred.promise;
    },
    find: function( query ){
        var deferred = Q.defer();
        var projection = {};

        tournamentsCollection.find(query, projection, function(error, tournamentsList){
            if( !error && tournamentsList ){
                deferred.resolve( tournamentsList );
            } else {
                deferred.reject( new Error('Could not fetch tournaments' ));
            }
        });

        return deferred.promise;
    },
    findById: function( tournamentId ){
        var deferred = Q.defer();
        var projection = {};

        tournamentsCollection.find({_id: tournamentId}, projection, function(error, tournamentsList){
            if( !error && tournamentsList.length == 1 ){
                deferred.resolve( tournamentsList[0] );
            } else {
                deferred.reject( new Error('Could not fetch tournaments - error or too many returned' ));
            }
        });

        return deferred.promise;
    },
    update: function( tournamentId, updateParams ){
        var deferred = Q.defer();
        
        if( !updateParams ){
            deferred.reject( new Error('no update parameters specified'));
            return;
        }
        
        var updateKeys= {};
        
        // Selectively add keys to update. Don't add tons of keys from REST request, of course
        if( updateParams.status){
            if( tournamentStatusList.indexOf( updateParams.status ) != -1 ){                    
                updateKeys.status = updateParams.status;
            } else {
                console.log('tried to update tournament status to invalid value');
                deferred.reject('requested tournament status is not valid');
                return deferred.promise;
            }
        }
        
        tournamentsCollection.findAndModify( {
            query: {_id: tournamentId },
            update: { 
                $set: updateKeys
            },
            new: true
        }, function(error, updatedTournament){
            if( !error ){
                deferred.resolve(updatedTournament);
            } else {
                deferred.reject( new Error('could not update tournament in db'));   
            }
        });
        
        
        
        return deferred.promise;
    },
    
    addPrizeAmountToTournamentById: function( tournamentId, amount ){
        var deferred = Q.defer();
        
        tournamentsCollection.findAndModify( {
            query: { _id: tournamentId },
            update: { $inc: {prizeAmount: Number(amount)} },
            new: true
        }, function(error, updatedTournament){
            if( !error && updatedTournament ){
                deferred.resolve(updatedTournament);
            } else {
                deferred.reject( new Error('could not update tournament prize in db: ' + JSON.stringify(error)));   
            }
        });
        
        return deferred.promise;
    }
};