'use strict';

app.factory('Feedback',function ($firebaseObject, $firebaseArray, FIREBASE_URL, $rootScope, Auth,AuthCollege) {
  var ref = new Firebase(FIREBASE_URL + 'profileForCollege' + '/');
  var ref1  = new Firebase(FIREBASE_URL);
  var collegeObj = $firebaseObject(ref);
  var collegeArray = $firebaseArray(ref);
  var Feedback = {

    all: collegeObj,
    allAsArray: collegeArray,

    getPreviousFeedbackOfStudents : function (studentURL, collegeURL,$scope) {
      var previousFeedbackRef = new Firebase(FIREBASE_URL + 'studentFeedback/' + studentURL + '/'+ collegeURL );
      $scope.studentFeeback = $firebaseObject(previousFeedbackRef);
      $scope.$evalAsync();
    },

    writeFeedbackForStudent: function (studentQuery, firstAnswer, secondAnswer, thirdAnswer, sessionDate, collegeURL, studentURL) {
      var feedbackRef = new Firebase(FIREBASE_URL + 'studentFeedback/' + studentURL + '/'+ collegeURL + '/');
      var feedbackObject = $firebaseObject(feedbackRef);
      feedbackObject.studentquery = studentQuery;
      feedbackObject.firstAnswer = firstAnswer;
      feedbackObject.secondAnswer = secondAnswer;
      feedbackObject.thirdAnswer = thirdAnswer;
      feedbackObject.sessiondate = sessionDate;
      feedbackObject.$save().then(function(ref) {
      }, function(error) {
        console.log("Error:", error);
      });                   
    },
  };      
  return Feedback;      
});      
