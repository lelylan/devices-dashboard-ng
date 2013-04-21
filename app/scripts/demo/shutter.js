'use strict';

var shutter = {
  uri: 'http://api.lelylan.com/devices/8',
  id: '8',
  name: 'Rolling Shutter',
  categories: ['windows'],
  type: { uri: 'http://api.lelylan.com/types/8', id: '8' },
  physical: { uri: 'http://arduino.house.com/8' },
  pending: false,
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1', value: 'on', expected: 'on', pending: false,
    suggested: {'on': 'Power On', 'off': 'Power Off'}
  }, {
    uri: 'http://api.lelylan.com/properties/2',
    id: '2', value: 'idle', expected: 'idle', pending: false,
    suggested: {'open': 'Open', 'close': 'Close', 'idle': 'Idle'}
  }, {
    uri: 'http://api.lelylan.com/properties/3',
    id: '3', value: '0', expected: '0', pending: false,
    suggested: {}
  }],
  creator_id: '1',
  owner_id: '1',
  created_at: '2012-09-01T16:00:32Z',
  updated_at: '2013-04-10T16:19:20Z',
  updated_from: { uri: 'http://api.lelylan.com/users/1', name: 'Lelylan Demo' }
};

var shutterType = {
  uri: 'http://api.lelylan.com/types/8',
  id: '8',
  name: 'Rolling Shutter',
  created_at: '2012-09-01T15:01:22Z',
  updated_at: '2012-09-01T15:01:22Z',
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1',
    name: 'Power',
    default: 'idle',
    suggested: {'on': 'On', 'off': 'Off'},
    type: 'text'
  }, {
    uri: 'http://api.lelylan.com/properties/2',
    id: '2',
    name: 'Status',
    default: 'idle',
    suggested: {'open': 'Opening', 'close': 'Closing', 'idle': 'Idle'},
    type: 'text'
  }, {
    uri: 'http://api.lelylan.com/properties/3',
    id: '3',
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
      uri: 'http://api.lelylan.com/properties/2',
      id: '2',
      value: 'open'
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/2',
    id: '2',
    name: 'Close',
    properties: [{
      uri: 'http://api.lelylan.com/properties/2',
      id: '2',
      value: 'close'
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/3',
    id: '3',
    name: 'Idle',
    properties: [{
      uri: 'http://api.lelylan.com/properties/2',
      id: '2',
      value: 'idle'
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/4',
    id: '4',
    name: 'Power On',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'on'
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/5',
    id: '5',
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
    name: 'Opening',
    function: { uri: 'http://api.lelylan.com/functions/2', id: '2' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/2',
      id: '2',
      values: ['open'],
      pending: null,
    }]
  }, {
    uri: 'http://api.lelylan.com/statuses/2',
    id: '2',
    name: 'Closing',
    function: { uri: 'http://api.lelylan.com/functions/1', id: '1' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/2',
      id: '2',
      values: ['close'],
      pending: null,
    }]
  }, {
    uri: 'http://api.lelylan.com/statuses/3',
    id: '3',
    name: 'Idle',
    function: { uri: 'http://api.lelylan.com/functions/1', id: '1' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/2',
      id: '2',
      values: ['idle'],
      pending: null,
    }]
  }]
};
