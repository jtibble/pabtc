var Schema = require('../model/Schema');

var UUID = require('node-uuid');
var Q = require('q');

var mongojs = require('mongojs');
var db = mongojs('test');
var usersCollection = db.collection('users');

module.exports = {
    create: function( params ){
        var deferred = Q.defer();

        var newUser = Schema.create('user');
        var newUserKeys = Object.keys(newUser);

        // Copy properties to new object if they exist in the schema
        for( var i in newUserKeys ){
            var keyName = newUserKeys[i];
            if( params[ keyName ] ){
                newUser[ keyName ] = params[ keyName ];
            }
        }

        // Check that the user doesn't already exist!
        this.find( 'username', newUser.username ).then(function( userList ){
            if( userList.length != 0 ){
                console.log('Can not create user: user already exists in db');
                deferred.reject( new Error('Username already exists in db'));
            } else {
                
                usersCollection.save(newUser, function(error, user){
                    if( error ){
                        deferred.reject('could not create user');
                    } else {
                        deferred.resolve(user);
                    }
                });

            }
        });
        
        return deferred.promise;
    },
    findByUsernameWithPassword: function( username ){
        var deferred = Q.defer();
        var criteria = { username: username };
        var projection = { _id: 0 };
        
        usersCollection.find( criteria, projection, function (error, usersList) {
            if (error){
                deferred.reject( new Error('error finding users: ' + error));
            } else {
                deferred.resolve(usersList);
            }
        });
        
        return deferred.promise;        
    },
    find: function( property, value ){
        var deferred = Q.defer();
        
        var criteria = {};
        var projection = { _id: 0, password: 0 }; 
                
        if( property && value){
            criteria[property] = value;
        }
        
        usersCollection.find( criteria, projection, function (error, usersList) {
            if (error || !usersList){
                deferred.reject( new Error('error finding users: ' + error));
            } else {
                deferred.resolve(usersList);
            }
        });

        return deferred.promise;
    }/*,
    createAPIKey: function( userId){
        var deferred = Q.defer();

        console.log('User id=' + userId + ' is requesting an API key');

        this.find('_id', userId).then( function( userList){
            
            if( !userList || !userList.length ){
                deferred.reject('error finding user in db');
                return;
            }

            var user = userList[0];

            // Prevent the user from re-creating an API key
            if( user && user.APIKey ){
                deferred.reject('API key already created! Cannot recreate.');
                return;
            }

            // Generate new key
            var APIKey = UUID.v4({rng: UUID.nodeRNG});
            var searchQuery = {_id: user._id};
            var updateParameter = { $set: { APIKey: APIKey } };

            // Update user in DB
            usersCollection.update( searchQuery,updateParameter, {}, function(error, updateStatus){
                if( !error && updateStatus.ok && updateStatus.n == 1 ){

                    // Find the updated user and return the API key in the response
                    usersCollection.find( searchQuery, function(error, userList){
                        if(!error && userList && userList.length && userList[0].APIKey){

                            console.log('User id=' + userId + ' had an API key created at ' + (new Date()).toISOString());
                            deferred.resolve(userList[0].APIKey);
                        } else {
                            deferred.reject('Set API key but couldn\'t return it successfully.');
                        }
                    });

                } else {
                    deferred.reject( 'Could not create API key' );
                }
            });
        });


        return deferred.promise;
    }  */
};