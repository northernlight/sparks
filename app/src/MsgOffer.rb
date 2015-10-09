#!/usr/bin/env ruby

require_relative 'Msg'

class MsgOffer < Msg
  attr_accessor :from, :to, :offer

  def fields
    # FIXME: make @from and @to a user reference
    ['@from', '@to', '@offer']
  end
end
