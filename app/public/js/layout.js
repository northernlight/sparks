var app = null;

(function(document) {
  'use strict';

  app = document.querySelector('#app');

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  addEventListener('paper-header-transform', function(e) {
    var appName = document.querySelector('#mainToolbar .app-name');
    var toolbar = document.querySelector('#mainToolbar');
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

    Polymer.Base.toggleClass("condensed", yRatio > 0.5, document.querySelector('#mainToolbar'));
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    document.getElementById('mainContainer').scrollTop = 0;
  };
})(document);
