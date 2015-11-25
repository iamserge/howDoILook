Template.signIn.events({
	'submit form' : function(e){
		var email,
			password,
			videoId;

		e.preventDefault();

		email = document.getElementById('loginEmail').value;
		password = document.getElementById('loginPassword').value;
		videoId = document.getElementById('urlId').value;

		Meteor.loginWithPassword(
			email,
			password,
			function(err){
				if (typeof err === 'undefined'){
					// Success
					console.log('User logged in');
					Router.go('myVideos.show',{userId:Meteor.userId()});
				} else {
					// Error
					console.log('Error',err);				
				}
			}
		);
	}
});

Template.signIn.helpers({
	'getUrlId': function(){
		return Router.current().params.urlId;
	}
});
