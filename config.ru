require 'sinatra'
require 'newrelic_rpm'

require File.expand_path '../app.rb', __FILE__

run App
