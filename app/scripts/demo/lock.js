'use strict';

var lock = {
  uri: 'http://api.lelylan.com/devices/2',
  id: '2',
  name: 'Connected Lock',
  type: { uri: 'http://api.lelylan.com/types/2', id: '2' },
  physical: { uri: 'http://arduino.house.com/2' },
  pending: false,
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1', value: 'close', expected: 'close', pending: false,
    suggested: {'open': 'Open', 'close': 'Close'}
  }],
  creator_id: '1',
  owner_id: '1',
  created_at: '2012-09-01T16:00:32Z',
  updated_at: '2013-04-10T16:19:20Z',
  updated_from: { uri: 'http://api.lelylan.com/users/1', name: 'Lelylan Demo' }
};

var lockType = {
  uri: 'http://api.lelylan.com/types/2',
  id: '2',
  name: 'Lock',
  created_at: '2012-09-01T15:01:22Z',
  updated_at: '2012-09-01T15:01:22Z',
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1',
    name: 'Status',
    default: 'close',
    suggested: {'open': 'Open', 'close': 'Closed'},
    type: 'text'
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
  }],
  statuses: [{
    uri: 'http://api.lelylan.com/statuses/1',
    id: '1',
    name: 'The lock is open',
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
    name: 'The lock is closed',
    function: { uri: 'http://api.lelylan.com/functions/1', id: '1' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      values: ['close'],
      pending: null,
    }]
  }]
};
