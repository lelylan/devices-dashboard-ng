'use strict';

angular.module('lelylan.dashboards.device')
  .controller('MainCtrl', function ($scope) {

    $scope.$parent.myScrollOptions = {
      'categories': {
        snap: false,
        scrollbars: 'custom',
        onScrollEnd: function () {
          alert('finshed scrolling wrapper');
        }},
    };

  });
