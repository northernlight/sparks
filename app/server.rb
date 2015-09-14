require 'liquid'
require 'angelo'
require 'securerandom'

class Server < Angelo::Base
  report_errors!
  log_level Logger::INFO

  get '/' do
    redirect "/session/#{SecureRandom.urlsafe_base64}"
  end

  get '/session/:id' do
    @id = params[:id]
    erb :session
  end

  eventsource '/stream/:id' do |s|
    id = params[:id].to_sym
    sses[id].each {|peer|
      s.event :client, peer.socket.to_io.peeraddr[-1]
#      peer.event :client, s.socket.to_io.peeraddr[-1]
    }
    sses[id] << s
  end

  post '/stream/:method/:id' do
    id = params[:id].to_sym
    method = params[:method].to_sym
    case method
    when :offer
      sses[id].event :offer, params.to_json
    when :answer
      sses[id].event :answer, params.to_json
    end
  end

  get '/test' do
    erb :test
  end
end

Server.run! "0.0.0.0"
