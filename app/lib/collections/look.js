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
        peerId: {
            type: String
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
                peerId: '',
                yesVotes: 0,
                noVotes: 0
            };
         
            var lookId = looks.insert(look);
            return {
                _id: lookId
            };
        },
        updateLookPeerId: function(attributes){
            check(attributes._id, String);
            check(attributes.peerId, String);
            console.log(attributes.peerId);
            looks.update({_id: attributes._id},{ $set: {peerId: attributes.peerId}});
            return {
                _id: attributes._id
            }

        },
        addYesVoteToLook: function(_id) {
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
