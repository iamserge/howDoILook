Meteor.publish('getLookById', function (_id) {
	check(_id, String);
  	return looks.find({_id: _id});
});


Meteor.publish('getVideoById', function (_id) {
	check(_id, String);
  	return Videos.find({_id: _id});
});
