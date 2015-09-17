#!/usr/bin/env ruby

require_relative 'Msg'

class MsgJoin < Msg
  attr_reader :user
  
  def initialize(user)
    @user = user
  end
end
