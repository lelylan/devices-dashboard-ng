'use strict';

var app = angular.module('lelylan.dashboards.devices', ['lelylan.components.device']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', { templateUrl: '/partials/home.html', controller: DashboardCtrl }).
    otherwise({redirectTo: '/'});
}]);

//directives.config(['$locationProvider', function($locationProvider) {
  //$locationProvider.html5Mode(false).hashPrefix('!');
//}]);
