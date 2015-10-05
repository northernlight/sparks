#!/usr/bin/env ruby

require 'json'

module JsonSerializable
  def to_json
    if self.respond_to? :to_h
      return JSON.generate({type: self.class.name}.merge(self.to_h))
    else
      data = {type: self.class.name}
      self.instance_variables.each {|var|
        val = self.instance_variable_get(var)
        if val.nil? or (val.respond_to? :empty? and val.empty?)
          next
        elsif val.respond_to? :to_h
          data[var.to_s.delete("@").to_sym] = val.to_h
        elsif val.is_a? Numeric or val.is_a? String
          data[var.to_s.delete("@").to_sym] = val
        else
          data[var.to_s.delete("@").to_sym] = val.to_json
        end
      }
      return JSON.generate(data)
    end
  end

  def from_json!(json)
    data = JSON.parse(json)
    vars = self.instance_variables
    if self.respond_to?('fields')
      vars = self.fields()
    end
    vars.each {|var|
      if data.has_key? var.to_s.delete("@")
        self.instance_variable_set(var, data[var.to_s.delete("@")])
      end
    }
    return self # allow chaining of commands
  end
end
