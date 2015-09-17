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
      val = self.instance_variable_get(var)
      data[var.to_s.delete("@").to_sym] = if val.is_a? Numeric then val else val.to_s end
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
