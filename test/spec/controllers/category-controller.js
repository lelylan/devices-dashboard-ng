'use strict';

describe('dashboard category', function() {

  var page  = '/mocks/index.html';
  beforeEach(function() { browser().navigateTo(page); });

  describe('when the category has items', function() {

    beforeEach(function() { element('.sidebar-nav .lights').click(); });

    it('shows the devices', function() {
      expect(element('.sidebar-nav .active').text()).toMatch('Lights');
      expect(element('.types').text()).toMatch(/Basic Light/);
      expect(repeater('.type').count()).toBe(1);
    });
  });

  describe('when the category has no items', function() {

    beforeEach(function() { element('.sidebar-nav .locks').click(); });

    it('shows the empty message', function() {
      expect(element('.sidebar-nav .active').text()).toMatch('Locks');
      expect(repeater('.type').count()).toBe(0);
      expect(element('.types-view .authorization').css('display')).toBe('none');
      expect(element('.types-view .loading').css('display')).toBe('none');
      expect(element('.types-view .empty').css('display')).toBe('block');
    });
  });
});
