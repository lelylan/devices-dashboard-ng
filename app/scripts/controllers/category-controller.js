'use strict';

function CategoryCtrl(Device, AccessToken, $scope, $routeParams, $rootScope) {
  $scope.authorized = (!!AccessToken.get().access_token);
  var category = $rootScope.active = $routeParams.category;

  if ($scope.authorized) {
    $scope.devices = null;
    $scope.loading = true;

    $scope.devices = Device.query({ category: category, per: 250 }, function() {
      $scope.loading = false;
      if ($scope.devices.length > 0)
        $scope.selected = $scope.devices[0]
    });
  };
};

CategoryCtrl.$inject = ['Device', 'AccessToken', '$scope', '$routeParams', '$rootScope'];
