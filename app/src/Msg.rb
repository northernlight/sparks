#!/usr/bin/env ruby

require_relative 'JsonSerializable'

class Msg
  include JsonSerializable
  extend JsonSerializable
end

require_relative 'MsgError'
require_relative 'MsgJoin'
require_relative 'MsgLeave'
require_relative 'MsgPing'
require_relative 'MsgNewUser'
require_relative 'MsgOffer'
require_relative 'MsgAnswer'
require_relative 'MsgICE'
