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
      when('/users/new', {
        templateUrl: 'partials/users-new.html',
        controller: 'UserJobsController'
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


app.directive('nxEqualEx', function() {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            if (!attrs.nxEqualEx) {
                console.error('nxEqualEx expects a model as an argument!');
                return;
            }
            scope.$watch(attrs.nxEqualEx, function (value) {
                // Only compare values if the second ctrl has a value.
                if (model.$viewValue !== undefined && model.$viewValue !== '') {
                    model.$setValidity('nxEqualEx', value === model.$viewValue);
                }
            });
            model.$parsers.push(function (value) {
                // Mute the nxEqual error if the second ctrl is empty.
                if (value === undefined || value === '') {
                    model.$setValidity('nxEqualEx', true);
                    return value;
                }
                var isValid = value === scope.$eval(attrs.nxEqualEx);
                model.$setValidity('nxEqualEx', isValid);
                return isValid ? value : undefined;
            });
        }
    };
});

})();
