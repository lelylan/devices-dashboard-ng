var app = angular.module('app', ['lelylan.dashboards.device', 'ngMockE2E']);


/* Mocks definition */

app.run(function($httpBackend, $timeout, Profile) {

  // Device names
  names = ['light', 'lock', 'thermostat', 'alarm-clock'];

  // Preset the logged user
  Profile.set({id: '1'});

  // Jasmin configurations
  jasmine.getFixtures().fixturesPath = 'spec/fixtures';

  // Pass through requests
  $httpBackend.when('GET', /views/).passThrough();

  // Shared resources
  devices = JSON.parse(readFixtures('devices.json'));
  categories = JSON.parse(readFixtures('categories.json'));
  privates = JSON.parse(readFixtures('privates.json'));
  $httpBackend.whenGET('http://api.lelylan.com/devices').respond(devices);
  $httpBackend.whenGET('http://api.lelylan.com/categories').respond(categories);

  // Device Mocks
  _.each(devices, function(device, index) {
    var id   = index + 1;
    var name = names[index];

    type = JSON.parse(readFixtures(name + '-type.json'));
    $httpBackend.whenPUT('http://api.lelylan.com/devices/' + id).respond(function(method, url, data, headers) { return [200, updateDevice(data, device), {}]; });
    $httpBackend.whenPUT('http://api.lelylan.com/devices/' + id + '/properties').respond(function(method, url, data, headers) { return [200,  updateDeviceProperties(data, device), {}]; });
    $httpBackend.whenGET('http://api.lelylan.com/types/' + id).respond(type);
    $httpBackend.whenGET('http://api.lelylan.com/devices/' + id + '/privates').respond(privates);
    $httpBackend.whenDELETE('http://api.lelylan.com/devices/' + id).respond(device);
  })

  // Device update
  var updateDevice = function(data, device) {
    data = angular.fromJson(data);
    device.updated_at   = new Date();
    device.name         = data.name;
    device.physical.uri = data.physical.uri;
    console.log(device)
    return device;
  }

  // Device properties update
  var updateDeviceProperties = function(data, device) {
    data = angular.fromJson(data);
    device.updated_at = new Date();
    _.each(data.properties, function(property) {
      var result = _.find(device.properties, function(_property) { return _property.id == property.id; } );
      result.expected = result.value = property.expected; });
    return device;
  }
});
