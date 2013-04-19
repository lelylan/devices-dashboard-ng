'use strict';

var test = angular.module('demo', ['lelylan.dashboards.devices.demo', 'ngMockE2E']);

test.run(['$httpBackend', 'LoggedUser', 'AccessToken',
  function($httpBackend, LoggedUser, AccessToken) {

  /* Fake user */

  AccessToken.set({ access_token: 1 })
  LoggedUser.set({ id: 1, name: 'try@lelylan.com' });
  $httpBackend.whenGET('http://api.lelylan.com/me').respond({ id: 1, email: 'try@lelylan.com' });


  /* Device List */

  var devices = [
    light,
    lock,
    thermostat,
    clock,
    camera,
    alarm,
    meter,
    shutter,
    sprinkler,
    kettle
  ];

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
  $httpBackend.whenDELETE('http://api.lelylan.com/devices/4').respond(clock);
  $httpBackend.whenGET('http://api.lelylan.com/devices/4').respond(clock);
  $httpBackend.whenGET('http://api.lelylan.com/types/4').respond(clockType);

  // Camera
  $httpBackend.whenDELETE('http://api.lelylan.com/devices/5').respond(camera);
  $httpBackend.whenGET('http://api.lelylan.com/devices/5').respond(camera);
  $httpBackend.whenGET('http://api.lelylan.com/types/5').respond(cameraType);

  // Alarm
  $httpBackend.whenDELETE('http://api.lelylan.com/devices/6').respond(alarm);
  $httpBackend.whenGET('http://api.lelylan.com/devices/6').respond(alarm);
  $httpBackend.whenGET('http://api.lelylan.com/types/6').respond(alarmType);

  // Meter
  $httpBackend.whenDELETE('http://api.lelylan.com/devices/7').respond(meter);
  $httpBackend.whenGET('http://api.lelylan.com/devices/7').respond(meter);
  $httpBackend.whenGET('http://api.lelylan.com/types/7').respond(meterType);

  // Rolling Shutter
  $httpBackend.whenDELETE('http://api.lelylan.com/devices/8').respond(shutter);
  $httpBackend.whenGET('http://api.lelylan.com/devices/8').respond(shutter);
  $httpBackend.whenGET('http://api.lelylan.com/types/8').respond(shutterType);

  // Sprinkler system
  $httpBackend.whenDELETE('http://api.lelylan.com/devices/9').respond(sprinkler);
  $httpBackend.whenGET('http://api.lelylan.com/devices/9').respond(sprinkler);
  $httpBackend.whenGET('http://api.lelylan.com/types/9').respond(sprinklerType);

  // Kettle
  $httpBackend.whenDELETE('http://api.lelylan.com/devices/10').respond(kettle);
  $httpBackend.whenGET('http://api.lelylan.com/devices/10').respond(kettle);
  $httpBackend.whenGET('http://api.lelylan.com/types/10').respond(kettleType);


  // Devices request
  $httpBackend.whenGET('http://api.lelylan.com/devices?per=100')
    .respond(function(method, url, data, headers){ return [200, updateDevices(), {}]; });

  var updateDevices = function() {
    return _.map(devices, function(device) { device.updated_at = new Date(); return device; })
  }

  /* Devices Update */

  $httpBackend.whenPUT(/http:\/\/api.lelylan.com\/devices/)
    .respond(function(method, url, data, headers){ return [200, updateDevice(data), {}]; });

  var updateDevice = function(data) {
    data = angular.fromJson(data);

    var resource;
    if(data.id == '1')  resource = light;
    if(data.id == '2')  resource = lock;
    if(data.id == '3')  resource = thermostat;
    if(data.id == '4')  resource = clock;
    if(data.id == '5')  resource = camera;
    if(data.id == '6')  resource = alarm;
    if(data.id == '7')  resource = meter;
    if(data.id == '8')  resource = shutter;
    if(data.id == '9')  resource = sprinkler;
    if(data.id == '10') resource = kettle;

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
