'use strict';

function DevicesCtrl(AccessToken, Device, $scope, $rootScope, $http, $location) {
  $scope.authorized = (!!AccessToken.get().access_token);
  if ($scope.authorized) {
    $rootScope.active = 'all';
    $scope.devices = Device.query({ per: 100 }, function() {
      if ($scope.devices.length > 0) { $scope.selected = $scope.devices[0] }
      $scope.app = {};
      _.each($scope.devices, function(device) { $scope.app[device.id] = angular.copy(device) });
    });
  };

  $scope.$on('lelylan:device:open', function(event, device) {
    $scope.selected = _.findWhere($scope.devices, { id: device.id });
  });
};

DevicesCtrl.$inject = ['AccessToken', 'Device', '$scope', '$rootScope', '$http', '$location'];
