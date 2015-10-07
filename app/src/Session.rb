#!/usr/bin/env ruby

require 'securerandom'

require_relative 'User'
require_relative 'JsonSerializable'

class Session
  attr_reader :id, :users

  include JsonSerializable

  def initialize(id = SecureRandom.urlsafe_base64)
    @id = id
    @users = []
  end

  def on_join(user)
    @users.each {|peer|
      begin
        peer.send_message(MsgJoin.new(user))
      rescue Exception => e
        puts e.inspect
      end
    }
    @users << user
  end

  def on_leave(user)
    @users.delete!(user)
    @users.each {|peer|
      begin
        peer.send_message(MsgLeave.new(user))
      rescue Exception => e
        puts e.inspect
      end
    }
  end

  def beat(fun)
    @users.each &fun
  end
end
