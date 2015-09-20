var getTradieServices = angular.module('getTradieServices', ['ngResource','ngCookies']);

getTradieServices.factory('Job', ['$resource',
  function($resource){
    return $resource('jobs/:job_id.json');
  }]);

getTradieServices.factory('User', ['$resource',
  function($resource){
    return $resource('users/:user_id.json', {user_id:'@user_id'},
      {
        'update': { method:'PUT' }
      });
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


getTradieServices.factory( 'AuthService', ['$cookies', '$resource', 
  function($cookies, $resource){
    var currentUser;
    return {
    login: function(email, password, logged) {
      var Session = $resource('/sessions/:sessionId');
      var currentSession = new Session({email:email, password:password})
      currentUser = currentSession.$save(function()
        {
          $cookies.put("currentUser", "isLoggedIn"); 
          logged();                                         
        });      
    },
    logout: function(){
      //Logout work with $http
      currentUser = undefined
      $cookies.put("currentUser", currentUser);

    },
    isLoggedIn: function(){
      currentUser = $cookies.get('currentUser');
      console.log(currentUser);
      return currentUser !== undefined
    }
  }
  }]);

  