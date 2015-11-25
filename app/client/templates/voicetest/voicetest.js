var lookId,
	look,
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
		var barToUpdate = (typeof newValues.yesVotes != 'undefined') ? 0 : 1;
		yesNoChart.datasets[0].bars[barToUpdate].value = newValues[(barToUpdate == 0)? 'yesVotes' : 'noVotes'];
	}


var goToStreamingPage = function(e) {
    if (e) e.preventDefault();

    //Adding to the Database
    Meteor.call('generateNewLook', {}, genereateNewLookUI);
};

Template.voicetest.rendered = function () {
		var micBtn = document.getElementById("microphone");
		var errors = 0;
   	    var mic = new Wit.Microphone(micBtn);
	      var info = function (msg) {
	        document.getElementById("info").innerHTML = msg;
	      };
	      var error = function (msg) {
	        document.getElementById("error").innerHTML = msg;
	      };
	      mic.onready = function () {
	        info("Microphone is ready to record");
	      };
	      mic.onaudiostart = function () {
	        info("Recording started");
	        error("");
	        setTimeout(function(){
	        	mic.stop();
	        },4000);
	      };
	      mic.onaudioend = function () {
	        info("Recording stopped, processing started");
	      };
	      mic.onresult = function (intent, entities) {
	        
	        if (intent && entities) {
		        var r = kv("intent", intent);
		        var timesAsked = 0;

		        for (var k in entities) {
		          var e = entities[k];

		          if (!(e instanceof Array)) {
		            r += kv(k, e.value);
		          } else {
		            for (var i = 0; i < e.length; i++) {
		              r += kv(k, e[i].value);
		            }
		          }
		        }

		        document.getElementById("result").innerHTML = r;
		        r = r.replace(/\s/g,'');
		    } else {
		    	r = undefined;
		    }

	        var voiceChoice = 2;
	        
	        switch (r) {
	        	case 'intent=how_do_I_look':
			        var firstResponseMsg = new SpeechSynthesisUtterance('I think you look great. Do you want to stream publicly on our site, stream privately to your friends, or record for later?');
					firstResponseMsg.voice = speechSynthesis.getVoices()[voiceChoice];
					speechSynthesis.speak(firstResponseMsg);
					setTimeout(function(){micBtn.click();}, 8000);
					break;
				case 'intent=stream_live':
					var streamLiveMsg = new SpeechSynthesisUtterance('Great, let\'s show everyone how good you look!');
					streamLiveMsg.voice = speechSynthesis.getVoices()[voiceChoice];
					speechSynthesis.speak(streamLiveMsg);
					setTimeout(function(){
						//alert('stream live: go to stream to public page');
						goToStreamingPage();
					}, 4000);
					break;
				case 'intent=stream_to_friends':
					var streamToFriendsMsg = new SpeechSynthesisUtterance('Okay, let\'s get a link for you to send to your friends.');
					streamToFriendsMsg.voice = speechSynthesis.getVoices()[voiceChoice];
					speechSynthesis.speak(streamToFriendsMsg);
					setTimeout(function(){
						//alert('stream to friends: go to stream to friends page');
						goToStreamingPage();
					}, 4000);
					break;
				case 'intent=record_for_later':
					var recordForLaterMsg = new SpeechSynthesisUtterance('Cool, let\'s record a video you can view or show people later');
					recordForLaterMsg.voice = speechSynthesis.getVoices()[voiceChoice];
					speechSynthesis.speak(recordForLaterMsg);
					setTimeout(function(){
						alert('record for later: go to record for later page');
					}, 4000);
					break;
				default:
					errors++;
			        if (errors < 2) {
			        	var unknownMsg = new SpeechSynthesisUtterance('Sorry, I didn\'t quite get that, please try again');
						unknownMsg.voice = speechSynthesis.getVoices()[voiceChoice];
						speechSynthesis.speak(unknownMsg);
			        	setTimeout(function(){micBtn.click();}, 4000);
			        };
					break;
			}

	      };
	      mic.onerror = function (err) {
	        error("Error: " + err);
	        errors++;
	        if (errors < 2) {
	        	mic.onresult();
	        };
	      };
	      mic.onconnecting = function () {
	        info("Microphone is connecting");
	      };
	      mic.ondisconnected = function () {
	        info("Microphone is not connected");
	      };

	      mic.connect("VRX3FXCSWBRPIYBUKW64UGCH76WEB4RS");
	      // mic.start();
	      // mic.stop();

	      function kv (k, v) {
	        if (toString.call(v) !== "[object String]") {
	          v = JSON.stringify(v);
	        }
	        return k + "=" + v + "\n";
	      }

};


Template.Vote.helpers({
	'getLookId': function(){
		return Router.current().params.lookId;
	}
});

Template.Home.events({
	'click #newLook': goToStreamingPage
});