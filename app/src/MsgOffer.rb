#!/usr/bin/env ruby

require_relative 'Msg'

class MsgOffer < Msg
  attr_reader :from, :to, :offer

  def fields
    ['@from', '@to', '@offer']
  end
end
