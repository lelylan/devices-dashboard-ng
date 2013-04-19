'use strict';

var thermostat = {
  uri: 'http://api.lelylan.com/devices/3',
  id: '3',
  name: 'Connected Thermostat',
  type: { uri: 'http://api.lelylan.com/types/3', id: '3' },
  physical: { uri: 'http://arduino.house.com/3' },
  pending: false,
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1', value: 'off', expected: 'off', pending: false,
    suggested: {'on': 'On', 'off': 'Off'}
  }, {
    uri: 'http://api.lelylan.com/properties/2',
    id: '2', value: 'pause', expected: 'pause', pending: false,
    suggested: {}
  }, {
    uri: 'http://api.lelylan.com/properties/3',
    id: '3', value: '18', expected: '18', pending: false,
    suggested: {}
  }, {
    uri: 'http://api.lelylan.com/properties/4',
    id: '4', value: '1', expected: '1', pending: false,
    suggested: {}
  }, {
    uri: 'http://api.lelylan.com/properties/5',
    id: '5', value: 'c', expected: 'c', pending: false,
    suggested: {}
  }],
  creator_id: '1',
  owner_id: '1',
  created_at: '2012-09-01T16:00:32Z',
  updated_at: '2013-04-10T16:19:20Z',
  updated_from: { uri: 'http://api.lelylan.com/users/1', name: 'Lelylan Demo' }
};

var ThermostatType = {
  uri: 'http://api.lelylan.com/types/3',
  id: '3',
  name: 'Thermostat',
  created_at: '2012-09-01T15:01:22Z',
  updated_at: '2012-09-01T15:01:22Z',
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1',
    name: 'Status',
    default: 'off',
    suggested: {'on': 'On', 'off': 'Off'},
    type: 'string'
  }, {
    uri: 'http://api.lelylan.com/properties/2',
    id: '2',
    name: 'Activity',
    default: 'pause',
    suggested: {'pause': 'Pause', 'warm': 'Warming', 'cool': 'Cooling'},
    type: 'string'
  }, {
    uri: 'http://api.lelylan.com/properties/3',
    id: '3',
    name: 'Temperature',
    default: '18',
    suggested: {},
    type: 'range',
    range: { min: 0, max: 50, step: 0.5 }
  }, {
    uri: 'http://api.lelylan.com/properties/4',
    id: '4',
    name: 'Speed',
    default: '1.0',
    suggested: {},
    type: 'range',
    range: { min: 0, max: 10, step: 1 }
  }, {
    uri: 'http://api.lelylan.com/properties/5',
    id: '5',
    name: 'Unit',
    default: 'c',
    suggested: {'c': 'Celsius (ºC)', 'warm': '(ºF)', 'cool': 'Cooling'},
    type: 'string'
  }],
  functions: [{
    uri: 'http://api.lelylan.com/functions/1',
    id: '1',
    name: 'Warming mode',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'on'
    }, {
      uri: 'http://api.lelylan.com/properties/2',
      id: '2',
      value: 'warm'
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/2',
    id: '2',
    name: 'Cooling mode',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'on'
    }, {
      uri: 'http://api.lelylan.com/properties/2',
      id: '2',
      value: 'cool'
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/3',
    id: '3',
    name: 'Set Temperature',
    properties: [{
      uri: 'http://api.lelylan.com/properties/3',
      id: '3',
      value: null
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/4',
    id: '4',
    name: 'Set Speed',
    properties: [{
      uri: 'http://api.lelylan.com/properties/4',
      id: '4',
      value: null
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/5',
    id: '5',
    name: 'Pause',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'on'
    }, {
      uri: 'http://api.lelylan.com/properties/2',
      id: '2',
      value: 'pause'
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/6',
    id: '6',
    name: 'Turn On',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'on'
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/7',
    id: '7',
    name: 'Turn Off',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'off'
    }]
  }],
  statuses: [{
    uri: 'http://api.lelylan.com/statuses/1',
    id: '1',
    name: 'The thermostat is on',
    function: { uri: 'http://api.lelylan.com/functions/7', id: '7' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      values: ['on'],
      pending: null,
    }]
  }, {
    uri: 'http://api.lelylan.com/statuses/2',
    id: '2',
    name: 'The thermostat is off',
    function: { uri: 'http://api.lelylan.com/functions/6', id: '6' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      values: ['off'],
      pending: null,
    }]
  }]
};
