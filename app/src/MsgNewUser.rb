#!/usr/bin/env ruby

require_relative 'Msg'

class MsgNewUser < MsgJoin
  def initialize(user, count: 0)
    super(user)
    @users_count = count
  end
end
