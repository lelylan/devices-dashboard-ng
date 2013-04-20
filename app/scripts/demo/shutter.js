'use strict';

var shutter = {
  uri: 'http://api.lelylan.com/devices/8',
  id: '8',
  name: 'Connected Rolling Shutter',
  categories: ['windows'],
  type: { uri: 'http://api.lelylan.com/types/8', id: '8' },
  physical: { uri: 'http://arduino.house.com/8' },
  pending: false,
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1', value: 'halt', expected: 'halt', pending: false,
    suggested: {'open': 'Open', 'close': 'Close', 'halt': 'Halt'}
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

var shutterType = {
  uri: 'http://api.lelylan.com/types/8',
  id: '8',
  name: 'Rolling Shutter',
  created_at: '2012-09-01T15:01:22Z',
  updated_at: '2012-09-01T15:01:22Z',
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1',
    name: 'Activity',
    default: 'halt',
    suggested: {'open': 'Opening', 'close': 'Closing', 'halt': 'Halt'},
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
    name: 'Halt',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      value: 'halt'
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
    name: 'The rolling shutter is halted',
    function: { uri: 'http://api.lelylan.com/functions/1', id: '1' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      values: ['halt'],
      pending: null,
    }]
  }]
};
