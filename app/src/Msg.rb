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
end
