'use strict';

function DevicesCtrl(AccessToken, Device, $scope, $rootScope, $http, $location) {
  $scope.authorized = (!!AccessToken.get().access_token);
  if ($scope.authorized) {
    $rootScope.active = 'all';
    $scope.devices = Device.query({ per: 100 }, function() {
      if ($scope.devices.length > 0) { $scope.selected = $scope.devices[0] }
    });
  };

  $scope.$on('lelylan:device:open', function(event, id) {
    $scope.selected = _.findWhere($scope.devices, { id: id });
  });

};

DevicesCtrl.$inject = ['AccessToken', 'Device', '$scope', '$rootScope', '$http', '$location'];
