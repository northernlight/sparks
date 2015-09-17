#!/usr/bin/env ruby

require 'json'

class Msg
  def to_json
    data = {type: self.class.name}
    self.instance_variables.each {|var|
      data[var.to_s.delete("@")] = self.instance_variable_get(var)
    }
    return data.to_json
  end

  def to_str
    self.to_json
  end

  def to_s
    self.to_json
  end
end

require_relative 'MsgError.rb'
require_relative 'MsgJoin.rb'
require_relative 'MsgLeave.rb'
