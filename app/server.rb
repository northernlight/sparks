require 'liquid'
require 'angelo'

require_relative 'src/Session.rb'
require_relative 'src/User.rb'
require_relative 'src/Msg.rb'

$sessions = Hash.new

class Server < Angelo::Base
  report_errors!
  log_level Logger::INFO

  get '/' do
    session = Session.new
    $sessions[session.id.to_sym] = session
    puts $sessions
    redirect "/session/#{session.id}"
  end

  websocket '/session/:session_id' do |ws|
    session_id = params[:session_id].to_sym
    puts session_id
    puts $sessions
    if $sessions.has_key? session_id
      session = $sessions[session_id]
      User.new(session).tap{|user|
        user.socket = ws
        if session.on_join(user)
          user.send_message(MsgJoin.new(user))
        else
          user.send_message(MsgError.new("could not join channel"))
        end
      }
    else
      ws.write MsgError.new("no such session id").to_s
    end
  end

  get '/session/:id' do
    @id = params[:id]
    erb :session
  end
end

Server.run! "0.0.0.0"
