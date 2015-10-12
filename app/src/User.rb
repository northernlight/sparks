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
  attr_accessor :name, :img

  include JsonSerializable, Celluloid::IO

  def initialize(session, id = SecureRandom.urlsafe_base64)
    @session = session
    @id = id
    @cipher = OpenSSL::Cipher::Cipher.new("aes-256-cbc")
    @cipher.key = $config[:secret_key]
    @cipher.iv = @cipher.random_iv

    loop do
      identity = [
        {name: "Hazelnut", img: "/images/fruit-icons/1.png"},
        {name: "Mango", img: "/images/fruit-icons/2.png"},
        {name: "TheFuckIsThis", img: "/images/fruit-icons/3.png"},
        {name: "Cantaloupe", img: "/images/fruit-icons/4.png"},
        {name: "White Grape", img: "/images/fruit-icons/5.png"},
        {name: "Coconut", img: "/images/fruit-icons/6.png"},
        {name: "Blackberry", img: "/images/fruit-icons/7.png"},
        {name: "Banana", img: "/images/fruit-icons/8.png"},
        {name: "Papaya", img: "/images/fruit-icons/9.png"},
        {name: "Apricot", img: "/images/fruit-icons/10.png"},
        {name: "Water Melon", img: "/images/fruit-icons/11.png"},
        {name: "Yellow Pear", img: "/images/fruit-icons/12.png"},
        {name: "Plum", img: "/images/fruit-icons/13.png"},
        {name: "Red Apple", img: "/images/fruit-icons/14.png"},
        {name: "Cherry", img: "/images/fruit-icons/15.png"},
        {name: "TheFuckIsThat", img: "/images/fruit-icons/16.png"},
        {name: "Peach", img: "/images/fruit-icons/17.png"},
        {name: "Green Pear", img: "/images/fruit-icons/18.png"},
        {name: "Blue Grape", img: "/images/fruit-icons/19.png"},
        {name: "Pomegranate", img: "/images/fruit-icons/20.png"},
        {name: "Nectarine", img: "/images/fruit-icons/21.png"},
        {name: "Yellow Apple", img: "/images/fruit-icons/22.png"},
        {name: "Pineapple", img: "/images/fruit-icons/23.png"},
        {name: "Strawberry", img: "/images/fruit-icons/24.png"}
      ].sample
      @name = identity[:name]
      @img = identity[:img]
      break if(@session.users.empty? or @session.users.detect{ |user| user.name != identity[:name]})
    end
  end

  def to_h
    return {
      type: 'User',
      id: @id,
      name: @name,
      img: @img
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
        puts e.backtrace
        on_close
        terminate
      end
    }
  end

  def send_message(msg)
    begin
      if(msg.respond_to? :to)
        msg.to = to_h
      end
      puts "> send " + msg.to_json
      @socket.write msg.to_json
    rescue Exception => e
      puts e.inspect
      puts e.backtrace
      on_close
      raise e
    end
  end

  def on_message(msg)
    case JSON.parse(msg)['type']
    when 'MsgOffer'
      msg = MsgOffer.new.from_json!(msg)
      msg.from = Actor.current
      @session.beat (lambda do |user| user.send_message(msg) if user.to? msg.to["id"] end)
    when 'MsgAnswer'
      msg = MsgAnswer.new.from_json!(msg)
      msg.from = Actor.current
      @session.beat (lambda do |user| user.send_message(msg) if user.to? msg.to["id"] end)
    when 'MsgICE'
      msg = MsgICE.new.from_json!(msg)
      msg.from = Actor.current
      @session.beat (lambda do |user| user.send_message(msg) if user.to? msg.to["id"] end)
    when 'MsgNewUser'
      msg = MsgNewUser.new(self).from_json!(msg)
      puts msg.inspect
      @name = msg.user["name"]
      @img = msg.user["img"]
      msgJoin = MsgJoin.new(self)
      @session.beat (lambda do |user| user.send_message(msgJoin) unless user.to? msgJoin.user.id end)
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
end
