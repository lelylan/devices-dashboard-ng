'use strict';

var alarm = {
  uri: 'http://api.lelylan.com/devices/6',
  id: '6',
  name: 'Connected Alarm System',
  type: { uri: 'http://api.lelylan.com/types/6', id: '6' },
  categories: ['alarms'],
  physical: { uri: 'http://arduino.house.com/6' },
  pending: false,
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1', value: 'off', expected: 'off', pending: false,
    suggested: {'on': 'On', 'off': 'Off'}
  }, {
    uri: 'http://api.lelylan.com/properties/2',
    id: '2', value: 'off', expected: 'off', pending: false,
    suggested: {'on': 'Alarm On', 'off': 'Alarm Off'}
  }, {
    uri: 'http://api.lelylan.com/properties/3',
    id: '3', value: 'secure', expected: 'secure', pending: false,
    suggested: {}
  }, {
    uri: 'http://api.lelylan.com/properties/4',
    id: '4', value: '', expected: '', pending: false,
    suggested: {}
  }],
  creator_id: '1',
  owner_id: '1',
  created_at: '2012-09-01T16:00:32Z',
  updated_at: '2013-04-10T16:19:20Z',
  updated_from: { uri: 'http://api.lelylan.com/users/1', name: 'Lelylan Demo' }
};

var alarmType = {
  uri: 'http://api.lelylan.com/types/6',
  id: '6',
  name: 'Alarm Syste,',
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
    name: 'Mode',
    default: 'off',
    suggested: {'on': 'Active', 'off': 'Deactivated'},
    type: 'text'
  }, {
    uri: 'http://api.lelylan.com/properties/3',
    id: '3',
    name: 'Alert Level',
    default: 'secure',
    suggested: {'secure': 'Secure', 'violated': 'Violated'},
    type: 'text'
  }, {
    uri: 'http://api.lelylan.com/properties/4',
    id: '4',
    name: 'Secret Code',
    default: '',
    suggested: {},
    type: 'password'
  }],
  functions: [{
    uri: 'http://api.lelylan.com/functions/1',
    id: '1',
    name: 'Activate Alarm',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'on'
    }, {
      uri: 'http://api.lelylan.com/properties/2',
      id: '2',
      value: 'on'
    }, {
      uri: 'http://api.lelylan.com/properties/4',
      id: '4',
      value: null
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/2',
    id: '2',
    name: 'Deactivate Alarm',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'on'
    }, {
      uri: 'http://api.lelylan.com/properties/2',
      id: '2',
      value: 'off'
    }, {
      uri: 'http://api.lelylan.com/properties/4',
      id: '4',
      value: null
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/3',
    id: '3',
    name: 'Power On',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'on'
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/4',
    id: '4',
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
    name: 'The alarm is on',
    function: { uri: 'http://api.lelylan.com/functions/2', id: '2' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/2',
      id: '2',
      values: ['on'],
      pending: null,
    }]
  }, {
    uri: 'http://api.lelylan.com/statuses/2',
    id: '2',
    name: 'The alarm is off',
    function: { uri: 'http://api.lelylan.com/functions/1', id: '1' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/2',
      id: '2',
      values: ['off'],
      pending: null,
    }]
  }]
};
