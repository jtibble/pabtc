var TournamentsDao = require('../dao/TournamentsDao');

module.exports = {
    create: function( newTournament ){
        return TournamentsDao.create( newTournament );
    }/*,
    find: function( username ){
        return UserDao.find( 'username', username );   
    }*/
};