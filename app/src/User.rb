#!/usr/bin/env ruby

require 'securerandom'
require 'celluloid/io'
require "openssl"
require "base64"

require_relative '../config'

require_relative 'JsonSerializable'
require_relative 'Msg'

class User
  CYCLE_TIME = 1

  attr_reader :id, :session, :socket

  include JsonSerializable, Celluloid::IO

  def initialize(session, id = SecureRandom.urlsafe_base64)
    @session = session
    @id = id
    @cipher = OpenSSL::Cipher::Cipher.new("aes-256-cbc")
    @cipher.key = $config[:secret_key]
    @cipher.iv = @cipher.random_iv
  end

  def to_h
    return {
      id: @id
    }
  end

  def to?(to)
    @id == to
  end

  def socket=(socket)
    @socket = socket
    Celluloid.every(CYCLE_TIME) {
      begin
        on_message(@socket.read) # this seems to be blocking.
      rescue Exception => e
        puts e.inspect
        on_close
        terminate
      end
    }
  end

  def send_message(msg)
    begin
      @socket.write msg.to_json
    rescue Exception => e
      puts e.inspect
      on_close
    end
  end

  def on_message(msg)
    case JSON.parse(msg)['type']
    when 'MsgOffer'
      msg = MsgOffer.new.from_json!(msg)
      msg.from = @id
      @session.beat (lambda do |user| user.send_message(msg) if user.to? msg.to end)
    when 'MsgAnswer'
      msg = MsgAnswer.new.from_json!(msg)
      msg.from = @id
      @session.beat (lambda do |user| user.send_message(msg) if user.to? msg.to end)
    when 'MsgICE'
      msg = MsgICE.new.from_json!(msg)
      msg.from = @id
      @session.beat (lambda do |user| user.send_message(msg) if user.to? msg.to end)
    else
      puts "Unkown message type #{JSON.parse(msg)['type']}"
    end
  end

  def encrypt_msg(msg)
    if(msg.respond_to? :from)
      @cipher.encrypt
      msg.from = @cipher.update(msg.from)
      msg.from = Base64.encode64(@cipher.final)
    end
    return msg
  end

  def decrypt_msg(msg)
    if(msg.respond_to? :to)
      @cipher.decrypt
      msg.to = @cipher.update(Base64.decode64(msg.to))
      msg.to = @cipher.final
    end
    return msg
  end

  def on_close
    @session.on_leave(self)
  end

  def fields
    return ['@id']
  end
end
