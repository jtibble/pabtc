var UUID = require('node-uuid');

console.log('Initializing Storage');

var localDB = {
	tournaments: {},
	users: {}
};

var fakeUsers = [
		{
			name: 'John Tibble',
			permissions: {
				'read': true,
				'write': true,
				'admin': true
			}
		},
		{
			name: 'Read User',
			permissions: {
				'read': true
			}
		},
		{
			name: 'Full (non-admin) User',
			permissions: {
				'read': true,
				'write': true
			}
		},
		{
			name: 'Read User 2',
			permissions: {
				'read': true
			}
		},
		{
			name: 'No Permissions User',
			permissions: {}
		}
];



module.exports = {
	addTournament: function(tournamentInfo, userId){
		if( !tournamentInfo || !userId ){
			return false;
		}
		
		var storedUser = localDB.users[userId];
		if( storedUser && storedUser.permissions && storedUser.permissions.write){
			
			tournamentInfo.id = UUID.v4( {rng: UUID.nodeRNG } );
			localDB.tournaments[tournamentInfo.id] = tournamentInfo;
			return tournamentInfo.id;
			
		} else {
			return false;
		}
	},
	searchTournaments: function( searchInfo, userId ){
		
	},
	deleteTournament: function( id, userId ){
		
	},
	
	addUser: function( userConfig ){
		if( !userConfig ){
			return false;
		}
		
		userConfig.id = UUID.v4( { rng: UUID.nodeRNG} );
		localDB.users[userConfig.id] = userConfig;
		
		return userConfig;		
	},
	deleteUser: function( id ){
		
	},
	searchUsers: function( searchInfo ){
		
	}
};

console.log('Adding Users');

for( var i in fakeUsers ){
	var user = fakeUsers[i];
	var storedUser = module.exports.addUser( user );
	
	if( storedUser ){
		console.log('User \'' + storedUser.name + '\' stored in DB with id ' + storedUser.id);
	} else {
		console.log('Could not add user ' + user.name);	
	}
}

