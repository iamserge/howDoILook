Template.signUp.events({
	'submit form' : function(e){
		var email,
			password,
			videoId;

		e.preventDefault();

		email = document.getElementById('registrationEmail').value;
		password = document.getElementById('registrationPassword').value;
		videoId = document.getElementById('urlId').value;

		console.log(email,password,videoId);

		Accounts.createUser({
			email: email,
			password: password,
			profile: {
				videoId: videoId
			}
		},function(err){
			if (typeof err === 'undefined'){
				// Success
				console.log('User created');
			} else {
				// Error
				console.log('Error',err);				
			}
		});
	}
});

Template.signUp.helpers({
	'getUrlId': function(){
		return Router.current().params.urlId;
	}
});
