#!/usr/bin/env ruby

require_relative 'Msg'

class MsgICE < Msg
  attr_accessor :from, :to, :candidate

  def fields
    ['@from', '@to', '@candidate']
  end
end
