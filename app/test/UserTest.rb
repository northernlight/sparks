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
    assert_equal(user.to_s, user.to_str)
    assert_equal(user.to_str, user.to_json)
  end
end
