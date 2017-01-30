#!/bin/bash

set -x
set -e

grep -l -r api.lelylan.com
grep -l -r people.lelylan.com
grep -l -r 3bfdab6de9b9f2b82c595bd8befef178d5ea929dc40b0848de6a67b2a182d709
grep -l -r lelylan.github.io/devices-dashboard-ng
grep -l -r lelylan-websockets.herokuapp.com

[ "${LELYLAN_API_PUBLIC_URL:-}" ] && (grep -l -r api.lelylan.com | xargs sed -i "s@api.lelylan.com@${LELYLAN_API_PUBLIC_URL}@g")
[ "${LELYLAN_PEOPLE_PUBLIC_URL:-}" ] && (grep -l -r people.lelylan.com | xargs sed -i "s@people.lelylan.com@${LELYLAN_PEOPLE_PUBLIC_URL}@g")
[ "${LELYLAN_CLIENT_ID:-}" ] && (grep -l -r 3bfdab6de9b9f2b82c595bd8befef178d5ea929dc40b0848de6a67b2a182d709 | xargs sed -i "s@3bfdab6de9b9f2b82c595bd8befef178d5ea929dc40b0848de6a67b2a182d709@${LELYLAN_CLIENT_ID}@g")
[ "${LELYLAN_DEVICES_DASHBOARD_PUBLIC_URL:-}" ] && (grep -l -r lelylan.github.io/devices-dashboard-ng | xargs sed -i "s@lelylan.github.io/devices-dashboard-ng@${LELYLAN_DEVICES_DASHBOARD_PUBLIC_URL}@g")
[ "${LELYLAN_WEBSOCKETS_PUBLIC_URL:-}" ] && (grep -l -r lelylan-websockets.herokuapp.com | xargs sed -i "s@lelylan-websockets.herokuapp.com@${LELYLAN_WEBSOCKETS_PUBLIC_URL}@g")

grunt build
cp -r /usr/src/app/dist/* /var/www/
nginx -g "daemon off;"
