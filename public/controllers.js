
(function () {
var getTradiesControllers = angular.module('getTradiesControllers', [])

getTradiesControllers.controller('JobController', ['$scope', '$routeParams','Job', 'JobTenders' , 'AuthService',
  function ($scope,$routeParams, Job, JobTenders, AuthService)
{

 $scope.jobs = Job.query(function() {});
 
 $scope.deleteJob = function(job_id) {
  console.log("job_id" +job_id)
  Job.delete({job_id:job_id});
  $scope.jobs = Job.query(function() {

  });
 }



 $scope.showInterestForJob = function(job_id) {
  tender = new JobTenders({job_id:job_id})
  tender.$save(function()
    {
      console.log("tender created");
    });
  $scope.jobs = Job.query(function() {});
 }

}]);

getTradiesControllers.controller('MenuController', ['$scope','$routeParams', 'AuthService', '$location', function ($scope, $routeParams, AuthService, $location){

  $scope.isLoggedIn = AuthService.isLoggedIn();
  $scope.logout = function()
  {
    console.log("logout");
    AuthService.logout();
  }
  
}]);



getTradiesControllers.controller('JobDetailController', ['$scope','$routeParams', 'Job', 'JobTenders', 
  function ($scope, $routeParams, Job, JobTenders){
   console.log($routeParams.jobId)
   $scope.job = Job.get({ job_id: $routeParams.jobId }, function(job) {
    
  }); // get() returns a single entry

   $scope.acceptTradie =  function (job_id, tender_id) {
     JobTenders.update({job_id:job_id,tender_id:tender_id}, {accepted:true});
      $scope.job = Job.get({ job_id: $routeParams.jobId });
   }
}]);

getTradiesControllers.controller('JobNewController', ['$scope','$routeParams', 'Job', '$location', function ($scope, $routeParams, Job, $location){

$scope.update = function(job) {
  job_to_s = new Job(job)
  job_to_s.$save(function(){
    console.log("it should redirect");
    $location.path('/jobs')
  });
};

}]);

getTradiesControllers.controller('UserNewController', ['$scope','$routeParams', 'User', '$location', function ($scope, $routeParams, User, $location){

  $scope.create=function(user) {     
      user_to_create = new User(user)
      user_to_create.$save(function()
      {
        $scope.user = user_to_create; 
        console.log("it should redirect to user edit page");
        $location.path('/users/'+user_to_create.id+'/edit')
      // }
      });
  };
}]);


getTradiesControllers.controller('SessionNewController', ['$scope','$routeParams', 'AuthService', '$location', function ($scope, $routeParams, AuthService, $location){

  $scope.login = function(user) {
   AuthService.login(user.email, user.password);
   $location.path('/jobs');
  };
  $scope.logout = function()
  { 
    AuthService.logout();
     $location.path('/jobs');
  };
}]);


getTradiesControllers.controller('UserUpdateController', ['$scope','$routeParams', 'User', '$location', function ($scope, $routeParams, User, $location){

  user_json = User.get({ user_id: $routeParams.user_id }, function()
    {;
      $scope.user = user_json.user
      if ($scope.user.profession !== "customer")
      {
        $scope.tradie = true;
      }
      console.log($scope.user)
    });
  
  $scope.update = function(user) {
    console.log(user);
    User.update({user_id:user.id}, user, function(){
      console.log('Profile updated');
      $location.path('/jobs/')
    });
  };
}]);



getTradiesControllers.controller('UserJobsController', ['$scope','$routeParams', 'UserJobs', function ($scope,$routeParams, UserJobs)
{
  console.log($routeParams.user_id)
   $scope.jobs = UserJobs.query({ user_id: $routeParams.user_id }, function() {
    console.log($scope.jobs);
    });
}]);


getTradiesControllers.controller('UserTendersController', ['$scope','$routeParams', 'UserTenders', function ($scope,$routeParams, UserTenders)
{
  console.log($routeParams.user_id)
   $scope.tenders = UserTenders.query({ user_id: $routeParams.user_id }, function() {
    console.log($scope.tenders);
     for(var i=0;i<$scope.tenders.length;i++)
     {

     }
    });
}]);




var jobs=[{title:"dishwasher", description:"dishwasher", location:"Island Bay", id:1, moreLink: "jobs/1", showInterestLink:"/tenders", userJobsLink:"users/1/jobs" },
{title:"boyler", description:"boyler", location:"Quba street", id:1, moreLink: "jobs/2", showInterestLink:"/tenders", userJobsLink:"users/1/jobs" }]
})();
