'use strict';

describe('dashboard create', function() {

  var page = '/mocks/index.html';

  describe('when authenticated', function() {

    var fragment = '#access_token=token&token_type=bearer&expires_in=7200&state=state5c6007a2/mocks/index.html';

    beforeEach(function() { browser().navigateTo(page + fragment); });
    beforeEach(function() { element('.sidebar-nav .create').click(); });

    it('shows the create form', function() {
      expect(element('.new-view .title').text()).toMatch('Create type');
    });

    describe('when creates a type', function() {

      beforeEach(function() { input('type.name').enter('Name') });
      beforeEach(function() { input('type.description').enter('Description') });
      beforeEach(function() { element('.new-view .create').click(); });

      it('shows the created type', function() {
        expect(element('.type-component .name').text()).toMatch('Basic Light');
      });

      it('activates "yours" menu item', function() {
        expect(element('.sidebar-nav .active').text()).toMatch('Yours');
      });
    });
  });

  describe('when not authenticated', function() {

    beforeEach(function() { browser().navigateTo(page); });
    beforeEach(function() { element('.sidebar-nav .create').click(); });

    it('shows the unauthorized message', function() {
      expect(element('.new-view .authorization').css('display')).toBe('block');
    });
  });
});
