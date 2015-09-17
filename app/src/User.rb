#!/usr/bin/env ruby

class User
  attr_reader :id
  attr_accessor :socket

  def initialize(session, id = SecureRandom.urlsafe_base64)
    @session = session
    @id = id
  end
end
