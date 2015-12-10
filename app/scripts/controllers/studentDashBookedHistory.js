'use strict';

app.controller('studentDashBookedHistoryCtrl', function ($scope, $location, $sce, $filter, $document, Angularytics, Auth, AuthCollege,Feedback, studentDashBookedHistory, Webinar) {

  $scope.user = Auth.user.profile;
  $scope.userc = AuthCollege.userc;
  $scope.studentDetail = [];

  $scope.toTheTop = function() {
      $document.scrollTopAnimated(0, 2000).then(function() {
    });
  };

                /*++++++++++++++++++++++++++++++++google Event Tracking+++++++++++++++++++++++++++++*/

  $scope.trackEvent = function(catagory,action,label) {
      Angularytics.trackEvent(catagory, action, label);
  };

              /*++++++++++++++++++++++++++++++++google Event Tracking+++++++++++++++++++++++++++++*/

  $scope.getLimitedColleges = function() {
    var studentId = AuthCollege.resolveUser().uid;
    $scope.studentid = studentId;
    $scope.session = [];
    studentDashBookedHistory.getLimitedColleges($scope, $scope.studentid);
  };

  $scope.go = function ( path ) {
    console.log(path);
    $location.path( path );
  };

  $scope.getCollegeDetail = function(collegeId,collegeuid) {
    $scope.collegeDetail = [];
    studentDashBookedHistory.getCollegeDetail(collegeId,collegeuid,$scope);
  }; 

  $scope.getstudentsessionFeedbacks = function(studentid,collegeid){
      Feedback.getPreviousFeedbackOfStudents(studentid,collegeid,$scope);
  }; 

  $scope.createFeedbackForStudent = function ( first, second, third, studentQuery, studenturlId, sessionDate, collegeURL, studentURL ) {
    if(first != null){
      var firstAnswer = first;
    }else{
      var firstAnswer = "No Rating Given";
    }
    if(second != null){
      var secondAnswer = second;
    }else{
      var secondAnswer = "No Rating Given";
    }
    if(third != null){
      var thirdAnswer = third;
    }else{
      var thirdAnswer = "Not responded";
    }
    Feedback.writeFeedbackForStudent(studentQuery, firstAnswer, secondAnswer, thirdAnswer, sessionDate, collegeURL, studentURL);
  };

  
  $scope.showCompletedVideo = [];
  $scope.videoURL = [];
  $scope.watchVedio = function(webinarId,liveStreamURL) {
    var videoId = liveStreamURL.split(".be/")[1];
    var vedioSrc = "https://www.youtube.com/embed/" +  videoId + "?controls=1";
    $scope.videoURL[webinarId] = {src:vedioSrc, title:"Live Video URL"};
    $scope.showCompletedVideo[webinarId] = 'yes';
  };
  
  $scope.stopVedio = function(webinarId) {
    $scope.showCompletedVideo[webinarId] = 'no';
  };

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

  
                                                                    /*webinar*/

  $scope.getStudentsWebinarHistory = function() {
    var studentId = AuthCollege.resolveUser().uid;
    Webinar.getStudentsWebinarHistory(studentId, $scope);
  };


  $scope.getAllCompletedWebinar = function() {
    Webinar.getAllCompletedWebinar($scope);
  };

  $scope.loadMoreCompletedWebinars = function() {
        Webinar.loadMoreCompletedWebinars($scope.webinarNumber,$scope);
  };


  $scope.getCurrentWebinarDetails = function(webinar) {
    $scope.currentWebinar = webinar;
    $scope.$evalAsync();
  };
  
                                                                    /*webinar*/

});
