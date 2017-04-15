// Simple program for taking in json reviews and forwarding them to a slack channel. 
//To test send the review to http POST 52.88.163.114:1337/jsonpost userName=Test callId=123 rating=5 comment=Review

var Hapi = require('hapi');
var Slack = require('slack-node');


var server = new Hapi.Server();
server.connection({
    port: 1337
});

exports.add = function(i, j) {
    return i + j;
};

//  Slack function for sending the review
function slackReviewBot(username, callId, rating, comment) {
    userName = username;
    callId = callId;
    rating = rating;
    comment = comment;
    
    var webhook_url = 'https://hooks.slack.com/services/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    slack = new Slack();
    slack.setWebhook(webhook_url);
    
    if(rating === "5"){
        slack.webhook({
        channel: "#reviews",
        username: "Review:",
        icon_emoji: "http://www.wonderfulwebsites.ie/phorest-logo.png",
        text: ":star: :star: :star: :star: :star:" + "\n" + 
            "userId: " + userName + "\n" + 
            "Call Number: " + callId + "\n" + 
            "Rating: " + rating + "\n" + 
            "Comment: " + comment

        }, function(err, response) {
            
        console.log(response);
        });
    }
    else{
          slack.webhook({
        channel: "#reviews",
        username: "Review:",
        icon_emoji: "http://www.wonderfulwebsites.ie/phorest-logo.png",
        text:
            "Salon: " + userName + "\n" + 
            "Call Number: " + callId + "\n" + 
            "Rating: " + rating + "\n" + 
            "Comment: " + comment

        }, function(err, response) {
        console.log(response);
              return true;
        });
    }
   
}



server.route({
  method: 'POST'
, path: '/jsonpost',
handler: function(req, reply) {
//    Takes in the review 
     var review = {
      userName: req.payload.userName, 
        callId: req.payload.callId,
        rating: req.payload.rating,
        comment: req.payload.comment
      }
     
        // checks if any of the items are undefined 
        if ( typeof review.userName === 'undefined' || typeof review.callId === 'undefined' || typeof review.rating === 'undefined' || typeof review.comment === 'undefined') {
            reply("There is an issue with the json object, one or more items are undefined");
        }
        else{
            //passes the review to the slackbot function 
            slackReviewBot(review.userName, review.callId, review.rating, review.comment);
            reply("Received");
        }
    } 
});


server.route({
  method: 'POST'
, path: '/serverdown',
handler: function(req, reply) {
//    Takes in the review 
     var review = {
      serverName: req.payload.serverName, 
        timeId: req.payload.timeId,
        comment: req.payload.comment
      }
     
       
            //passes the message to the slackbot function 
            slackServerBot(review.serverName, review.timeId, review.comment);
            reply("Received");
    } 
});

server.start(function(){
    console.log('server running at: ', server.info.url);
});



