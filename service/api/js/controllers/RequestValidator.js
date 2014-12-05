module.exports = {
    validate: function( req, requiredProperties ){

        if( !requiredProperties || requiredProperties.length == 0 ){
            return true;
        }

        var requestBody = req.body;

        for( var i in requiredProperties ){
            var propertyName = requiredProperties[i];
            if( !requestBody[ propertyName ] ){
                console.log( 'Request missing property \'' + propertyName + '\'');
                return false;
            }
        }
        return true;
    }
}