'use strict';

var meter = {
  uri: 'http://api.lelylan.com/devices/7',
  id: '7',
  name: 'Connected Meter',
  categories: ['meters'],
  type: { uri: 'http://api.lelylan.com/types/7', id: '7' },
  physical: { uri: 'http://arduino.house.com/7' },
  pending: false,
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1', value: 'on', expected: 'on', pending: false,
    suggested: {'on': 'On', 'off': 'Off'}
  }, {
    uri: 'http://api.lelylan.com/properties/2',
    id: '2', value: '230.95', expected: '230.95', pending: false,
    suggested: {}
  }, {
    uri: 'http://api.lelylan.com/properties/3',
    id: '3', value: '0.26', expected: '0.26', pending: false,
    suggested: {}
  }, {
    uri: 'http://api.lelylan.com/properties/4',
    id: '4', value: '3', expected: '3', pending: false,
    suggested: {}
  }, {
    uri: 'http://api.lelylan.com/properties/5',
    id: '5', value: 'under', expected: 'under', pending: false,
    suggested: {}
  }],
  creator_id: '1',
  owner_id: '1',
  created_at: '2012-09-01T16:00:32Z',
  updated_at: '2013-04-10T16:19:20Z',
  updated_from: { uri: 'http://api.lelylan.com/users/1', name: 'Lelylan Demo' }
};

var meterType = {
  uri: 'http://api.lelylan.com/types/1',
  id: '1',
  name: 'Meter',
  created_at: '2012-09-01T15:01:22Z',
  updated_at: '2012-09-01T15:01:22Z',
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1',
    name: 'Status',
    default: 'off',
    suggested: {'on': 'On', 'off': 'Off'},
    type: 'text'
  }, {
    uri: 'http://api.lelylan.com/properties/2',
    id: '2',
    name: 'Cumulative Consumption (kWh)',
    default: '0',
    suggested: {},
    type: 'text',
  }, {
    uri: 'http://api.lelylan.com/properties/3',
    id: '3',
    name: 'Instantaneous Consumption (kWh)',
    default: '0',
    suggested: {},
    type: 'text'
  }, {
    uri: 'http://api.lelylan.com/properties/4',
    id: '4',
    name: 'Capacity (kWh)',
    default: '3',
    suggested: {},
    type: 'text'
  }, {
    uri: 'http://api.lelylan.com/properties/5',
    id: '5',
    name: 'Capacity State',
    default: 'under',
    suggested: {'under': 'Under capacity', 'alert': 'Close to capacity limit', 'over': 'Over capacity'},
    type: 'text'
  }],
  functions: [{
    uri: 'http://api.lelylan.com/functions/1',
    id: '1',
    name: 'Power On',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'on'
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/2',
    id: '2',
    name: 'Power Off',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'off'
    }]
  }],
  statuses: [{
    uri: 'http://api.lelylan.com/statuses/1',
    id: '1',
    name: 'The meter is on',
    function: { uri: 'http://api.lelylan.com/functions/2', id: '2' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      values: ['on'],
      pending: null,
    }]
  }, {
    uri: 'http://api.lelylan.com/statuses/2',
    id: '2',
    name: 'The meter is off',
    function: { uri: 'http://api.lelylan.com/functions/1', id: '1' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      values: ['off'],
      pending: null,
    }]
  }]
};
