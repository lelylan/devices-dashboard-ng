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
  }
  $scope.$on('lelylan:device:open', function(event, device) {
    $scope.selected = _.findWhere($scope.devices, { id: device.id });
  });
};

DevicesCtrl.$inject = ['AccessToken', 'Device', '$scope', '$rootScope', '$http', '$location'];
