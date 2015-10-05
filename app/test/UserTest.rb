#!/usr/bin/env ruby

require_relative '../src/User'
require "test/unit"

class TestUser < Test::Unit::TestCase

  def test_constructor
    user = User.new(nil)
    assert_not_nil(user.id)

    user = User.new(Object.new)
    assert_not_nil(user.session)
  end

  def test_serialize
    user = User.new(Object.new)
    assert_nothing_raised do user.to_json end
  end

  def test_deserialize
    user1 = User.new(Object.new)
    user2 = User.new(Object.new)
    user2.from_json!(user1.to_json)

    assert_equal(user1.id, user2.id)
  end
end
