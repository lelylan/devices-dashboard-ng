'use strict';

angular.module('lelylan.dashboards.device', [
  'ngRoute',
  'perfect_scrollbar'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
