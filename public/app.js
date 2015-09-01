'use strict';

(function () {
var app=angular.module('myApp', [
  'ngRoute',
  'getTradiesControllers',
  'getTradieServices'
  ]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/jobs', {
        templateUrl: 'partials/job-list.html',
        controller: 'JobController'
      }).
      when('/jobs/:jobId', {
        templateUrl: 'partials/job-detail.html',
        controller: 'JobDetailController'
      }).
      otherwise({
        redirectTo: '/jobs'
      });
  }]);


})();
