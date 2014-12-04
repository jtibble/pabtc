var TournamentsDao = require('../dao/TournamentsDao');

module.exports = {
    create: function( newTournament ){
        return TournamentsDao.create( newTournament );
    },
    find: function(){
        return TournamentsDao.find();   
    }
};