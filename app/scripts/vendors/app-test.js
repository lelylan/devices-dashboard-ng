/* Mocks definition */

app.run(['$httpBackend', '$timeout', 'ENV', 'Profile', function($httpBackend, $timeout, ENV, Profile) {

  // Device names
  var names = ['light', 'lock', 'thermostat', 'alarm-clock'];

  // Preset the logged user
  Profile.set({id: '1'});

  // Jasmin configurations
  jasmine.getFixtures().fixturesPath = 'spec/fixtures';

  // Pass through requests
  $httpBackend.when('GET', /views/).passThrough();

  // Shared resources
  var devices = JSON.parse(readFixtures('devices.json'));
  //var devices = JSON.parse(readFixtures('devices-empty.json'));
  var categories = JSON.parse(readFixtures('categories.json'));
  var privates = JSON.parse(readFixtures('privates.json'));
  var me = JSON.parse(readFixtures('me.json'));

  $httpBackend.whenGET(ENV.endpoint + '/devices').respond(devices);
  $httpBackend.whenGET(ENV.endpoint + '/categories').respond(categories);
  $httpBackend.whenPOST(ENV.endpoint + '/devices').respond(devices[0]);
  $httpBackend.whenGET(ENV.endpoint + '/me').respond(me);


  // Device Mocks
  _.each(devices, function(device, index) {
    var id   = index + 1;
    var name = names[index];

    type = JSON.parse(readFixtures(name + '-type.json'));
    $httpBackend.whenPUT(ENV.endpoint + '/devices/' + id).respond(function(method, url, data, headers) { return [200, updateDevice(data, device), {}]; });
    $httpBackend.whenPUT(ENV.endpoint + '/devices/' + id + '/properties').respond(function(method, url, data, headers) { return [200,  updateDeviceProperties(data, device), {}]; });
    $httpBackend.whenGET(ENV.endpoint + '/types/' + id).respond(type);
    $httpBackend.whenGET(ENV.endpoint + '/devices/' + id + '/privates').respond(privates);
    $httpBackend.whenDELETE(ENV.endpoint + '/devices/' + id).respond(device);
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
}]);
