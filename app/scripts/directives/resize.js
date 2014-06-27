'use strict';

angular.module('lelylan.dashboards.device').directive('resize', function ($window, $timeout) {

  return function (scope, element) {
    var w = angular.element($window);

    scope.show      = { categories: true, devices: true, details: true }
    var breakpoints = { desktop: 69, tablet: 46 }

    scope.getWindowDimensions = function () {
      var factor = parseFloat($("body").css("font-size"));

      return {
        'h': w.height() / factor,
        'w': w.width() / factor
      };
    };

    scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
      var menuOffset     = (scope.columns == 'one') ? 3.8 : 4.3
      scope.appHeight    = newValue.h - menuOffset;
      scope.windowWidth  = newValue.w;

      /*
       * Visualization logics
       */

      scope.show = scope.show || {};
      scope.menu = scope.menu || {};

      if (scope.windowWidth > breakpoints.desktop) {
        if (scope.view != 'desktop') { // set default the first time
          angular.extend(scope.show, { categories: true, devices: true, details: true });
          angular.extend(scope.menu, { lelylan: true, categories: false, devices: false });
        }

        scope.view = 'desktop';
      }

      if (scope.windowWidth < breakpoints.desktop && scope.windowWidth > breakpoints.tablet) {
        if (scope.view != 'tablet') { // set default the first time
          angular.extend(scope.show, { categories: false, devices: true, details: true });

          if (scope.show.categories) { angular.extend(scope.menu, { categories: false, devices: false }); }
          if (scope.show.details)    { angular.extend(scope.menu, { categories: true,  devices: false }); }
        }

        scope.view = 'tablet';
      }

      if (scope.windowWidth < breakpoints.tablet) {

        if (scope.view != 'mobile') { // set default the first time
          scope.show = { categories: false, devices: true, details: false };

          if (scope.show.categories) { angular.extend(scope.menu, { categories: false, devices: false }); }
          if (scope.show.devices)    { angular.extend(scope.menu, { categories: true,  devices: false }); }
          if (scope.show.details)    { angular.extend(scope.menu, { categories: false, devices: true }); }
        }

        scope.view = 'mobile';
      }

      scope.columns = 0;
      _.each(scope.show, function(column) { if (column) { scope.columns += 1; } })

      if (scope.columns == 1) { scope.columns = 'one'   }
      if (scope.columns == 2) { scope.columns = 'two'   }
      if (scope.columns == 3) { scope.columns = 'three' }

      if (scope.columns == 'three') { scope.menu = { lelylan: true, categories: false, devices: false } }

      if (scope.columns == 'two') {
        if (scope.show.categories) { scope.menu = { categories: false, devices: false } }
        if (scope.show.details)    { scope.menu = { categories: true,  devices: false } }
      }

      if (scope.columns == 'one') {
        if (scope.show.categories) { scope.menu = { categories: false, devices: false } }
        if (scope.show.devices)    { scope.menu = { categories: true,  devices: false } }
        if (scope.show.details)    { scope.menu = { categories: false, devices: true } }
      }



    }, true);

    w.bind('resize', function () {
      scope.$apply();
    });
  }
})

