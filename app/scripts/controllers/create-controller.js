'use strict';

// TODO set the correct authorization check and set the oauth2 on testing
function CreateCtrl(NewDevice, Device, AccessToken, $scope, $rootScope, $location) {
  $rootScope.active = 'create';
  $scope.select = false;
  $scope.authorized = (!!AccessToken.get().access_token);
  $scope.device = NewDevice.get();

  $scope.create = function() {
    $scope.device.$save(function() {
      $rootScope.active = 'all';
      $location.url('/all');
    });
  };

  $scope.reset = function() {
    $scope.device = null;
    NewDevice.reset();
  }
};

CreateCtrl.$inject = ['NewDevice', 'Device', 'AccessToken', '$scope', '$rootScope', '$location'];
