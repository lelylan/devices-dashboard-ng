'use strict';

describe('dashboard home', function() {

  var page  = '/mocks/index.html';

  beforeEach(function() {
    browser().navigateTo(page);
  });

  it('shows the introduction page', function() {
    expect(element('.home .title').text()).toMatch('Lelylan Types');
  });

  describe('when clicks the search button', function() {

    beforeEach(function() { element('.home .search').click(); });

    it('shows the popular page', function() {
      expect(element('.sidebar-nav .active').text()).toMatch('Popular');
    });
  });

  describe('when clicks the create button', function() {

    beforeEach(function() { element('.home .create').click(); });

    it('shows the create page', function() {
      expect(element('.sidebar-nav .active').text()).toMatch('Create type');
    });
  });

  describe('when clicks the home button', function() {

    beforeEach(function() { element('.home .create').click(); });
    beforeEach(function() { element('.navbar .home').click(); });

    it('removes the highlight from any menu item', function() {
      expect(repeater('.sidebar-nav li.active').count()).toBe(0);
    });
  });
});
