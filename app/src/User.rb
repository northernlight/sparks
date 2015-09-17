#!/usr/bin/env ruby

require 'securerandom'

require_relative 'JsonSerializable'

class User
  attr_reader :id, :session
  attr_accessor :socket

  include JsonSerializable

  def initialize(session, id = SecureRandom.urlsafe_base64)
    @session = session
    @id = id
  end

  def send_message(msg)
    puts msg
    socket.write msg.to_s
  end

  def fields
    return ['@id']
  end
end
