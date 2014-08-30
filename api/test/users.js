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
            
            function callback(error, response, body) {
                if (!error && response && response.statusCode == 200) {
                    if( body.data && body.data._id ){
                        done();
                    } else {
                        throw 'POST succeeded, but received bad data: ' + JSON.stringify(body);   
                    }
                } else {
                    throw 'Failed to create user';
                }
            }

            RESTService.createUser( user, callback );
            
        });
    });
    
    describe('Create Incomplete User', function(){
        it('Should return an error', function(done){
            
            var user = {
                name: 'John Tibble' // missing permissions
            };

            function callback(error, response, body) {
                if (!error && response && response.statusCode == 200) {
                    if( body.data && body.data._id ){
                        throw 'Failed to not create user';
                    } else {
                        done();   
                    }
                } else {
                    throw 'Failed to not create user correctly';
                }
            }
            
            RESTService.createUser( user, callback);
            
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