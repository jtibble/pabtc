var RESTService = require('./serviceWrapper.js');

describe('Users', function(){
    describe('Create Admin User', function(){
        it('Should return a new user id when called successfully', function(done){
            
            var user = {
                name: 'John Tibble',
                permissions: {
                    'read': true,
                    'write': true,
                    'admin': true
                }
            };

            RESTService.createUser( user, done );
            
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