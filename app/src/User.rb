#!/usr/bin/env ruby

require 'securerandom'
require 'celluloid/io'

require_relative 'JsonSerializable'
require_relative 'Msg'

class User
  CYCLE_TIME = 1

  attr_reader :id, :session, :socket

  include JsonSerializable, Celluloid::IO

  def initialize(session, id = SecureRandom.urlsafe_base64)
    @session = session
    @id = id
  end

  def to_h
    return {
      id: @id
    }
  end

  def socket=(socket)
    @socket = socket
    Celluloid.every(CYCLE_TIME) {
      begin
        on_message(@socket.read) # this seems to be blocking.
      rescue
        on_close
      end
    }
  end

  def send_message(msg)
    begin
      @socket.write msg.to_json
    rescue 
      on_close
    end
  end

  def on_message(msg)
    case JSON.parse(msg)['type']
    when 'MsgOffer'
      msg = MsgOffer.new.from_json!(msg)
      @session.beat (lambda do |user| user.send_message(msg) unless msg.from == user.id end)
    else
      puts "Unkown message type"
    end
  end

  def on_close
    @session.on_leave(self)
  end

  def fields
    return ['@id']
  end
end
