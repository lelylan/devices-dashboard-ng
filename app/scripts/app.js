'use strict';

angular.module('lelylan.dashboards.device', [
  'lelylan.dashboards.device.dimension',
  'lelylan.dashboards.device.column',
  'lelylan.dashboards.device.menu',
  'lelylan.dashboards.device.socket',
  'lelylan.dashboards.device.notifications',
  'lelylan.directives.device',
  'lelylan.directives.type',
  'config',
  'ngRoute'
])

// routing
angular.module('lelylan.dashboards.device').config(function ($routeProvider) {
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

// spinner on http request
angular.module('lelylan.dashboards.device').config(function ($httpProvider) {
  $httpProvider.responseInterceptors.push('myHttpInterceptor');
  var spinnerFunction = function spinnerFunction(data, headersGetter) {
    $("#spinner").show();
    return data;
  };

  $httpProvider.defaults.transformRequest.push(spinnerFunction);
});

angular.module('lelylan.dashboards.device').factory('myHttpInterceptor', function ($q, $window) {
  return function (promise) {
    return promise.then(function (response) {
      $("#spinner").hide();
      return response;
    }, function (response) {
      $("#spinner").hide();
      return $q.reject(response);
    });
  };
});

