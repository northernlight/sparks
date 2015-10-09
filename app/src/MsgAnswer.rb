#!/usr/bin/env ruby

require_relative 'Msg'

class MsgAnswer < Msg
  attr_accessor :from, :to, :answer

  def fields
    # FIXME: see MsgOffer.rb
    ['@from', '@to', '@answer']
  end
end
