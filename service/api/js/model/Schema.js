var UUID = require('node-uuid');

module.exports = {
    
    user: {
        _id: '',
        dateCreated: '',
        username: '',
        password: '',
        receivingAddress: ''
    },
    tournament: {
        _id: '',
        dateCreated: '',
        name: '',
        createdBy: '',
        totalPlayers: 0,
        registrations: [],
        buyinCurrency: '',
        buyinAmount: 0,
        prizeCurrency: '',
        prizeAmount: 0,
        status: 'new',
        bitpayId: ''
    },
    session: {
        _id: '',
        username: ''
    },
    registration: {
        _id: '',
        dateCreated: '',
        status: '',
        username: '',
        tournamentId: '',
        bitpayId: ''
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