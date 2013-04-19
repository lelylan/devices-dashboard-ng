'use strict';

var test = angular.module('demo', ['lelylan.dashboards.devices.demo', 'ngMockE2E']);

test.run(['$httpBackend', 'LoggedUser', 'AccessToken',
  function($httpBackend, LoggedUser, AccessToken) {

  /*
   * Fake user
   */

  AccessToken.set({ access_token: 1 })
  LoggedUser.set({ id: 1, name: 'try@lelylan.com' });
  $httpBackend.whenGET('http://api.lelylan.com/me').respond({ id: 1, email: 'try@lelylan.com' });

  /*
   * Devices List
   */

  var devices = [light];
  $httpBackend.whenGET('http://api.lelylan.com/devices?per=100')
    .respond(function(method, url, data, headers){ return [200, updateDevices(), {}]; });

  var updateDevices = function() {
    return _.map(devices, function(device) { device.updated_at = new Date(); return device; })
  }

  /*
   * Lights
   */

  $httpBackend.whenDELETE('http://api.lelylan.com/devices/1').respond(light);
  $httpBackend.whenGET('http://api.lelylan.com/devices/1').respond(light);
  $httpBackend.whenGET('http://api.lelylan.com/types/1').respond(lightType);

  /*
   * General Device Update
   */

  $httpBackend.whenPUT(/http:\/\/api.lelylan.com\/devices/)
    .respond(function(method, url, data, headers){ return [200, updateDevice(data), {}]; });

  var updateDevice = function(data) {
    data = angular.fromJson(data);
    var resource = devices[data.id - 1];

    _.each(data.properties, function(property) {
      var result = _.find(resource.properties, function(_property){ return _property.id == property.id; });
      result.expected = result.value = property.value;
    });
    return resource;
  }

  /*
   * Pass through
   */

  $httpBackend.whenGET(/partials/).passThrough();
  $httpBackend.whenGET(/templates/).passThrough();
}]);
