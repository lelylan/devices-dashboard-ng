'use strict';

var rollingShutter = {
  uri: 'http://api.lelylan.com/devices/8',
  id: '8',
  name: 'Connected Rolling Shutter',
  type: { uri: 'http://api.lelylan.com/types/8', id: '8' },
  physical: { uri: 'http://arduino.house.com/8' },
  pending: false,
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1', value: 'stop', expected: 'stop', pending: false,
    suggested: {'open': 'Open', 'close': 'Close', 'stop': 'Stop'}
  }, {
    uri: 'http://api.lelylan.com/properties/2',
    id: '2', value: '0', expected: '0', pending: false,
    suggested: {}
  }],
  creator_id: '1',
  owner_id: '1',
  created_at: '2012-09-01T16:00:32Z',
  updated_at: '2013-04-10T16:19:20Z',
  updated_from: { uri: 'http://api.lelylan.com/users/1', name: 'Lelylan Demo' }
};

var rollingShutterType = {
  uri: 'http://api.lelylan.com/types/8',
  id: '8',
  name: 'Rolling Shutter',
  created_at: '2012-09-01T15:01:22Z',
  updated_at: '2012-09-01T15:01:22Z',
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1',
    name: 'Activity',
    default: 'stop',
    suggested: {'open': 'Opening', 'close': 'Closing', 'stop': 'Stop'},
    type: 'text'
  }, {
    uri: 'http://api.lelylan.com/properties/2',
    id: '2',
    name: 'Aperture',
    default: '0',
    suggested: {},
    type: 'range',
    range: { min: 0, max: 100, step: 1 }
  }],
  functions: [{
    uri: 'http://api.lelylan.com/functions/1',
    id: '1',
    name: 'Open',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'open'
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/2',
    id: '2',
    name: 'Close',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'close'
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/3',
    id: '3',
    name: 'Stop',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'stop'
    }]
  }],
  statuses: [{
    uri: 'http://api.lelylan.com/statuses/1',
    id: '1',
    name: 'The rolling shutter is opening',
    function: { uri: 'http://api.lelylan.com/functions/2', id: '2' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      values: ['open'],
      pending: null,
    }]
  }, {
    uri: 'http://api.lelylan.com/statuses/2',
    id: '2',
    name: 'The rolling shutter is closing',
    function: { uri: 'http://api.lelylan.com/functions/1', id: '1' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      values: ['close'],
      pending: null,
    }]
  }, {
    uri: 'http://api.lelylan.com/statuses/3',
    id: '3',
    name: 'The rolling shutter is stopped',
    function: { uri: 'http://api.lelylan.com/functions/1', id: '1' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      values: ['stop'],
      pending: null,
    }]
  }]
};
