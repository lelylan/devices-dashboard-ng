"use strict";

 angular.module("config", [])

.constant("ENV", {
  "name": "development",
  "endpoint": "http://localhost:8000",
  "credentials": {
    "site": "http://localhost:3000",
    "clientId": "0e9819715cce6100d8e95e734a42f94f628f91cc5934f8014b91efedb799d36e",
    "redirectUri": "http://localhost:9000/",
    "profileUri": "http://localhost:3000/me"
  }
})

;