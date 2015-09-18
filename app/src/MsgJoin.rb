#!/usr/bin/env ruby

require_relative 'Msg'

class MsgJoin < Msg
  attr_reader :user

  def initialize(user, is_self: false)
    @user = user
    @is_self = is_self
  end
end
