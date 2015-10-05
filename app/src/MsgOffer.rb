#!/usr/bin/env ruby

require_relative 'Msg'

class MsgOffer < Msg
  attr_reader :from, :offer
  
  def fields
    ['@from', '@offer']
  end
end
