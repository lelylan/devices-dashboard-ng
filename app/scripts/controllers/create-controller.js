'use strict';

// TODO set the correct authorization check and set the oauth2 on testing
function CreateCtrl(Device, AccessToken, $scope, $rootScope, $location) {
  $rootScope.active = 'create';
  $scope.authorized = (!!AccessToken.get().access_token);
  $scope.device = new Device();

  $scope.create = function() {
    $scope.device.$save(function() {
      $rootScope.active = 'all';
      $location.url('/all');
    });
  };

  $scope.$watch('device.type.id', function(value, old) {
    if (value) {
      $scope.device.type.id = '';
      $scope.select = true
    }
  });
};

CreateCtrl.$inject = ['Device', 'AccessToken', '$scope', '$rootScope', '$location'];
