'use strict';

function DevicesCtrl(AccessToken, Device, $scope, $rootScope, $http, $location) {
  $scope.authorized = (!!AccessToken.get().access_token);
  $rootScope.active = 'all';

  if ($scope.authorized) {
    $scope.devices = null;
    $scope.loading = true;

    $scope.devices = Device.query({ per: 250 }, function() {
      $scope.loading = false;
      if ($scope.devices.length > 0)
        $scope.selected = $scope.devices[0]
    });
  } else {
    $location.path('/home');
  }

  $scope.$on('lelylan:device:open', function(event, device) {
    $scope.selected = _.findWhere($scope.devices, { id: device.id });
  });

  // BUG - If I do not apply the following functions the `pending` property gets lost.
  // As far as I know this shouldn't happen and it's a bug that need to be solved.
  $scope.$on('lelylan:device:request:start', function(event, device) { var resource = _.findWhere($scope.devices, { id: device.id }); resource.pending = device.pending; resource.updated_at = device.updated_at });
  $scope.$on('lelylan:device:request:end', function(event, device)   { var resource = _.findWhere($scope.devices, { id: device.id }); resource.pending = device.pending; resource.updated_at = device.updated_at });
};

DevicesCtrl.$inject = ['AccessToken', 'Device', '$scope', '$rootScope', '$http', '$location'];
