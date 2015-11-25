Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});


Router.route('/', function () {

	this.render('Home');

});

Router.route('/record', function () {

	this.render('Record');

});

Router.route('/vote/:lookId', function () {
	this.render('Vote');
}, {
	name: 'votePage',
	waitOn: function(){
		return Meteor.subscribe('getLookById', this.params.lookId);
	}
});

Router.route('/signIn/:urlId', function () {
	this.render('SignIn');
});

Router.route('/signUp/:urlId', function () {
	this.render('SignUp');
});

Router.route('/myVideos/:userId', function () {
	var userId = Meteor.userId();

	// Make sure videos page belongs to the logged in user
	if (userId && userId === this.params.userId){
		this.render('myVideos');
	} else {
		this.render('accessDenied');
	}
},
{
	name : 'myVideos.show'
});
