'use strict';

angular.module('lelylan.dashboards.device').directive('resize', function ($window, $timeout) {

  return function (scope, element) {
    var w = angular.element($window);

    scope.show      = { categories: true, devices: true, detail: true }
    var breakpoints = { desktop: 66, tablet: 40 }

    scope.getWindowDimensions = function () {
      var factor = parseFloat($("body").css("font-size"));

      return {
        'h': w.height() / factor,
        'w': w.width() / factor
      };
    };

    scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
      scope.windowHeight = newValue.h;
      scope.windowWidth = newValue.w;

      scope.style = function () {
        return {
          'height': (newValue.h - 100) + 'px',
          'width': (newValue.w - 100) + 'px'
        };
      };



      /*
       * Visualization logics
       */

      if (scope.windowWidth > breakpoints.desktop) {
        scope.show = { categories: true, devices: true, details: true }
      }

      if (scope.windowWidth < breakpoints.desktop) {
        scope.show = { categories: false, devices: true, details: true }
      }

      if (scope.windowWidth < breakpoints.tablet) {
        scope.show = { categories: false, devices: true, details: false }
      }

      scope.columns = 0;
      _.each(scope.show, function(column) { if (column) { scope.columns += 1; } })
      if (scope.columns == 1) { scope.columns = 'one'   }
      if (scope.columns == 2) { scope.columns = 'two'   }
      if (scope.columns == 3) { scope.columns = 'three' }

      scope.$broadcast('rebuild:me');

    }, true);

    w.bind('resize', function () {
      scope.$apply();
    });
  }
})

