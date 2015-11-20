(function(document) {
// == Step 0: define error handler and global variables == //
errorHandler = function(trace) {
  return function(msg) {
    throw new Error("error in " + trace + ": " + msg);
  }
};

function User(user, callback) {
  this.setInfo(user);

  // instantiate PeerConnection
  this.connection = new PeerConnection();
  this.dataChannel = this.connection.createDataChannel("data");
  this.dataChannel.onmessage = function(msg) {
    console.log("p2p: " + msg);
    var msg = JSON.parse(msg.data);
    msg.from = this.getInfo();
    app.onMessage(msg);
  }.bind(this);
  this.connection.on('ice', function (candidate) {
    var msg = JSON.stringify({
      'type': 'MsgICE',
      'from': app.me,
      'to': this.getInfo(),
      'candidate': candidate
    });
    app.sendMessage(msg);
  }.bind(this));
  this.connection.on('offer', function (err, offer) {
    // STUB
  });
  this.connection.on('addStream', callback.bind(this));
  this.connection.on('addChannel', function(channel) {
    this.dataChannel = channel;
  }.bind(this));
}

User.prototype.connect = function() {
  // create and send offer
  this.connection.offer(function (err, offer) {
    if (!err) {
      var msg = JSON.stringify({
        type: 'MsgOffer',
        from: app.me,
        to: this.getInfo(),
        offer: offer
      });
      app.sendMessage(msg);
    } else {
      errorHandler('User.connect')('could not create offer');
    }
  }.bind(this));
};

User.prototype.addStream = function(stream) {
  this.connection.addStream(stream);
}

User.prototype.handleOffer = function(offer) {
  this.connection.handleOffer(offer, function (err) {
    if (err) {
      errorHandler("User.handleOffer", 'could not accept offer');
    } else {
      this.connection.answer(function (err, answer) {
        if (!err) {
          var msg = JSON.stringify({
            type: 'MsgAnswer',
            from: app.me,
            to: this.getInfo(),
            answer: answer
          });
          app.sendMessage(msg);
        } else {
          errorHandler("User.acceptOffer", 'could not create answer');
        }
      }.bind(this));
    }
  }.bind(this));
}

User.prototype.handleAnswer = function(answer) {
  this.connection.handleAnswer(answer, function (err) {
    if (err) {
      errorHandler("User.handleAnswer", 'could not accept answer');
    } else {
    }
  }.bind(this));
}

User.prototype.handleIce = function(candidate) {
  this.connection.processIce(candidate);
}

User.prototype.setInfo = function(info) {
  this.id = info.id;
  this.name = info.name;
  this.img = info.img;
}

User.prototype.getInfo = function() {
  return {
    id: this.id,
    name: this.name,
    img: this.img
  };
}


run = function() {
  'use strict';
  // == Step 1: setup local video stream == //
  navigator.getUserMedia({audio: true, video: true}, function(stream) {
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

      app.broadcast = function(msg) {
        _.forEach(_.values(app.users), function(user) { user.dataChannel.send(msg); });
      }
    };

    socket.onmessage = function (event) {
      console.log(event.data);
      var msg = JSON.parse(event.data);
      switch(msg.type) {
        case 'MsgNewUser':
          app.set("me", msg.user);
          break;
        case 'MsgJoin':
          var user = new User(msg.user, app.addStream);
          user.addStream(stream);
          app.users[user.id] = user;
          user.connect();
          break;
        case 'MsgOffer':
          if (msg.to.id != app.me.id) {
            errorHandler("socket.onMessage")("received foreign MsgOffer (this should never happen)");
          } else {
            var user = new User(msg.from, app.addStream);
            user.addStream(stream);
            app.users[user.id] = user;
            user.handleOffer(msg.offer);
          }
          break;
        case 'MsgAnswer':
          if (msg.to.id != app.me.id) {
            errorHandler("socket.onMessage")("received foreign MsgAnswer (this should never happen)");
          } else {
            var user = app.users[msg.from.id];
            user.handleAnswer(msg.answer);
          }
          break;
        case 'MsgICE':
          if (msg.to.id != app.me.id) {
            errorHandler("socket.onMessage")("received foreign MsgICE (this should never happen)");
          } else {
            var user = app.users[msg.from.id];
            user.handleIce(msg.candidate);
          }
          break;
        case 'MsgUpdate':
          switch(msg.object.type) {
            case 'User':
              if(app.me.id == msg.object.id) {
                app.set("me", msg.object);
              } else {
                var user = app.users[msg.object.id];
                user.setInfo(msg.object);
              }
              break;
            default:
              errorHandler("socket.onMessage")("no such object type: " + msg.object.type);
              break;
          }
          break;
        case 'MsgLeave':
          delete app.users[msg.user.id];
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
