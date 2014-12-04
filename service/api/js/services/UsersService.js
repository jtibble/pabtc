var UserDao = require('../dao/UserDao');

module.exports = {
    create: function( newUser ){
        return UserDao.create( newUser );
    }
};