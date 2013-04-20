'use strict';

function TypesCtrl(NewDevice, AccessToken, Type, $scope, $rootScope, $http, $location) {
  $scope.authorized = (!!AccessToken.get().access_token);

  if ($scope.authorized) {
    $rootScope.active = 'new';
    $scope.types = Type.popular({ per: 250 });
  };

  $scope.select = function(type) {
    NewDevice.set({ type: { id: type.id }});
    $location.path('/new');
  };

  $scope.details = function(type) {
    $location.path('/types/' + type.id);
  };
};

TypesCtrl.$inject = ['NewDevice', 'AccessToken', 'Type', '$scope', '$rootScope', '$http', '$location'];
