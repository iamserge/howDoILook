Template.video.rendered = function(){
	var videoId = Router.current().params.videoId;


	var videoElem = document.getElementById('mainVideo'),
		videoBlob = Videos.findOne({_id: videoId});
// console.log(videoBlob);
	videoElem.src = window.URL.createObjectURL(videoBlob.data.blob);
// console.log('b');
};

		    // var video = document.getElementById("recordedVideo");
		    // video.src = window.URL.createObjectURL(vid);
