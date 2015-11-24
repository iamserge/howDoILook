Meteor.publish('getLookById', function (_id) {
	check(_id, String);
  	return looks.find({_id: _id});
});
