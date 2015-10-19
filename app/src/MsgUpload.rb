#!/usr/bin/env ruby

require_relative 'Msg'

class MsgUpload < Msg
  attr_accessor :from, :fileType, :file, :data

  def fields
    ['@from', '@fileType', '@file', '@data']
  end
end
