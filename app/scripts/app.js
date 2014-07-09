'use strict';

angular.module('lelylan.dashboards.device', [
  'lelylan.directives.device',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/create', {
        templateUrl: 'views/create.html',
        controller: 'CreateCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: function($rootScope) {
          $rootScope.page = 'login';
          $rootScope.loading = false;
        }
      })
      .when('/expired', {
        templateUrl: 'views/expired.html',
        controller: function($rootScope) {
          $rootScope.page = 'expired';
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
