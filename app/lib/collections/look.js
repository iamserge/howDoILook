looks = new Mongo.Collection('looks', {
    schema: new SimpleSchema({
        lookId: {
            type: String
        },
        username: {
            type: String
        },
        yesVotes: {
            type: Number
        },
        noVotes: {
             type: Number
        }
    })
});


if (Meteor.isServer) {
    Meteor.methods({
        generateNewLook: function() {
            var look = {
                username: 'anonymous',
                yesVotes: 0,
                noVotes: 0
            };
         
            var lookId = looks.insert(look);
            return {
                _id: lookId
            };
        },

        addYesVoteToLook: function(_id) {
            console.log(_id);
            check(_id, String);
            looks.update({_id: _id},{'$inc': {'yesVotes' : 1}});
            return {
                _id:_id
            }
        },

        addNoVoteToLook: function(_id){
            check(_id, String);
            looks.update({_id: _id},{'$inc': {'noVotes' : 1}});
            return {
                _id:_id
            }
        }
    });
}
