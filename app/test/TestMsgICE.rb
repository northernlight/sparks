#!/usr/bin/env ruby

require_relative '../src/Msg'
require_relative '../src/User'
require "test/unit"

class TestMsgICE < Test::Unit::TestCase

  def test_constructor
    assert_nothing_raised do
      msg = MsgICE.new
    end
  end

  def test_serialize
    msg = MsgICE.new
    assert_nothing_raised do
      msg.to_json
    end
  end

  def test_deserialize
    msg = MsgICE.new.from_json!('{"type":"MsgICE","from":"_yJ--UR8MN3sllC4XjaXMw","candidate":{}}')
    assert_equal(msg.from, "_yJ--UR8MN3sllC4XjaXMw")
  end
end
