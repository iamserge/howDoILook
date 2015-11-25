var newLookId = false,
	newLookDeps = new Tracker.Dependency,
	yesNoChart,
	faceDetected = false,
	startTranslation = function(){
		
		var localStream;
		
		bc.init( {
		    appId: Meteor.App.BISTRIID,
		   	appKey: Meteor.App.BISTRIAPPKEY
		});

		bc.signaling.bind( "onJoinedRoom", function ( data ) {
		    var members = data.members;
		    bc.startStream( Meteor.App.VIDEORES, function( stream ){
		        localStream = stream;
		        bc.attachStream( localStream, document.getElementById('myVideo'), { "mirror": true } );

		        members.forEach( function( member ){
		            bc.call( member.id, data.room, { "sendonly": true, "stream": localStream });
		        })
		        videoTracking();
		    });
		});
		
		bc.signaling.bind( "onPeerJoinedRoom", function ( member ) {
		    bc.call( member.pid, member.room, { "sendonly": true, "stream": localStream } );
		});
		
		bc.signaling.bind( "onConnected", function () {
		    bc.joinRoom( newLookId,  Meteor.App.PARTICIPANSAMOUNT );
		});
		
		bc.connect();



	},
	videoTracking = function(){
		var tracker = new tracking.ObjectTracker('face'),
			trackingTask;	
		tracker.setInitialScale(4);
		tracker.setStepSize(2);
		tracker.setEdgesDensity(0.1);
	  	trackingTask = tracking.track('#detectionVideo', tracker, { camera: true });	
	  	tracker.on('track', function(event) {
		    event.data.forEach(function(rect) {
		    	if (!faceDetected) {
		    		trackingTask.stop();

			    	Meteor.call('generateNewLook', {}, genereateNewLookUI);
			    	console.log('face detected');
			    	faceDetected = true;
		    	}
		     	
		     	
		     	
		    });
	  	});

	  	

	  	
	},
	genereateNewLookUI = function(error, result) {
    	newLookId = result._id;
		Meteor.subscribe('getLookById',newLookId);
      		
	

		//subsribe for update function
		looks.find().observeChanges({
		   changed: function (id, fields) {
		       if (id == newLookId) updateChart(fields);
		   }
		});
    	newLookDeps.changed();
    	startTranslation();
    	setTimeout(generateChart, 100)
    	
	},

	generateChart = function(){
		
	},
	updateChart = function(newValues){

		console.log(newValues);
		var barToUpdate = (typeof newValues.yesVotes != 'undefined') ? 0 : 1;
		yesNoChart.datasets[0].bars[barToUpdate].value = newValues[(barToUpdate == 0)? 'yesVotes' : 'noVotes'];

	}

Template.Home.rendered = function(){
	videoTracking();
	console.log('rendered');
}
Template.Home.helpers({
	'newLook' : function(){
		newLookDeps.depend();
		return looks.findOne({_id: newLookId});
	}


});

Template.Home.events({
	'click #newLook': function(e) {
	    e.preventDefault();

	    //Adding to the Database
	    Meteor.call('generateNewLook', {}, genereateNewLookUI);
	}
});
