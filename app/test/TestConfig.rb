#!/usr/bin/env ruby

require_relative '../config'
require "test/unit"

class TestConfig < Test::Unit::TestCase

  def test_config
    assert_not_nil($config)
    assert_not_nil($config[:secret_key])
  end
end
