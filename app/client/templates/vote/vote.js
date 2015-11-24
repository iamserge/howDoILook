Template['Vote'].helpers({
	'getLookId': function(){
		return Router.current().params.lookId;
	}
});

Template['Vote'].events({
	'click #yes': function(e) {
	    Meteor.call('addYesVoteToLook', Router.current().params.lookId, function(error, result) {
	    	if (error) return alert(error)
	    	alert('yes vote added');
	    })
	},

	'click #no': function(e) {
	 	Meteor.call('addNoVoteToLook', Router.current().params.lookId, function(error, result) {
	 		if (error) return alert(error)
	    	alert('No vote added');
	    });
	}
});
