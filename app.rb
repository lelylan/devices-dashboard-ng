require 'sinatra/base'

class App < Sinatra::Base
  set :public_folder, File.dirname(__FILE__) + '/dist'

  get '/*' do
    send_file File.join(settings.public_folder, 'index.html')
  end
end
