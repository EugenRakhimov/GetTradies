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
      var Session = $resource('/sessions/:sessionId');
      Session.delete({sessionId:"currentId"});
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

getTradieServices.factory('globalErrorInterceptor', ['$q', '$rootScope', '$cookies', '$injector', '$location',
  function ($q, $rootScope, $cookies, $injector, $location) {
    $rootScope.showSpinner = false;
    $rootScope.http = null;
    return {
      'response': function (response) {
        return response || $q.when(response)
      },
      'responseError': function (rejection) {
        switch (rejection.status) {
          case 401:
            $cookies.put('currentUser', undefined)
            // TODO: think about alerts
            // Alert.add("warning", 'You must be logged in to perform that action', 1400 )
            break;
          case 404:
            // Alert.add("danger", 'The requested resource couldn\'t be located', 1400 )
            break;
          case 422:
            var validationErrors = [];
            angular.forEach(rejection.data.errors, function(value, key){
              validationErrors.push(key + " " +  value.join(', '))
            });
            console.log(validationErrors.join(', ') )
            // Alert.add('danger', validationErrors.join(', ') )
            break;
          case 500:
            // Alert.add("danger",'Server internal error: ' + rejection.data)
            break;
        }
        return $q.reject(rejection);
      }
    }
  }
]);

getTradieServices.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('globalErrorInterceptor');
}]);