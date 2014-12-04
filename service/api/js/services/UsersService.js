var UserDao = require('../dao/UserDao');

module.exports = {
    create: function( newUser ){
        return UserDao.create( newUser );
    },
    find: function( username ){
        return UserDao.find( 'username', username );   
    }
};