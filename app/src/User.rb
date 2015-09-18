#!/usr/bin/env ruby

require 'securerandom'
require_relative 'JsonSerializable'
require_relative 'Msg'

class User
  CYCLE_TIME = 10

  attr_reader :id, :session, :socket

  include JsonSerializable, Celluloid

  def initialize(session, id = SecureRandom.urlsafe_base64)
    @session = session
    @id = id
  end

  def socket=(socket)
    @socket = socket
    self.async.track_socket
  end

  def send_message(msg)
    socket.write msg.to_s
  end

  def on_close
    @session.on_leave(self)
  end

  def fields
    return ['@id']
  end

  def track_socket
    begin
      catch :done do
        loop do
          if @socket.closed? then
            # FIXME: this will never be reached - why?
            throw :done
          end
          send_message(MsgPing.new)
          sleep(CYCLE_TIME)
        end
      end
    rescue Reel::SocketError
    ensure
      on_close
    end
  end
end
