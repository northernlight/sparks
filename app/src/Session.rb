#!/usr/bin/env ruby

require 'securerandom'

require_relative 'User'

class Session
  attr_reader :id
  def initialize(id = SecureRandom.urlsafe_base64)
    @id = id
  end

  def onJoin(user)
    @users.each {|peer|
      peer.sendMessage(new MsgJoin(user))
    }
    @users << user
  end

  def onLeave(user)
    @users.delete(user)
    @users.each {|peer|
      peer.sendMessage(new MsgLeave(user))
    }
  end
end
