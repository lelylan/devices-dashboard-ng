'use strict';

var service = angular.module('lelylan.dashboards.device.column', []);

service.factory('Column', function($location, Menu) {

  var service = {};

  // Breakpoints (in em) where the number of columns changes
  var breakpoints = { three: 69, two: 46 };

  // Defines the columns structure:
  // * count: the number of visible columns
  // * visibles: object defining which columns are visible
  var columns = { visibles: { one: false, two: false, three: false }, count: undefined };


  // Returns the columns structure
  service.get = function() {
    return columns;
  };

  // Define the column structure
  service.set = function(dimensions) {
    setThreeColumns(dimensions);
    setTwoColumns(dimensions);
    setOneColumn(dimensions);

    // if not in the home page we only want to see the Lelylan link
    if ($location.path() != '/') { Menu.set('lelylan'); }
  };

  // Verifies if the layout can contain 3 columns.
  // If it's the first time with 3 columns, initialize the visible ones.
  var setThreeColumns = function(dimensions) {
    if (dimensions.width > breakpoints.three) {
      if (columns.count != 'three') {
        columns.visibles = {
          one: true,
          two: true,
          three: true
        };
      }

      Menu.set('lelylan');
      columns.count = 'three';
    }
  }

  // Verifies if the layout can contain 2 columns.
  // If it's the first time with 2 columns, initialize the visible ones.
  var setTwoColumns = function(dimensions) {
    if (dimensions.width < breakpoints.three && dimensions.width > breakpoints.two) {
      if (columns.count != 'two') {
        columns.visibles = {
          one: false,
          two: true,
          three: true
        }
      }

      if (columns.one) { Menu.set('none') }
      if (columns.two) { Menu.set('categories') }

      columns.count = 'two';
    }
  }

  // Verifies if the layout can contain 1 columns.
  // If it's the first time with 1 columns, initialize the visible one.
  var setOneColumn = function(dimensions) {
    if (dimensions.width < breakpoints.two) {
      if (columns.count != 'one') {
        columns.visibles = {
          one: false,
          two: true,
          three: false
        }
      }

      if (columns.one)   { Menu.set('none'); }
      if (columns.two)   { Menu.set('categories'); }
      if (columns.three) { Menu.set('devices'); }

      columns.count = 'one';
    }
  }

  service.setVisibles = function(columns) {
    columns.visibles = columns;
  }

  return service;
});
