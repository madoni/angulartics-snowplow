/**
 * Tests for the Snowplow plugin for the Angulartics project
 *
 * Tests are run by calling methods and inspecting what gets pushed into either
 * the ga.q array or the _gaq array
 *
 */
describe('angulartics-snowplow', function () {
	'use strict';

	var analytics,
        window,
        location,
        rootScope;

	describe('universal analytics', function () {

		/*
		 * Mocks our $window w/ Universal Analytics installed
		 */
		beforeEach(module(function ($provide) {

            var windowMock = {
                document: [{
                    title: 'test page'
                }]
            };

            windowMock.snowplow = function () {
                // console.log([].join.apply(arguments));
                (windowMock.snowplow.q = windowMock.snowplow.q || []).push(arguments)
            };

            $provide.value('$window', windowMock);

        }));
		beforeEach(module('angulartics'));
		beforeEach(module('angulartics.snowplow'));

		beforeEach(inject(function (_$analytics_, _$window_, _$location_, _$rootScope_) {

				analytics = _$analytics_;
				window = _$window_;
				location = _$location_;
				rootScope = _$rootScope_;

				location.path('/abc');
				rootScope.$emit('$routeChangeSuccess');
				rootScope.$apply();

			}));

		/*
		 * Tests auto-pageview functionality
		 */
		it('should track a pageview', function (done) {
			var cmd = window.snowplow.q.pop();
			var cmdName = cmd[0];
			var pagename = cmd[1];

			expect(cmdName).toEqual('trackPageView');
			expect(pagename).toEqual('test page');

			done();

		});

		/*
		 * Tests pageview functionality
		 */
		xit('should track a pageview', function (done) {
			analytics.pageTrack('/efg');

			var cmd = window.snowplow.q.pop();
			var cmdName = cmd[0];
			var opts = cmd[1];

			expect(cmdName).toEqual('send');
			expect(opts.page).toEqual('/efg');
			expect(opts.hitType).toEqual('pageview');

			done();

		});

		xit('should track an event', function (done) {
			analytics.eventTrack('foo', {
				category: 'bar',
				label: 'baz',
				value: 1,
				nonInteraction: true,
				hitCallback: function () {
					return 'biz'
				}
			});

			var cmd = window.snowplow.q.pop();
			var cmdName = cmd[0];
			var opts = cmd[1];

			expect(cmdName).toEqual('send');
			expect(opts.page).toEqual('/abc');
			expect(opts.hitType).toEqual('event');
			expect(opts.eventCategory).toEqual('bar');
			expect(opts.eventAction).toEqual('foo');
			expect(opts.eventLabel).toEqual('baz');
			expect(opts.eventValue).toEqual(1);
			expect(opts.nonInteraction).toEqual(true);
			expect(opts.hitCallback()).toEqual('biz');

			done();

		});

	});

});