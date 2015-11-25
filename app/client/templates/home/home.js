var newLookId = false,
	newLookDeps = new Tracker.Dependency,
	yesNoChart,
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

		var ctx = document.getElementById("yesNoChart").getContext("2d"),
			data = {
				labels: ["Yes", "No"],
				datasets: [ 
					{
						label: "Votes for your look",
						fillColor: "rgba(220,220,220,0.5)",
			            strokeColor: "rgba(220,220,220,0.8)",
			            highlightFill: "rgba(220,220,220,0.75)",
			            highlightStroke: "rgba(220,220,220,1)",
			            data: [0, 0]
					}
				]
			},
			options = {
				animation : false,
			    //Boolean - If we want to override with a hard coded scale
			    scaleOverride : true,
			    //** Required if scaleOverride is true **
			    //Number - The number of steps in a hard coded scale
			    scaleSteps : 20,
			    //Number - The value jump in the hard coded scale
			    scaleStepWidth : 1,
			    //Number - The scale starting value
			    scaleStartValue : 0
			};


		yesNoChart = new Chart(ctx).Bar(data, options);
	},
	updateChart = function(newValues){
		console.log(newValues.yesVotes||newValues.noVotes);
		var votesKey = (typeof newValues.yesVotes != 'undefined') ? 'yesVotes' : 'noVotes',
			value = newValues[votesKey],
			$votesCircle = $('.' + votesKey);
			
	
		$votesCircle.text(value);
		$votesCircle.css('height', value * 10).css('width', value * 10);
	}

Template.Home.rendered = function(){
	console.log('changed template');
}
Template.Home.helpers({
	'newLook' : function(){
		newLookDeps.depend();
		return looks.findOne({_id: newLookId});
	},


});

Template.Home.events({
	'click #newLook': function(e) {
	    e.preventDefault();

	    //Adding to the Database
	    Meteor.call('generateNewLook', {}, genereateNewLookUI);
	}
});
