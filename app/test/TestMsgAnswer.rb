#!/usr/bin/env ruby

require_relative '../src/Msg'
require_relative '../src/User'
require "test/unit"

class TestMsgAnswer < Test::Unit::TestCase

  def test_constructor
    assert_nothing_raised do
      msg = MsgAnswer.new
    end
  end

  def test_deserialize
    msg = MsgAnswer.new
    msg.from_json! '{"type":"MsgAnswer","from":"cBZvw0ItBSOqktu9FlHStg","to":"g8oDjEr6xAWsMzqyXFSB2A","answer":{"type":"answer","sdp":"v=0\r\no=- 519703548559000626 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE video\r\na=msid-semantic: WMS 8iIdsjkzoRCpGoVuAdqELh9CIqzEbsDiBkhd\r\nm=video 9 RTP/SAVPF 100 116 117 96\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:85zSwskAFdt47um4\r\na=ice-pwd:ShOUxebFj7r8YtZh5BD3XkiB\r\na=fingerprint:sha-256 FC:66:DF:B2:BF:B3:47:62:17:B3:8B:B9:D8:74:78:83:85:C2:1F:2F:3B:5F:3F:EF:6D:F5:1B:4E:22:F5:85:C4\r\na=setup:active\r\na=mid:video\r\na=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:4 urn:3gpp:video-orientation\r\na=sendrecv\r\na=rtcp-mux\r\na=rtpmap:100 VP8/90000\r\na=rtcp-fb:100 ccm fir\r\na=rtcp-fb:100 nack\r\na=rtcp-fb:100 nack pli\r\na=rtcp-fb:100 goog-remb\r\na=rtpmap:116 red/90000\r\na=rtpmap:117 ulpfec/90000\r\na=rtpmap:96 rtx/90000\r\na=fmtp:96 apt=100\r\na=ssrc-group:FID 852120278 2914411500\r\na=ssrc:852120278 cname:dsycTlxuqwphCU8r\r\na=ssrc:852120278 msid:8iIdsjkzoRCpGoVuAdqELh9CIqzEbsDiBkhd c76c85eb-72fc-4c2a-9649-ef8dd0661928\r\na=ssrc:852120278 mslabel:8iIdsjkzoRCpGoVuAdqELh9CIqzEbsDiBkhd\r\na=ssrc:852120278 label:c76c85eb-72fc-4c2a-9649-ef8dd0661928\r\na=ssrc:2914411500 cname:dsycTlxuqwphCU8r\r\na=ssrc:2914411500 msid:8iIdsjkzoRCpGoVuAdqELh9CIqzEbsDiBkhd c76c85eb-72fc-4c2a-9649-ef8dd0661928\r\na=ssrc:2914411500 mslabel:8iIdsjkzoRCpGoVuAdqELh9CIqzEbsDiBkhd\r\na=ssrc:2914411500 label:c76c85eb-72fc-4c2a-9649-ef8dd0661928\r\n"}}'

    assert_equal(msg.from, 'cBZvw0ItBSOqktu9FlHStg')
    assert_equal(msg.to, 'g8oDjEr6xAWsMzqyXFSB2A')
  end
end
