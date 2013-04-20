'use strict';

function CategoryCtrl(Device, AccessToken, $scope, $routeParams, $rootScope) {
  $scope.authorized = (!!AccessToken.get().access_token);
  var category = $routeParams.category;

  if ($scope.authorized) {
    $rootScope.active = category;
    $scope.devices = Device.query({ category: category, per: 250 }, function() {
      if ($scope.devices.length > 0) { $scope.selected = $scope.devices[0] }
    });
  };
};

CategoryCtrl.$inject = ['Device', 'AccessToken', '$scope', '$routeParams', '$rootScope'];
