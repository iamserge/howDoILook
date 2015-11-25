// Define App Constants

if (Meteor.App) {
  throw new Meteor.Error('Meteor.App already defined? see client/lib/constants.js');
}

Meteor.App = {
  	NAME: 'How do I look',
  	DESCRIPTION: 'Hackathon for Salmon',
  	BISTRIID: "e5b8ec14",
    BISTRIAPPKEY: "4105fa25f0cd5dcc4d49c14d356183d4",
    VIDEORES: "180x1040",
    PARTICIPANSAMOUNT: 4,
    SITEURL: 'http://localhost:3000/'

};
