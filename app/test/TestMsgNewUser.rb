#!/usr/bin/env ruby

require_relative '../src/Msg'
require_relative '../src/User'
require "test/unit"

class TestMsgNewUser < Test::Unit::TestCase

  def test_constructor
    assert_nothing_raised do
      msg = MsgNewUser.new(nil)
    end
  end

  def test_serialize
    msg = MsgNewUser.new(User.new(nil, 'User'))
    assert_equal(msg.to_json, '{"type":"MsgNewUser","user":{"id":"User"},"users_count":0}')
  end

  def test_deserialize
    msg1 = MsgNewUser.new(User.new(nil, 'User1'))
    msg2 = MsgNewUser.new(User.new(nil, 'User2'))
    msg2.from_json!(msg1.to_json)

    assert_equal(msg1.to_json, msg2.to_json)
  end
end
