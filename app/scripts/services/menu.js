'use strict';

var service = angular.module('lelylan.dashboards.device.menu', []);

service.factory('Menu', function() {

  var service = {};

  // Defines the menu structure:
  // * visible: object defining which menu item is visible
  var menu = { visible: { lelylan: false, categories: false, devices: false } };


  // Returns the columns structure
  service.get = function() {
    return menu;
  };

  // Set the visible menu item to see on the left menu
  service.set = function(item) {
    _.each(menu.visible, function(value, key) {
      menu.visible[key] = (key == item) ? true : false
    });
  }

  return service;
});
