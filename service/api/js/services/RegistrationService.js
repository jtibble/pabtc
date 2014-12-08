var RegistrationsDao = require('../dao/RegistrationDao');

module.exports = {
    create: function( username, tournamentId ){
        return RegistrationsDao.create( username, tournamentId );
    }
};