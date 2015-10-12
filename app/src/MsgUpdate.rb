#!/usr/bin/env ruby

require_relative 'Msg'

class MsgUpdate < Msg
  attr_reader :object

  def initialize(object)
    @object = object
  end
end
