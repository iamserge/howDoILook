Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});


Router.route('/', function () {

	this.render('Home');

});

Router.route('/vote/:lookId', function () {
	this.render('Vote');
}, {
	name: 'votePage',
	waitOn: function(){
		return Meteor.subscribe('getLookById', this.params.lookId);
	}
});
