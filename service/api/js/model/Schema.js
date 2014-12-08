var UUID = require('node-uuid');

module.exports = {
    
    user: {
        _id: '',
        dateCreated: '',
        username: '',
        password: '' 
    },
    tournament: {
        _id: '',
        dateCreated: '',
        name: '',
        createdBy: '',
        totalPlayers: 2,
        registrations: [],
        status: 'pending'
    },
    session: {
        _id: '',
        username: ''
    },
    event: {
        _id: '',
        dateCreated: ''
    },
    registration: {
        _id: '',
        dateCreated: '',
        status: '',
        username: '',
        tournamentId: ''
    },
    
    create: function( objectName ){
        if( !this[objectName] ){
            throw 'Schema not create object \'' + objectName + '\'';
        }
        
        var newObject = JSON.parse( JSON.stringify( this[objectName] ) );
        newObject._id = UUID.v4({rng: UUID.nodeRNG});
        newObject.dateCreated = (new Date()).toISOString();
        return newObject;
    }
};