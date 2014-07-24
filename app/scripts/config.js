"use strict";

 angular.module("config", [])

.constant("ENV", {
  "name": "production",
  "endpoint": "http://api.lelylan.com",
  "credentials": {
    "site": "http://people.lelylan.com",
    "clientId": "3bfdab6de9b9f2b82c595bd8befef178d5ea929dc40b0848de6a67b2a182d709",
    "redirectUri": "http://lelylan.github.io/devices-dashboard-ng",
    "profileUri": "http://api.lelylan.com/me"
  },
  "websocket": "ws://96.126.109.170:80"
})

;