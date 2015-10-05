#!/usr/bin/env ruby

require_relative 'Msg'

class MsgICE < Msg
  attr_reader :from, :candidate

  def fields
    ['@from', '@candidate']
  end
end
