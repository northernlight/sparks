// == Step 0: define error handler and global variables == //
errorHandler = function(trace) {
  return function(msg) {
    throw new Error("error in " + trace + ": " + msg);
  }
};

var self = null;
var rtcSessions = {};

(function() {
  'use strict';
  // == Step 1: setup local video stream == //
  navigator.getUserMedia({audio: false, video: true}, function(stream) {
    var video = document.getElementById("localVideo");
    video.src = window.URL.createObjectURL(stream);

    video.onloadedmetadata = function(e) {
      video.play();
    };

    // == Step 2: establish 2-way signaling channel to server == //
    var socket = new WebSocket("ws://" + window.location.host + window.location.pathname);
    socket.onopen = function (event) {
      console.log("websocket established");
    };
    socket.onmessage = function (event) {
      console.log(event.data);
      var msg = JSON.parse(event.data);
      switch(msg.type) {
        case 'MsgPing':
          // pong
          break;
        case 'MsgNewUser':
          self = msg.user;
          // currently we send out the offer regardless of user count
          if(msg.users_count > 1) {
            // send offer - not.
          } else {
            // first one!
            // alone :( wait for offer
          }
          break;
        case 'MsgJoin':
          var rtcConnection = new RTCAbstraction();
          rtcConnection.onaddstream = function(obj) {
            console.log("onaddstream()");
            var vid = document.createElement("video");
            vid.setAttribute("id", msg.user.id);
            vid.setAttribute("autoplay", true);
            document.getElementById("videos").appendChild(vid);
            vid.src = URL.createObjectURL(obj.stream);
            vid.onloadedmetadata = function(e) {
              vid.play();
            };
          };
          rtcConnection.onicecandidate = function(event) {
            var msgICE = JSON.stringify({
              'type': 'MsgICE',
              'from': self.id,
              'to': msg.user.id,
              'candidate': event.candidate.toJSON()
            });
            socket.send(msgICE);
          };
          rtcConnection.addStream(stream);
          rtcConnection.createOffer(function(offer) {
            var msgOffer = JSON.stringify({
              'type': 'MsgOffer',
              'from': self.id,
              'to': msg.user.id,
              'offer': offer.toJSON()
            });
            socket.send(msgOffer);
          });
          rtcSessions[msg.user.id] = rtcConnection;
          break;
        case 'MsgOffer':
          var rtcConnection = new RTCAbstraction();
          rtcConnection.onaddstream = function(obj) {
            console.log("onaddstream()");
            var vid = document.createElement("video");
            vid.setAttribute("id", msg.from);
            vid.setAttribute("autoplay", true);
            document.getElementById("videos").appendChild(vid);
            vid.src = URL.createObjectURL(obj.stream);
            vid.onloadedmetadata = function(e) {
              vid.play();
            };
          };
          rtcConnection.onicecandidate = function(event) {
            var msgICE = JSON.stringify({
              'type': 'MsgICE',
              'from': self.id,
              'to': msg.from,
              'candidate': event.candidate.toJSON()
            });
            socket.send(msgICE);
          };
          rtcConnection.addStream(stream);
          rtcConnection.receiveOffer(msg.offer);
          rtcConnection.createAnswer(function(answer) {
            var msgAnswer = JSON.stringify({
              'type': 'MsgAnswer',
              'from': self.id,
              'to': msg.from,
              'answer': answer.toJSON()
            });
            socket.send(msgAnswer);
          });
          rtcSessions[msg.from] = rtcConnection;
          break;
        case 'MsgAnswer':
          if (msg.to != self.id) {
            errorHandler("socket.onMessage")("received foreign MsgAnswer (this should never happen)");
          } else {
            rtcSessions[msg.from].receiveAnswer(msg.answer);
          }
          break;
        case 'MsgICE':
          if (msg.to != self.id) {
            errorHandler("socket.onMessage")("received foreign MsgICE (this should never happen)");
          } else {
            rtcSessions[msg.from].addIceCandidate(msg.candidate);
          }
          break;
        default:
          errorHandler("socket.onMessage")("no such message type: " + msg.type);
          break;
      }
      app.onMessage(msg);
    };
  }, errorHandler("getUserMedia"));
})();
