var getTradieServices = angular.module('getTradieServices', ['ngResource']);

getTradieServices.factory('Job', ['$resource',
  function($resource){
    return $resource('jobs/:job_id.json');
  }]);

getTradieServices.factory('User', ['$resource',
  function($resource){
    return $resource('users/:user_id.json');
  }]);

getTradieServices.factory('JobTenders', ['$resource',
  function($resource){
    return $resource('jobs/:job_id/tenders/:tender_id.json', {job_id:'@job_id', tender_id:'@tender_id'},
      {
        'update': { method:'PUT' }
      });
  }]);

getTradieServices.factory('UserJobs', ['$resource',
  function($resource){
    return $resource('users/:user_id/jobs/:job_id.json');
  }]);
getTradieServices.factory('UserTenders', ['$resource',
  function($resource){
    return $resource('users/:user_id/tenders/:tender_id.json');
  }]);
