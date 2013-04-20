'use strict';

function TypesCtrl(NewDevice, AccessToken, Type, $scope, $rootScope, $http, $location) {

  $scope.getPopular = function() {
    $rootScope.typesMenu = 'populars'
    if ($rootScope.populars) {
      $scope.types = $rootScope.populars;
    } else {
      $rootScope.populars = $scope.types = Type.popular({ per: 250 });
    }
  };

  $scope.getYours = function() {
    $rootScope.typesMenu = 'yours'
    if ($rootScope.yours) {
      $scope.types = $rootScope.yours;
    } else {
      $rootScope.yours = $scope.types = Type.query({ per: 250 });
    }
  };

  $scope.select = function(type) {
    NewDevice.set({ type: { id: type.id, name: type.name }});
    $location.path('/new');
  };

  $scope.back = function() {
    $location.path('/new');
  };

  $scope.authorized = (!!AccessToken.get().access_token);
  if (!$rootScope.typesMenu) $rootScope.typesMenu = 'populars';

  if ($scope.authorized) {
    $rootScope.active = 'new';
    if ($rootScope.typesMenu == 'populars') $scope.getPopular();
    if ($rootScope.typesMenu == 'yours') $scope.getYours();
  };
};

TypesCtrl.$inject = ['NewDevice', 'AccessToken', 'Type', '$scope', '$rootScope', '$http', '$location'];
