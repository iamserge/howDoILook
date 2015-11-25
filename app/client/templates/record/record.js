

Template.Record.rendered = function () {
   
	var player = videojs("myVideo",
		{
		    controls: true,
		    width: 320,
		    height: 240,
		    controlBar: {
		        volumeMenuButton: false
		    },
		    plugins: {
		        record: {
		            audio: false,
		            video: true,
		            maxLength: 5
		        }
		    }
		}),
		displayVideo = function (vid){

		    var video = document.getElementById("recordedVideo");
		    video.src = window.URL.createObjectURL(vid);
		    $('#buttons').show();
		    $('#myVideo').hide();

		},
		generateQRCode = function(id){
			var qr = new QRCode("qrCode", {
				    text: "/signIn/" + id,
				    width: 256,
				    height: 256,
				    colorDark : "#000000",
				    colorLight : "#ffffff",
				    correctLevel : QRCode.CorrectLevel.H
				});

			$('#recordedVideo').hide();
			$('#buttons').hide();

		},
		pushToDatabase = function(){
			Videos.insert(player.recordedData,function(err, fileObj){

		    	console.log(fileObj);
		    	
		    	$('#recordedVideo').show();
		    	if (err) { console.log(err); return; }
		    	generateQRCode(fileObj._id);
		    	console.log(fileObj);
		    });
		},
		talk =function(message) {
			var msg = new SpeechSynthesisUtterance(message);
			var voices = window.speechSynthesis.getVoices();
			msg.voice = voices[2];
			window.speechSynthesis.speak(msg);
		}
		
	// error handling
	player.on('deviceError', function()
	{
	    console.warn('device error:', player.deviceErrorCode);
	});
	// user clicked the record button and started recording
	player.on('startRecord', function()
	{
	    console.log('started recording!');
	});
	// user completed recording and stream is available
	player.on('finishRecord', function()
	{
	    // the blob object contains the recorded data that
	    // can be downloaded by the user, stored on server etc.
	   
	    console.log('finished recording: ', player.recordedData);
	    displayVideo(player.recordedData);
	});

	$('#yes').on('click',function (e){
		e.preventDefault();
		pushToDatabase()
	})
	$('#no').on('click',function (e){
		e.preventDefault();
		$('#recordedVideo').hide();
		$('#buttons').hide();
		$('#myVideo').show();
	})
	

};


Template.Record.helpers({
	
});

Template.Record.events({
	
});
