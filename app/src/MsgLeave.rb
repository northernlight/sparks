#!/usr/bin/env ruby

require_relative 'Msg'

class MsgLeave < Msg
  attr_reader :user

  def initialize(user)
    @user = user
  end
end
