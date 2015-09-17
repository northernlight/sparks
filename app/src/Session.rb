#!/usr/bin/env ruby

require 'securerandom'

require_relative 'User'
require_relative 'JsonSerializable'

class Session
  attr_reader :id

  include JsonSerializable

  def initialize(id = SecureRandom.urlsafe_base64)
    @id = id
    @users = []
  end

  def on_join(user)
    @users.each {|peer|
      peer.send_message(new MsgJoin(user))
    }
    @users << user
  end

  def on_leave(user)
    @users.delete(user)
    @users.each {|peer|
      peer.send_message(new MsgLeave(user))
    }
  end
end
