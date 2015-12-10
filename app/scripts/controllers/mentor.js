'use strict';

app.controller('MentorCtrl', function ($scope, $filter, $window, $document,$timeout, $http, $location, $sce, toaster, AuthMentor, Auth, Blog) {
  $scope.userd = AuthMentor.userd;
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.setActiveTab = function () {
    var path = $location.path();
    if(path === '/mentor-dashboard') {
      $scope.allPostActive = "not-active";
      $scope.mentorDashActive = "active";
      $scope.$evalAsync();
    }
    else if(path === '/all-posts') {
      $scope.allPostActive = "active";
      $scope.mentorDashActive = "not-active";
      $scope.$evalAsync();
    }
  };
  
  $scope.getMentorDetails = function() {
    $scope.mentor = AuthMentor.getMentorDetails();
  };

  $scope.getAuthorDetailAndPost = function() {
    var authoruid = $location.path().split('author-profile/')[1];
    Blog.getAuthorDetailAndPost(authoruid,$scope);
  };

}).value('duScrollOffset', 30);
