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

			    	// start listening
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

var micBtn = document.getElementById("microphone");
var mic = new Wit.Microphone(micBtn);


Template.Home.rendered = function(){
	videoTracking();

	var errors = 0;
	var resetErrors = function() {
		errors = 0;
	};
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
        var streamVideo = function() {
        	// stream video
        };

        switch (r) {
        	case 'intent=how_do_I_look':
		        var firstResponseMsg = new SpeechSynthesisUtterance('I think you look great. Do you want to stream publicly on our site, stream privately to your friends, or record for later?');
				firstResponseMsg.voice = speechSynthesis.getVoices()[voiceChoice];
				speechSynthesis.speak(firstResponseMsg);
				resetErrors();
				setTimeout(function(){mic.start();}, 8000);
				break;
			case 'intent=stream_live':
				var streamLiveMsg = new SpeechSynthesisUtterance('Great, let\'s show everyone how good you look!');
				streamLiveMsg.voice = speechSynthesis.getVoices()[voiceChoice];
				speechSynthesis.speak(streamLiveMsg);
				resetErrors();
				setTimeout(function(){
					//alert('stream live: go to stream to public page');
					streamVideo();
				}, 4000);
				break;
			case 'intent=stream_to_friends':
				var streamToFriendsMsg = new SpeechSynthesisUtterance('Okay, let\'s get a link for you to send to your friends.');
				streamToFriendsMsg.voice = speechSynthesis.getVoices()[voiceChoice];
				speechSynthesis.speak(streamToFriendsMsg);
				resetErrors();
				setTimeout(function(){
					//alert('stream to friends: go to stream to friends page');
					streamVideo();
				}, 4000);
				break;
			case 'intent=record_for_later':
				var recordForLaterMsg = new SpeechSynthesisUtterance('Cool, let\'s record a video you can view or show people later');
				recordForLaterMsg.voice = speechSynthesis.getVoices()[voiceChoice];
				speechSynthesis.speak(recordForLaterMsg);
				resetErrors();
				setTimeout(function(){
					//alert('record for later: go to record for later page');
					window.location = 'localhost:3000/record';
				}, 4000);
				break;
			default:
				errors++;
		        if (errors < 2) {
		        	var unknownMsg = new SpeechSynthesisUtterance('Sorry, I didn\'t quite get that, please try again');
					unknownMsg.voice = speechSynthesis.getVoices()[voiceChoice];
					speechSynthesis.speak(unknownMsg);
		        	setTimeout(function(){mic.start();}, 4000);
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
	console.log('rendered');
};


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
	},
	'click #stream': function(e) {
	    e.preventDefault();
		var streamingConfirmation = document.getElementById('#streamingConfirmation');
		streamingConfirmation.innerHTML = 'You are now streaming!';	    
	},
	'click #record': function(e) {
	    e.preventDefault();

	    //Adding to the Database
	    window.location = 'localhost:3000/record';
	}/*,
	'click .home': function() {
		console.log('body clicked');
	    mic.start();
	}*/
});
