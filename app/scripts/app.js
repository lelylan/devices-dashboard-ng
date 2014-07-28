'use strict';

angular.module('lelylan.dashboards.device', [
  'lelylan.dashboards.device.dimension',
  'lelylan.dashboards.device.column',
  'lelylan.dashboards.device.menu',
  'lelylan.dashboards.device.socket',
  'lelylan.dashboards.device.notifications',
  'lelylan.directives.device',
  'config',
  'ngRoute'
])
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/devices.html',
      controller:  'DevicesCtrl'
    })
    .when('/create', {
      templateUrl: 'views/create.html',
      controller:  'CreateCtrl'
    })
    .when('/notifications', {
      templateUrl: 'views/notifications.html',
      controller:  'NotificationsCtrl'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: function($rootScope, $timeout, AccessToken) {
        $rootScope.loading = false;
        $timeout(function() {
          console.log("Access Token", !!AccessToken.get())
          if(!!AccessToken.get()) {
            $location.path('/');
            $location.replace();
          }
        }, 0);
      }
    })
    .when('/expired', {
      templateUrl: 'views/expired.html',
      controller: function($rootScope) {
        $rootScope.loading = false;
      }
    })
    .when('/no-devices', {
      templateUrl: 'views/no-devices.html',
      controller: function($rootScope) {
        $rootScope.loading = false;
      }
    })
    .when('/access_token=:accessToken', {
      template: '-',
      controller: function ($location, $route, $routeParams, $timeout, AccessToken) {
        var hash = $location.path().substr(1);
        AccessToken.setTokenFromString(hash);
        $location.path('/');
        $location.replace();
      }
    })
    .otherwise({
      redirectTo: '/'
    });
})


