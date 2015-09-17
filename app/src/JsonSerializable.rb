#!/usr/bin/env ruby

require 'json'

module JsonSerializable
  def to_json
    data = {type: self.class.name}
    vars = self.instance_variables
    if self.respond_to?('fields')
      vars = self.fields()
    end
    vars.each {|var|
      data[var.to_s.delete("@").to_sym] = self.instance_variable_get(var).to_json
    }
    return JSON.generate(data)
  end

  def to_str
    self.to_json
  end

  def to_s
    self.to_json
  end
end
