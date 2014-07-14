'use strict';

var service = angular.module('lelylan.dashboards.device.dimension', []);

service.factory('Dimension', function($window, $rootScope, Column) {

  var _window = angular.element($window);

  var dimensions = {};
  var offsets    = { menu: 4.3, spacing: 0.5 };
  var service    = {};


  service.get = function() {
    return dimensions;
  }

  var set = function() {
    // Set the window width
    dimensions.width = em(_window.width());
    // Set the window height removing the space used by the menu
    dimensions.height = em(_window.height()) - offsets.menu;
    // Set the column number
    Column.set(dimensions);
    // Add the menu bottom margin that is removed on mobile
    if (Column.get().count == 'one') { dimensions.height += offsets.spacing }
  };

  var em = function(value) {
    var factor = parseFloat($("body").css("font-size"));
    return value / factor;
  }

  _window.bind('resize', function () {
    $rootScope.$apply(function () { set(); });
  });

  set();

  return service;
});
