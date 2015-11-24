var newLookId = false,
	newLookDeps = new Tracker.Dependency;


Template['Home'].helpers({
	'newLook' : function(){
		newLookDeps.depend();
		console.log(newLookId);
		return looks.findOne({_id: newLookId});
	}
});

Template['Home'].events({
	'click #newLook': function(e) {
	    e.preventDefault();
	    Meteor.call('generateNewLook', {}, function(error, result) {
	    	if (error)return alert(error.reason);
	    	newLookId = result._id;
	    	Meteor.subscribe('getLookById',newLookId);
	    	newLookDeps.changed();
	      	
	    });

	}
});
