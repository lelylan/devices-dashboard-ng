worker_processes 7 # amount of unicorn workers to spin up
timeout 30         # restarts workers that hang for 30 seconds
preload_app true   # load the application before forking workers
                   # (set to true if you use NewRelic or you won't see any data)
