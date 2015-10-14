var app = null;

(function(document) {
  'use strict';

  app = document.querySelector('#app');
  app.users = {};
  app.me = {
    'name': 'anonymous',
    'img': '/images/fruit-icons/1.png'
  };

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

  /**
    *
    */
  app.onMessage = function(msg) {
    switch(msg.type) {
      case 'MsgNewUser':
        break;
      case 'MsgJoin':
        var toast = document.querySelector('#toast');
        toast.set('text', "User " + msg.user.name + " joined");
        toast.show();
        break;
      case 'MsgLeave':
        var toast = document.querySelector('#toast');
        toast.set('text', "User " + msg.user.name + " left");
        toast.show();
        // CAUTION: FALLTROUGH
      case 'MsgAnswer': // CAUTION: FALLTROUGH
      case 'MsgUpdate': // CAUTION: FALLTROUGH
      case 'MsgLeave': // CAUTION: FALLTROUGH
      case 'MsgOffer':
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


  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  addEventListener('paper-header-transform', function(e) {
    var appName = document.querySelector('#mainToolbar .app-name');
    var middleContainer = document.querySelector('#mainToolbar .middle-container');
    var bottomContainer = document.querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    var maxMiddleScale = 0.50;  // appName max size when condensed. The smaller the number the smaller the condensed size.
    var scaleMiddle = Math.max(maxMiddleScale, (heightDiff - detail.y) / (heightDiff / (1-maxMiddleScale))  + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    document.getElementById('mainContainer').scrollTop = 0;
  };
})(document);
