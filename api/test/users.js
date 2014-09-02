var RESTService = require('./serviceWrapper.js');

describe('Users', function(){
    describe('Create Admin User', function(){
        it('Should return a new user id when called successfully', function(done){
            
            var user = {
                name: 'John Tibble',
                permissions: {
                    'admin': true,
                    'read': true,
                    'write': true
                }
            };
            
            function callback(user) {
                if( user && user._id ){
                    done();
                } else {
                    done('request succeeded, but received bad user data: ' + JSON.stringify(user));   
                }
            }

            RESTService.createUser( user ).then( callback, function(error){
                done(error);
            });
        });
    });
    
    describe('Create Incomplete User', function(){
        it('Should return an error', function(done){
            
            var user = {
                name: 'John Tibble' // Missing permissions
            };
            
            function callback(user) {
                console.log('callback called');
                if( user && user._id ){
                    done('user created, which is incorrect');
                } else {
                    done();
                }
            }

            RESTService.createUser( user ).then( callback, function(error){
                done(error);
            });
        });
    });
});


/* var moreUsers = [
        {
            name: 'Read User',
            permissions: {
                'read': true
            }
        },
        {
            name: 'Full (non-admin) User',
            permissions: {
                'read': true,
                'write': true
            }
        },
        {
            name: 'No Permissions User',
            permissions: {}
        }
];*/