'use strict';

angular.module('lelylan.dashboards.device', [
  'lelylan.dashboards.device.dimension',
  'lelylan.dashboards.device.column',
  'lelylan.dashboards.device.menu',
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
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: function($rootScope) {
        $rootScope.loading = false;
      }
    })
    .when('/expired', {
      templateUrl: 'views/expired.html',
      controller: function($rootScope) {
        $rootScope.loading = false;
      }
    })
    .when('/empty', {
      templateUrl: 'views/empty.html',
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
});
