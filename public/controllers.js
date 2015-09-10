
(function () {
var getTradiesControllers = angular.module('getTradiesControllers', [])

getTradiesControllers.controller('JobController', ['$scope', '$routeParams','Job', function ($scope,$routeParams, Job)
{

 $scope.jobs = Job.query(function() { console.log($scope.jobs)});
 $scope.deleteJob = function(job_id) {
  console.log("job_id" +job_id)
  Job.delete({job_id:job_id});
  $scope.jobs = Job.query(function() { console.log($scope.jobs)});
 }

}]);

getTradiesControllers.controller('JobDetailController', ['$scope','$routeParams', 'Job', function ($scope, $routeParams, Job){
   console.log($routeParams.jobId)
   $scope.job = Job.get({ job_id: $routeParams.jobId }, function(job) {
    console.log($scope.job);
  }); // get() returns a single entry
}]);

getTradiesControllers.controller('JobNewController', ['$scope','$routeParams', 'Job', '$location', function ($scope, $routeParams, Job, $location){

$scope.update=function(job) {
  job_to_s=new Job(job)
  job_to_s.$save(function(){
    console.log("it should redirect");
    $location.path('/jobs')
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
