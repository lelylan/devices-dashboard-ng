'use strict';

var test = angular.module('demo', ['lelylan.dashboards.devices.demo', 'ngMockE2E']);

test.run(['$httpBackend', 'LoggedUser', 'AccessToken',
  function($httpBackend, LoggedUser, AccessToken) {

  /* Fake user */

  AccessToken.set({ access_token: 1 })
  LoggedUser.set({ id: 1, name: 'try@lelylan.com' });
  $httpBackend.whenGET('http://api.lelylan.com/me').respond({ id: 1, email: 'try@lelylan.com' });


  /* Device List */

  var devices = [light, lock, thermostat, alarmClock, camera];

  // Light
  $httpBackend.whenDELETE('http://api.lelylan.com/devices/1').respond(light);
  $httpBackend.whenGET('http://api.lelylan.com/devices/1').respond(light);
  $httpBackend.whenGET('http://api.lelylan.com/types/1').respond(lightType);

  // Lock
  $httpBackend.whenDELETE('http://api.lelylan.com/devices/2').respond(lock);
  $httpBackend.whenGET('http://api.lelylan.com/devices/2').respond(lock);
  $httpBackend.whenGET('http://api.lelylan.com/types/2').respond(lockType);

  // Thermostat
  $httpBackend.whenDELETE('http://api.lelylan.com/devices/3').respond(thermostat);
  $httpBackend.whenGET('http://api.lelylan.com/devices/3').respond(thermostat);
  $httpBackend.whenGET('http://api.lelylan.com/types/3').respond(ThermostatType);

  // Alarm Clock
  $httpBackend.whenDELETE('http://api.lelylan.com/devices/4').respond(alarmClock);
  $httpBackend.whenGET('http://api.lelylan.com/devices/4').respond(alarmClock);
  $httpBackend.whenGET('http://api.lelylan.com/types/4').respond(alarmClockType);

  //Camera
  $httpBackend.whenDELETE('http://api.lelylan.com/devices/5').respond(camera);
  $httpBackend.whenGET('http://api.lelylan.com/devices/5').respond(camera);
  $httpBackend.whenGET('http://api.lelylan.com/types/5').respond(cameraType);

  // Devices request
  $httpBackend.whenGET('http://api.lelylan.com/devices?per=100')
    .respond(function(method, url, data, headers){ return [200, updateDevices(), {}]; });

  var updateDevices = function() {
    console.log(devices);
    return _.map(devices, function(device) { device.updated_at = new Date(); return device; })
  }

  /* Devices Update */

  $httpBackend.whenPUT(/http:\/\/api.lelylan.com\/devices/)
    .respond(function(method, url, data, headers){ return [200, updateDevice(data), {}]; });

  var updateDevice = function(data) {
    data = angular.fromJson(data);

    var resource;
    if(data.id == '1') resource = light;
    if(data.id == '2') resource = lock;
    if(data.id == '3') resource = thermostat;
    if(data.id == '4') resource = alarmClock;
    if(data.id == '5') resource = camera;

    resource.updated_at = new Date();
    _.each(data.properties, function(property) {
      var result = _.find(resource.properties, function(_property){ return _property.id == property.id; });
      result.expected = result.value = property.value;
    });
    return resource;
  }

  /* Pass through */

  $httpBackend.whenGET(/partials/).passThrough();
  $httpBackend.whenGET(/templates/).passThrough();
}]);
