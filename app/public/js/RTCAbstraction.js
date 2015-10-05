// TODO: fix pseudo doxygen
/**
  * RTCAbstraction
  * @callback onicecandidate(event)
  * @callback onaddstream()
  */
var RTCAbstraction = function() {
  // this.prototype.onicecandidate = null;
  // this.prototype.onaddstream = null;

  var errorHandler = function(trace) {
    return function(msg) {
      console.log("could not " + trace + ": " + msg);
    }
  };

  // == setup RTCPeerConnection and forward public api == //
  var peerConnection = this.rawConnection = new RTCPeerConnection();
  peerConnection.onaddstream = this.onaddstream;
  peerConnection.onicecandidate = function(event) {
    if(event.candidate && this.onicecandidate) {
      this.onicecandidate(event);
    }
  }.bind(this);
  this.addStream = peerConnection.addStream.bind(peerConnection);

  // == enrich with own api == //
  /**
    * createOffer(callback)
    * @param callback: Callback to be called at success
    * @return RTCSessionDescription
    */
  this.createOffer = function(callback) {
    peerConnection.createOffer(function(offer) {
      var sessionDescription = new RTCSessionDescription(offer);
      peerConnection.setLocalDescription(sessionDescription, function() {
        callback(sessionDescription);
      }, errorHandler("setLocalDescription"));
    }, errorHandler("createOffer"));
  };

  /**
    * receiveOffer(offer)
    * @param offer: RTCSessionDescription
    * @return void
    */
  this.receiveOffer = function(offer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer), function() {
      console.log('received remote offer');
    }, errorHandler("setRemoteDescription"));
  };

  /**
    * createAnswer()
    * must be called after receiveOffer - otherwise fail %(
    * @return RTCSessionDescription
    */
  this.createAnswer = function() {
    peerConnection.createAnswer(function(answer) {
      sessionDescription = new RTCSessionDescription(answer);
      peerConnection.setLocalDescription(sessionDescription, function() {
        return sessionDescription;
      }, errorHandler("setLocalDescription"));
    }, errorHandler("createAnswer"));
  };

  /**
    * receiveAnswer(answer)
    * must be called after createOffer - otherwise fail %(
    * @param answer: RTCSessionDescription
    * @return void
    */
  this.receiveAnswer = function(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer.sdp), function() {
      console.log('answer: remote connection established');
    }, errorHandler("setRemoteDescription"));
  };
};
