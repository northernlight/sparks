var app = null;

(function(document) {
  'use strict';

  app = document.querySelector('#app');


  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  /**
    *
    */
  app.onMessage = function(msg) {
    switch(msg.type) {
      case 'MsgAnswer': // CAUTION: FALLTROUGH
      case 'MsgOffer':
        var identities = [
          {name: "Hazelnut", img: "/images/fruit-icons/1.png", starred:false},
          {name: "Mango", img: "/images/fruit-icons/2.png", starred:false},
          {name: "TheFuckIsThis", img: "/images/fruit-icons/3.png", starred:false},
          {name: "Cantaloupe", img: "/images/fruit-icons/4.png", starred:false},
          {name: "White Grape", img: "/images/fruit-icons/5.png", starred:false},
          {name: "Coconut", img: "/images/fruit-icons/6.png", starred:false},
          {name: "Blackberry", img: "/images/fruit-icons/7.png", starred:false},
          {name: "Banana", img: "/images/fruit-icons/8.png", starred:false},
          {name: "Papaya", img: "/images/fruit-icons/9.png", starred:false},
          {name: "Apricot", img: "/images/fruit-icons/10.png", starred:false},
          {name: "Water Melon", img: "/images/fruit-icons/11.png", starred:false},
          {name: "Yellow Pear", img: "/images/fruit-icons/12.png", starred:false},
          {name: "Plum", img: "/images/fruit-icons/13.png", starred:false},
          {name: "Red Apple", img: "/images/fruit-icons/14.png", starred:false},
          {name: "Cherry", img: "/images/fruit-icons/15.png", starred:false},
          {name: "TheFuckIsThat", img: "/images/fruit-icons/16.png", starred:false},
          {name: "Peach", img: "/images/fruit-icons/17.png", starred:false},
          {name: "Green Pear", img: "/images/fruit-icons/18.png", starred:false},
          {name: "Blue Grape", img: "/images/fruit-icons/19.png", starred:false},
          {name: "Pomegranate", img: "/images/fruit-icons/20.png", starred:false},
          {name: "Nectarine", img: "/images/fruit-icons/21.png", starred:false},
          {name: "Yellow Apple", img: "/images/fruit-icons/22.png", starred:false},
          {name: "Pineapple", img: "/images/fruit-icons/23.png", starred:false},
          {name: "Strawberry", img: "/images/fruit-icons/24.png", starred:false}
        ];
        var identity = null;
        do {
          var identity = identities[Math.floor(Math.random() * identities.length)];
        } while(this.$.peerList.hasPeer(identity));
        identity["id"] = msg.from;
        this.$.peerList.addPeer(identity);
        break;
    }
  }

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

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onDataRouteClick = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    document.getElementById('mainContainer').scrollTop = 0;
  };
})(document);
