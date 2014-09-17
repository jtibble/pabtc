var UUID = require('node-uuid');

module.exports = {
    
    user: {
        _id: '',
        dateCreated: '',
        name: '',
        APIKey: null
    },
    tournament: {
        _id: '',
        dateCreated: '',
        name: ''
    },
    event: {
        _id: '',
        dateCreated: '',
        name: ''
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