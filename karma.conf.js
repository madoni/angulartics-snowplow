module.exports = function(config) {
  'use strict';

  config.set({

    basePath: './',

    frameworks: ["jasmine"],

    files: [
      'components/angular/angular.js',
      'components/angulartics/src/angulartics.js',
      'components/angular-mocks/angular-mocks.js',
      'lib/angulartics-snowplow.js',
      'test/**/*.js'
    ],

    exclude: [
      'src/index.js'
    ],

    autoWatch: true,

    browsers: ['PhantomJS']

  });
};
