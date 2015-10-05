#!/usr/bin/env ruby

require_relative 'Msg'

class MsgAnswer < Msg
  attr_reader :from, :to, :answer

  def fields
    ['@from', '@to', '@answer']
  end
end
