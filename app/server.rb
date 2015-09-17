require 'liquid'
require 'angelo'

require_relative 'src/Session.rb'
require_relative 'src/User.rb'

class Server < Angelo::Base
  report_errors!
  log_level Logger::INFO

  get '/' do
    Session.new.tap {|session|
      @sessions[session.id.to_sym] = session
      redirect "/session/#{session.id}"
    }
  end

  websocket '/:session_id' do |ws|
    session_id = params[:session_id].to_sym
    if @sessions.has_key? session_id
      session = @sessions[session_id]
      User.new(session).tap{|user|
        user.socket = ws
        if session.onJoin(user)
          user.sendMessage(MsgJoin.new(user))
        else
          user.sendMessage(MsgError.new("could not join channel"))
        end
      }
    else
      raise MsgError.new("no such session id")
    end
  end

  get '/session/:id' do
    @id = params[:id]
    erb :session
  end
end

Server.run! "0.0.0.0"
