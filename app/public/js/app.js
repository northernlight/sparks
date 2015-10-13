(function(document) {
// == Step 0: define error handler and global variables == //
errorHandler = function(trace) {
  return function(msg) {
    throw new Error("error in " + trace + ": " + msg);
  }
};

rtcSessions = {};

run = function() {
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
      app.sendMessage = function(msg) {
        socket.send(msg);
      }.bind(socket);
    };
    socket.onmessage = function (event) {
      console.log(event.data);
      var msg = JSON.parse(event.data);
      switch(msg.type) {
        case 'MsgPing':
          // pong
          break;
        case 'MsgNewUser':
          app.set("me", msg.user);
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
              'from': app.me,
              'to': msg.user,
              'candidate': event.candidate.toJSON()
            });
            socket.send(msgICE);
          };
          rtcConnection.addStream(stream);
          rtcConnection.createOffer(function(offer) {
            var msgOffer = JSON.stringify({
              'type': 'MsgOffer',
              'from': app.me,
              'to': msg.user,
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
              'from': app.me,
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
              'from': app.me,
              'to': msg.from,
              'answer': answer.toJSON()
            });
            socket.send(msgAnswer);
          });
          app.users[msg.from.id] = msg.from;
          rtcSessions[msg.from.id] = rtcConnection;
          break;
        case 'MsgAnswer':
          if (msg.to.id != app.me.id) {
            errorHandler("socket.onMessage")("received foreign MsgAnswer (this should never happen)");
          } else {
            app.users[msg.from.id] = msg.from;
            rtcSessions[msg.from.id].receiveAnswer(msg.answer);
          }
          break;
        case 'MsgICE':
          if (msg.to.id != app.me.id) {
            errorHandler("socket.onMessage")("received foreign MsgICE (this should never happen)");
          } else {
            rtcSessions[msg.from.id].addIceCandidate(msg.candidate);
          }
          break;
        case 'MsgUpdate':
          switch(msg.object.type) {
            case 'User':
              if(app.me.id == msg.object.id) {
                app.set("me", msg.object);
              } else {
                app.users[msg.object.id] = msg.object;
              }
              break;
            default:
              errorHandler("socket.onMessage")("no such object type: " + msg.object.type);
              break;
          }
          break;
        case 'MsgLeave':
          delete app.users[msg.user.id];
          delete rtcSessions[msg.user.id];
          var video = document.getElementById(msg.user.id);
          video.parentNode.removeChild(video);
          break;
        default:
          errorHandler("socket.onMessage")("no such message type: " + msg.type);
          break;
      }
      app.onMessage(msg);
    };
  }, errorHandler("getUserMedia"));
};
})(document);
