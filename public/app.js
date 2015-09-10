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
      when('/jobs/new_form', {
        templateUrl: 'partials/job-new.html',
        controller: 'JobNewController'
      }).
      when('/jobs/:jobId', {
        templateUrl: 'partials/job-detail.html',
        controller: 'JobDetailController'
      }).

      when('/users/:user_id/jobs', {
        templateUrl: 'partials/job-list.html',
        controller: 'UserJobsController'
      }).
      when('/users/:user_id/tenders', {
        templateUrl: 'partials/tenders-list.html',
        controller: 'UserTendersController'
      }).
      otherwise({
        redirectTo: '/jobs'
      });
  }]);


})();
