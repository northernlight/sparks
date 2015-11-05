var app = null;

(function(document) {
  'use strict';

  app = document.querySelector('#app');
  app.users = {};
  app.me = {
    'name': 'anonymous',
    'img': '/images/fruit-icons/1.png'
  };
  app.usersCount = 0;
  app.joinURL = document.URL;


  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
    run();
    app.msnry = new Masonry('#videos', {
      // options
      itemSelector: '.video',
      columnWidth: '.spacer',
      gutter: 10
    });
  });

  app.onButtonLeaveClick = function() {
    window.location.assign("/");
  };

  app.showMessage = function(msg) {
    var toast = document.querySelector('#toast');
    toast.set('text', msg);
    toast.show();
  }

  /**
    *
    */
  app.onMessage = function(msg) {
    switch(msg.type) {
      case 'MsgChat':
        app.showMessage("<" + msg.from.name + "> " + msg.message);
        break;
      case 'MsgNewUser':
        break;
      case 'MsgJoin':
        app.showMessage("User " + msg.user.name + " joined");
        break;
      case 'MsgLeave':
        app.showMessage("User " + msg.user.name + " left")
        // CAUTION: FALLTROUGH
      case 'MsgAnswer': // CAUTION: FALLTROUGH
      case 'MsgUpdate': // CAUTION: FALLTROUGH
      case 'MsgLeave': // CAUTION: FALLTROUGH
      case 'MsgOffer':
        app.usersCount = _.keys(app.users).length;
        if(app.usersCount == 1) {
          document.getElementById("content").scrollIntoView();
        }
        app.$.peerList.set("peers", _.map(_.values(app.users), function(user) {
          return user.getInfo();
        }));
        break;
    }
  }

  app.addStream = function(event) {
    var vid = document.createElement("video");
    vid.setAttribute("id", this.id);
    vid.setAttribute("autoplay", true);
    vid.src = window.URL.createObjectURL(event.stream);
    vid.innerHTML = "Video not available";
    vid.classList.add('video');
    document.getElementById("videos").appendChild(vid);
    vid.onloadedmetadata = function(e) {
      vid.play();
    };

    // magic layout
    var videos = document.getElementsByClassName("video");
    _.forEach(videos, function(video) {
      if(((videos.length-1) % 2) == 0) {
        video.classList.add("x2");
      } else {
        video.classList.remove("x2");
      }
    });

    app.msnry.appended(vid);
    app.msnry.layout();
  }

  app.addEventListener('me-changed', function(e) {
    var msg = JSON.stringify({
      type: "MsgUpdate",
      object: app.me
    });
    this.sendMessage(msg);
  });
})(document);

function copy(event, callback) {
  event.srcElement.select();
  try {
    document.execCommand('copy');
    callback(event);
  } catch (err) {
  }
};

function copiedSessionID(event) {
  app.showMessage("Copied to clipboard!");
  app.$.share.close();
}
