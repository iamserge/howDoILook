var lookId,
	look;


Template.Vote.rendered = function () {
   	
   	lookId = Router.current().params.lookId;
	Meteor.subscribe('getLookById',lookId);
   	look = looks.findOne({_id: lookId});
  
   	bc.init({
		appId: Meteor.App.BISTRIID,
   		appKey: Meteor.App.BISTRIAPPKEY
	});

    bc.streams.bind( "onStreamAdded", function ( stream ) {
        bc.attachStream( stream, document.getElementById('myVideo') );
    });
    
    bc.streams.bind( "onStreamClosed", function ( stream ) {
        bc.detachStream( stream );
    });
  
    bc.signaling.bind( "onConnected", function () {
        bc.joinRoom( lookId, Meteor.App.PARTICIPANSAMOUNT );
    });
    
    bc.connect();

};


Template.Vote.helpers({
	'getLookId': function(){
		return Router.current().params.lookId;
	}
});

Template.Vote.events({
	'click #yes': function(e) {
	    Meteor.call('addYesVoteToLook', lookId, function(error, result) {
	    	if (error) return alert(error)
	    	
	    })
	},

	'click #no': function(e) {
	 	Meteor.call('addNoVoteToLook', lookId, function(error, result) {
	 		if (error) return alert(error)
	    	
	    });
	}
});
