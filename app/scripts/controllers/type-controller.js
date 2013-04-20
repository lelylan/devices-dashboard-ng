'use strict';

function TypeCtrl(NewDevice, $scope, $routeParams, $location) {
  $scope.select = function(type) {
    NewDevice.set({ type: { id: $scope.typeId, name: $location.search().name }});
    $location.path('/new');
  };

  $scope.back = function() {
    $location.path('/types');
  };

  $scope.typeId = $routeParams.typeId;
};

TypeCtrl.$inject = ['NewDevice', '$scope', '$routeParams', '$location'];
