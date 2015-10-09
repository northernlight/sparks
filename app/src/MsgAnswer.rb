#!/usr/bin/env ruby

require_relative 'Msg'

class MsgAnswer < Msg
  attr_accessor :from, :to, :answer

  def fields
    ['@from', '@to', '@answer']
  end
end
