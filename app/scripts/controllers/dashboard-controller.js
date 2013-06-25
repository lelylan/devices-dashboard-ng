'use strict';

function DashboardCtrl(AccessToken, $scope, $rootScope, $http, $location, $timeout, config) {
  $rootScope.active = '';
  $scope.alerts = [];
  $scope.connection = 'Connecting...';

  $scope.oauth = {
    client:   '017b9f702a904869a80a0f9fd8ed88838f6e52bd39b147b19e69fed705e1b912',
    redirect: 'http://manage.lelylan.com',
    scope:    'resources+privates'
  };

  $scope.$on('lelylan:logout', function(event) {
    $rootScope.active = '';
    $location.path('/home');
  });

  $scope.$on('lelylan:device:delete', function(event, device) {
    $rootScope.active = '';
    $location.path('/');
    $scope.alerts.push({ type: 'success', msg: device.name + ' successfully deleted' })
    $timeout(function() { $scope.closeAlert($scope.alerts.length - 1) }, 10000);
  });

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  var token = AccessToken.get().access_token;
  var authorized = (!!token);

  if (authorized) {
    var socket = io.connect(config.socket);

    socket.on(token, function (event) {
      if (token != event.token) {
        $scope.fire(event.data);
        $scope.$apply()
      }
    });

    $scope.fire = function(device) {
      $rootScope.$broadcast('lelylan:device:request:end', device);
    };

    socket.on('connected', function (event) {
      $scope.connection = 'Realtime enabled';
      $scope.$apply();
    });

    socket.on('disconnected', function (event) {
      $scope.connection = 'Realtime disabled';
      $scope.$apply();
    });
  };
};

DashboardCtrl.$inject = ['AccessToken', '$scope', '$rootScope', '$http', '$location', '$timeout', 'lelylan.config'];

var cl = new CanvasLoader('lelylan-request-loading');
cl.setColor('#239cbb');
cl.setShape('spiral');
cl.setDiameter(20);
cl.setDensity(70);
cl.setRange(0.7);
cl.setSpeed(2);
cl.setFPS(35);
cl.show();
