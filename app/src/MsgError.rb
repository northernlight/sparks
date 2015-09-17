#!/usr/bin/env ruby

require_relative 'Msg'

class MsgError < Msg
  attr_reader :message

  def initialize(message)
    @message = message
  end
end
