require 'sinatra/base'

class App < Sinatra::Base
  set :public_folder, File.dirname(__FILE__) + '/dist'

  get '/index-dev-local.html/*', provides: 'html' do
    send_file File.join(settings.public_folder, 'index-dev-local.html')
  end

  get '/index-dev.html/*', provides: 'html' do
    send_file File.join(settings.public_folder, 'index-dev.html')
  end

  get '/*', provides: 'html' do
    send_file File.join(settings.public_folder, 'index.html')
  end
end
