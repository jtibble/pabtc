var TournamentsDao = require('../dao/TournamentsDao');

module.exports = {
    create: function( newTournament ){
        return TournamentsDao.create( newTournament );
    },
    find: function( query ){
        return TournamentsDao.find( query );   
    },
    update: function( id, updateParams ){
        return TournamentsDao.update( id, updateParams );   
    }
};