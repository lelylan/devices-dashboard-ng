#!/bin/bash

set -x
set -e

grunt build
cp -r /usr/src/app/dist/* /var/www/
nginx -g "daemon off;"
