'use strict';

var service = angular.module('lelylan.dashboards.device.notifications', []);

service.factory('Notifications', function($rootScope, Type) {

  var service = {};
  var notifications = [];

  service.get = function() {
    return notifications;
  };

  service.push = function(device) {
    var previous = findDevice(device.id);
    var changes  = diff(previous, device);
    var message  = setMessage(device, changes);

    notifications.unshift({
      unread: true,
      device: device,
      previous: previous,
      changes: changes,
      message: message
    });

    if (notifications.length > 51) {
      notifications.pop();
    };

    return notifications;
  };

  var diff = function (previous, device) {
    var changes = [];

    _.each(previous.properties, function(property, index) {
      if (previous.properties[index].value != device.properties[index].value) {
        var result = {};

        // find the property name
        var type = findType(device.type.id);
        result.name = _.find(type.properties, function(resource) { return resource.id == property.id }).name;

        // set precious and actual values
        result.previous = previous.properties[index].value;
        result.value    = device.properties[index].value;

        // push the updated property
        changes.push(result);
      }
    });

    return changes;
  };

  var setMessage = function(device, changes) {
    var message = 'Changed its ';
    _.each(changes, function(property, index) {
      message = message + property.name + ' from ' + property.previous + ' to ' + property.value;
      if (index+1 != changes.length)
        message = message + ', '
    });

    return message;
  };

  // Find the device with a specific ID
  var findDevice = function(id) {
    return _.find($rootScope.all, function(resource) {
      return resource.id == id;
    });
  };

  // Find the device with a specific ID
  var findType = function(id) {
    return _.find($rootScope.types, function(resource) {
      return resource.id == id;
    });
  };

  return service;
});
