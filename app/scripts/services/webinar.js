'use strict';
 
app.factory('Webinar',
  function (FIREBASE_URL, $rootScope, $q , $filter, $http, $firebaseObject ,  toaster, $firebaseArray, $window,Auth) {
    var Webinar = {
        getUpcomingWebinarOnMainPage : function($scope) {
            var deferred = $q.defer();
            var  upcomingWebinar = new Firebase(FIREBASE_URL + 'allWebinar/upcomingWebinar/');
            var upcomingWebinarArray = ($firebaseArray(upcomingWebinar));
            deferred.resolve(upcomingWebinarArray);
            return deferred.promise;
        },

        bookWebinar : function($scope,liveStreamURL,mentorName,mentorEmail,mentorMobile,gender,mentorPhoto,webinarTopic,webinarDate,webinarTime,webinarDescription,webinarDuration,webinarAttendees,collegeId,webinarId,studentId) {
            $scope.webinarBooked = "notDone";
            var bookWebinarSync = new Firebase(FIREBASE_URL + 'studentWebinar/bookedWebinar/' + studentId + '/' + webinarId );
            bookWebinarSync.once("value", function(snapshot) {
                var a = snapshot.exists();
                if(a === false) {
                    var liveWebinarRef = new Firebase(FIREBASE_URL + "liveWebinars/" + webinarId);
                    liveWebinarRef.once("value", function(snapshot) {
                        if(snapshot.exists() === true) {
                            var oncomplete = function() {
                                (new Firebase(FIREBASE_URL + 'WebinarWiseRecord/' +  '/' + webinarId + '/' + studentId)).set(studentId);
                                (new Firebase(FIREBASE_URL + 'collegeWebinar/upcomingWebinar/' + collegeId + '/' + webinarId + '/studentsAttending')).set(webinarAttendees+1);
                                (new Firebase(FIREBASE_URL + 'allWebinar/upcomingWebinar/' + webinarId + '/studentsAttending')).set(webinarAttendees+1);
                                $scope.webinar_booking_success[webinarId] = "done";
                                $scope.$evalAsync();
                            };
                            bookWebinarSync.update({ 
                                            mentorName: mentorName,
                                            mentorEmail : mentorEmail,
                                            mentorMobile : mentorMobile,
                                            mentorGender : gender,
                                            mentorPhoto : mentorPhoto,
                                            webinarTopic : webinarTopic,
                                            webinarDate : webinarDate,
                                            webinarTime : webinarTime,
                                            webinarDescription : webinarDescription,
                                            webinarDuration : webinarDuration,
                                            collegeId : collegeId,
                                            webinarId : webinarId,
                                            liveStreamURL : liveStreamURL,
                                            studentsAttending : webinarAttendees+1
                                         }, oncomplete);
                        }
                        else {
                            var oncomplete = function() {
                                (new Firebase(FIREBASE_URL + 'WebinarWiseRecord/' +  '/' + webinarId + '/' + studentId)).set(studentId);
                                (new Firebase(FIREBASE_URL + 'collegeWebinar/upcomingWebinar/' + collegeId + '/' + webinarId + '/studentsAttending')).set(webinarAttendees+1);
                                (new Firebase(FIREBASE_URL + 'allWebinar/upcomingWebinar/' + webinarId + '/studentsAttending')).set(webinarAttendees+1);
                                $scope.webinar_booking_success[webinarId] = "done";
                                $scope.$evalAsync();
                            };
                            bookWebinarSync.update({ 
                                            mentorName: mentorName,
                                            mentorEmail : mentorEmail,
                                            mentorMobile : mentorMobile,
                                            mentorGender : gender,
                                            mentorPhoto : mentorPhoto,
                                            webinarTopic : webinarTopic,
                                            webinarDate : webinarDate,
                                            webinarTime : webinarTime,
                                            webinarDescription : webinarDescription,
                                            webinarDuration : webinarDuration,
                                            collegeId : collegeId,
                                            webinarId : webinarId,
                                            studentsAttending : webinarAttendees+1
                                         }, oncomplete);
                        }
                    });
                }
                else if(a === true) {
                    $scope.webinarAlreadyBooked[webinarId] = "yes";
                    $scope.$evalAsync();
                }
            });
            
        },
        
        UpdateAttendees : function (i,webinarId,webinarAttendees,collegeId) {
            (new Firebase(FIREBASE_URL + 'collegeWebinar/upcomingWebinar/' + collegeId + '/' + webinarId + '/studentsAttending')).set(webinarAttendees+i);
            (new Firebase(FIREBASE_URL + 'allWebinar/upcomingWebinar/' + webinarId + '/studentsAttending')).set(webinarAttendees+i);
        },


                                                                    /*student Webinar Load more*/


        getUpcommingWebinarsForStudent : function(studentId,$scope) {
            $scope.webinarsLoaded = 0;
            var counter = 0;
            var numberOfAllUpcomingWebinars = 0;
            $scope.studentWebinar = [];
            var studentWebinarRef = new Firebase(FIREBASE_URL + 'allWebinar/upcomingWebinar');
            studentWebinarRef.once("value", function(snapshot) {
                numberOfAllUpcomingWebinars = snapshot.numChildren();
                studentWebinarRef.orderByChild("webinarNumber").startAt(numberOfAllUpcomingWebinars-1).endAt(numberOfAllUpcomingWebinars).once("value", function(studentSnapshot) {
                    if(typeof studentId === 'undefined') {
                        studentSnapshot.forEach(function(studentWebinarRecords) {
                           $scope.studentWebinar = $scope.studentWebinar.concat(studentWebinarRecords.val());
                           $scope.webinarsLoaded = studentWebinarRecords.val().webinarNumber-1;
                           $scope.$evalAsync(); 
                        });
                    }
                    else {
                        studentSnapshot.forEach(function(studentWebinarRecords) {
                            var ref = new Firebase(FIREBASE_URL + 'studentWebinar/bookedWebinar/' + studentId + '/' + studentWebinarRecords.key());
                            ref.on("value", function(snapshot) {
                                var a = snapshot.exists();
                                if(a === true) {
                                    counter = counter+1;
                                    $scope.webinarsLoaded = studentWebinarRecords.val().webinarNumber-1;
                                }
                                else if(a === false) {
                                    counter = counter+1;
                                    $scope.webinarsLoaded = studentWebinarRecords.val().webinarNumber-1;
                                    $scope.studentWebinar = $scope.studentWebinar.concat(studentWebinarRecords.val());
                                    $scope.$evalAsync();
                                }
                                if((counter === 2) && ($scope.studentWebinar.length !== 2))
                                    Webinar.loadMoreWebinarsForStudent(studentId,$scope);
                            });
                        });
                    }
                });
            });
        },

        loadMoreWebinarsForStudent : function (studentId,$scope) {
            var counter = 0;
            var previousArrayLength = $scope.studentWebinar.length;
            var studentWebinar = new Firebase(FIREBASE_URL + 'allWebinar/upcomingWebinar');
            studentWebinar.orderByChild("webinarNumber").startAt($scope.webinarsLoaded-2).endAt($scope.webinarsLoaded-1).once("value", function(studentSnapshot) {
               if(typeof studentId === 'undefined'){
                    studentSnapshot.forEach(function(studentWebinarRecords) {
                        $scope.webinarsLoaded = studentWebinarRecords.val().webinarNumber-1;
                        $scope.studentWebinar = $scope.studentWebinar.concat(studentWebinarRecords.val());
                        $scope.$evalAsync();
                    });
               }
               else{
                    studentSnapshot.forEach(function(studentWebinarRecords) {
                    var ref = new Firebase(FIREBASE_URL + 'studentWebinar/bookedWebinar/' + studentId + '/' + studentWebinarRecords.key());
                        ref.on("value", function(snapshot) {
                        var a = snapshot.exists();
                        if(a === true) {
                            counter = counter+1;
                            $scope.webinarsLoaded = studentWebinarRecords.val().webinarNumber-1;
                            
                        }
                        else if(a === false) {
                            counter = counter+1;
                            $scope.webinarsLoaded = studentWebinarRecords.val().webinarNumber-1;
                            $scope.studentWebinar = $scope.studentWebinar.concat(studentWebinarRecords.val());
                            $scope.$evalAsync();
                            
                            
                        }
                        if((counter === 2) && ($scope.studentWebinar.length !== previousArrayLength+2))
                            Webinar.loadMoreWebinarsForStudent(studentId,$scope);
                        });
                        
                  });
                }    
            });
            if($scope.webinarsLoaded===2 || $scope.webinarsLoaded===1 || $scope.webinarsLoaded===3 )
            {
                $("#loadmorebtn").html('');
                $("#loadmorebtn").html('<div style="width:100%; background:#fbfbfb; border-radius:4px; border:1px solid #ccc; padding:5px;"><p style="margin:5px; font-size:16px;"><b>No More Webinars to load.</b></p></div>');
            }
        },

        getBookedWebinarForStudent : function (studentId,$scope) {
            $scope.studentBookedWebinar = [];
            var numberOfBookedWebinars = 0;
            var studentBookedWebinarRef = new Firebase(FIREBASE_URL + 'studentWebinar/bookedWebinar/' + studentId);
            studentBookedWebinarRef.once("value", function(snapshot) {
                numberOfBookedWebinars = snapshot.numChildren();
                if(numberOfBookedWebinars !== 0) {
                    snapshot.forEach(function(studentBookedWebinar) {
                        $scope.studentBookedWebinar = $scope.studentBookedWebinar.concat(studentBookedWebinar.val());
                        $scope.$evalAsync();
                    })
                }
            });
        },

                                                        /*student Webinar Load more Ends*/

        attendWebinarByStudent : function(webinarDetail, $scope) {
            var liveStreamRef = new Firebase(FIREBASE_URL + "allWebinar/upcomingWebinar/"+webinarDetail.webinarId+"/liveStreamURL/");
            var liveURL = $firebaseObject(liveStreamRef);
            liveURL.$loaded(function(liveURL) {
                var Id = liveURL.$value.split(".be/");
                var vedioId = Id[1];
                var videourl = "https://www.youtube.com/embed/" + vedioId + "?rel=0&amp;showinfo=0&modestbranding=1&autohide=1";
                $scope.video = {src:videourl, title:"LiveStreamUrl"};
                $scope.$evalAsync();
            })
            
            var studentsAttendingWebinarRef = new Firebase(FIREBASE_URL + "/studentsClickingStartWebinarLink/" + 
                webinarDetail.webinarId + "/");
            var studentsAttendingWebinarObj = $firebaseObject(studentsAttendingWebinarRef);
            studentsAttendingWebinarObj.$loaded(function(studentsAttendingWebinar) {
                if(!studentsAttendingWebinar.$value) {
                    studentsAttendingWebinarRef.set(1);
                }
                else if(studentsAttendingWebinar.$value < 7) {
                    studentsAttendingWebinarRef.set(studentsAttendingWebinar.$value+1);
                }
                else if(studentsAttendingWebinar.$value > 7 || studentsAttendingWebinar.$value === 7) {
                    studentsAttendingWebinarRef.set(studentsAttendingWebinar.$value+1);
                }
            })
        },

        getStudentsWebinarHistory : function(studentId, $scope) {
            var  studentsCompletedWebinarRef = new Firebase(FIREBASE_URL + 'studentWebinar/completedWebinar/'  + studentId);
            var studentsCompletedWebinarObj = $firebaseArray(studentsCompletedWebinarRef);
            studentsCompletedWebinarObj.$loaded(function(studentsCompletedWebinar) {
                $scope.webinarHistory = studentsCompletedWebinar;
            })
        },

        studentAskedAQuestion : function(studentUid, studentname, webinarDetail, question, $scope) {
            var questionDate = new Date();
            var date = $filter('date')(questionDate,'yyyyMMdd');
            var postTime = (questionDate.getHours()<10?'0':'') + questionDate.getHours()+ ":" + (questionDate.getMinutes()<10?'0':'') + questionDate.getMinutes()+ ":" + (questionDate.getSeconds()<10?'0':'') + questionDate.getSeconds();
            var temporary = postTime.split(':');
            var timestamp = date.toString()+temporary[0].toString()+temporary[1].toString()+temporary[2].toString();
            var  questionFromStudentRef = new Firebase(FIREBASE_URL + 'QNADuringWebinar/'  + webinarDetail.webinarId + "/");
            questionFromStudentRef.push({studentId:studentUid, studentName:studentname, webinarId:webinarDetail.webinarId, question:question, timestamp:timestamp})
            $scope.question="";
        },

        getWebinarChat: function(webinarid, $scope) {
          var chatref = new Firebase(FIREBASE_URL+'/QNADuringWebinar/' + webinarid );
          var chatrefobj =     $firebaseArray(chatref);
          chatrefobj.$loaded( function(chatrefobj) { 
            $scope.QuestionDetails = chatrefobj;
          });
        },

        getQNAdetails : function(webinarDetail, $scope) {
            var  QNARef = new Firebase(FIREBASE_URL + 'QNADuringWebinar/'  + webinarDetail.webinarId + "/");
            var QNAObj = $firebaseObject(QNARef);
            QNAObj.$loaded( function(QNAObj) {
                $scope.QNADetails = QNAObj;
                $scope.$evalAsync();
            })
        },

        getWebinarDetailByWebinarId : function(webinarId, $scope) {
            var  webinarDetailRef = new Firebase(FIREBASE_URL + 'allWebinar/upcomingWebinar/'  + webinarId + "/");
            var webinarDetailObj = $firebaseObject(webinarDetailRef);
            webinarDetailObj.$loaded( function(webinarDetailObj) {
                $scope.specificWebinarDetail = webinarDetailObj;
                if($scope.specificWebinarDetail.liveStreamURL) {
                    var Id = $scope.specificWebinarDetail.liveStreamURL.split(".be/");
                    var vedioId = Id[1];
                    var videourl = "https://www.youtube.com/embed/" + vedioId + "?rel=0&amp;showinfo=0&modestbranding=1&autohide=1";
                    $scope.video = {src:videourl, title:"LiveStreamUrl"};    
                }
            });  
        },

        getWebinarDetail : function(webinarId) {
            var deferred = $q.defer();
            var allWebinarObject = $firebaseObject(new Firebase(FIREBASE_URL + 'allWebinar/upcomingWebinar/' + webinarId  ));
            allWebinarObject.$loaded(function(webinarDetail) {
                deferred.resolve(webinarDetail);
            });
            return deferred.promise; 
        },

        isAnyWebinarLive : function () {
            var liveWebinarRef = new Firebase(FIREBASE_URL + "liveWebinars/");
            return $firebaseArray(liveWebinarRef);
        },

        isThisBookedWebinarLive : function (webinarId, $scope) {
            var liveWebinarRef = new Firebase(FIREBASE_URL + "liveWebinars/" + webinarId);
            $scope.thisBookedWebinarLive[webinarId] = $firebaseArray(liveWebinarRef);
            $scope.$evalAsync();
        },

        getWebinarFeedbacks : function(currentCollege, $scope, webinarId) {
            var completedRef = new Firebase(FIREBASE_URL + 'collegeWebinar/CollegeFeedbackForWebinar/' + currentCollege + '/' + webinarId + '/');
            $scope.Webinarsfeedback = $firebaseObject(completedRef);
            $scope.$evalAsync();
        },

        SaveWebinarFeedback : function(webinarId,currentCollege, $scope, webinarexperience, satisfaction,quality, problems, QNA, technicalProblem,recommendation) {
            var completedWebinarHistoryRef = new Firebase(FIREBASE_URL + 'collegeWebinar/CollegeFeedbackForWebinar/' + currentCollege + '/' + webinarId + '/');
            var feedbackObject = $firebaseObject(completedWebinarHistoryRef);
                feedbackObject.webinarExperience = webinarexperience;
                feedbackObject.satisfactionLevel = satisfaction;
                feedbackObject.QualityoFWebinar = quality;
                feedbackObject.TechnicalProblems = problems;
                feedbackObject.Recommendation = QNA;
                if(typeof technicalProblem !== 'undefined'){
                feedbackObject.TechnicalProblemsDetail = technicalProblem;
                }
                if(typeof recommendation !== 'undefined'){
                feedbackObject.RecommendationDetail = recommendation;
                }
                feedbackObject.$save().then(function() {
                    $scope.successmessage = "Your Details Submitted sucessfully";
                });
        },

        getstudentWebinarFeedbacks : function(webinarId,$scope) {
            var currentStudent = Auth.resolveUser().uid;
            var completedRef = new Firebase(FIREBASE_URL + 'studentWebinar/StudentFeedbackForWebinar/' + currentStudent + '/' + webinarId + '/');
            $scope.studentwebinarFeed = $firebaseObject(completedRef);
            $scope.$evalAsync();
        },


        SaveWebinarStudentFeedback : function(collegeId,webinarId,webinarSatisfaction,SpeakerInterested,Interested,InterestedArea,QNA, QuestionDetails,$scope) {
            var currentStudent = Auth.resolveUser().uid;
            var completedWebinarHistoryRef = new Firebase(FIREBASE_URL + 'studentWebinar/StudentFeedbackForWebinar/' + currentStudent + '/' + webinarId + '/');
            var feedbackObject = $firebaseObject(completedWebinarHistoryRef);
                feedbackObject.webinarSatisfaction = webinarSatisfaction;
                feedbackObject.Interested = Interested;
                feedbackObject.SpeakerQuality = SpeakerInterested;
                feedbackObject.AllQuestionAnswered = QNA;
                feedbackObject.collegeId = collegeId;
                if(typeof InterestedArea !== 'undefined'){
                feedbackObject.InterestedArea = InterestedArea;
                }
                if(typeof QuestionDetails !== 'undefined'){
                feedbackObject.QuestionDetails = QuestionDetails;
                }
                feedbackObject.$save().then(function() {
                    $scope.successmessage = "Your Details Submitted sucessfully";
                });
        },

        getAllCompletedWebinar : function($scope) {
              $scope.post_loaded=2;
              $scope.completedWebinar = [];
              var postCatagoryWiseRef = new Firebase(FIREBASE_URL+"allWebinar/completedWebinar");
              postCatagoryWiseRef.on('value' , function(allPosts) {
                $scope.totalPosts = allPosts.numChildren();
                if($scope.totalPosts < 2 || $scope.totalPosts == 2) {
                  $scope.hideLoadMore = "yes";
                }
                else 
                  $scope.hideLoadMore = "no"; 
              });
              var postsArr = $firebaseArray(postCatagoryWiseRef.orderByChild("webinarNumber").limitToLast(2));
              postsArr.$loaded(function(postsArr) {
                $scope.completedWebinar = postsArr;
                $scope.completedWebinar.reverse();
                $scope.$evalAsync();
              });    
            
        },

        loadMoreCompletedWebinars : function(webinarNumber, $scope) {
          var tempPostArr = [];
          var postCatagoryWiseRef = new Firebase(FIREBASE_URL+"allWebinar/completedWebinar");
          if($scope.post_loaded < $scope.totalPosts)
          {
            var morePostArray =  $firebaseArray(postCatagoryWiseRef.orderByChild("webinarNumber").startAt($scope.totalPosts-($scope.post_loaded+3)).endAt($scope.totalPosts-($scope.post_loaded)));
            morePostArray.$loaded(function(morePostArray) {
              tempPostArr = morePostArray;
              tempPostArr.reverse();
              $scope.completedWebinar = $scope.completedWebinar.concat(tempPostArr);
              $scope.post_loaded = $scope.completedWebinar.length;
              $scope.hideLoadMore = "no";
              if($scope.post_loaded === $scope.totalPosts)
                $scope.hideLoadMore = 'yes';
              $scope.$evalAsync();
            });
          }
          else {
            $scope.hideLoadMore = "yes";
          }
        },

                                        /*Special Event*/

        getAllSpecialEvents : function() {
            var specialWebinarRef = new Firebase(FIREBASE_URL + 'specialEvents/');
            return $firebaseArray(specialWebinarRef);       
        },

        authorizeSpecialEvent : function (eventId,event_password, $scope) {
            var specialWebinarPassword = new Firebase(FIREBASE_URL + 'specialEventsPassword/' +eventId);
            specialWebinarPassword.once("value", function(snapshot) {
                if(snapshot.val() === event_password) {
                    $scope.eventError = "";
                    $scope.event_password = "";
                    $scope.$evalAsync();
                    var hangoutRef = new Firebase(FIREBASE_URL + 'allWebinar/upcomingWebinar/' + eventId + "/hangoutURL/");
                    hangoutRef.once("value", function(snapshot) {
                        $window.open(snapshot.val());
                    })
                }
                else {
                    $scope.eventError = "Not Authorized !"
                    $scope.$evalAsync();
                }
            });
        },

        saveSpecialEvent : function(webinarDetails,password, $scope) {
            var onComplete = function() {
                var specialWebinarPassword = new Firebase(FIREBASE_URL + 'specialEventsPassword/' +webinarDetails.$id);
                specialWebinarPassword.set(password);
                $scope.hangoutShared = "shared";
                $scope.$evalAsync();
            };
            var specialWebinarRef = new Firebase(FIREBASE_URL + 'specialEvents/' +webinarDetails.$id);
            specialWebinarRef.update({
                                webinarTopic : webinarDetails.webinarTopic,
                                mentorName: webinarDetails.mentorName,
                                mentorEmail : webinarDetails.mentorEmail,
                                mentorMobile : webinarDetails.mentorMobile,
                                mentorGender : webinarDetails.mentorGender,
                                mentorPhoto : webinarDetails.mentorPhoto,
                                webinarDate : webinarDetails.webinarDate,
                                webinarTime : webinarDetails.webinarTime,
                                webinarDescription : webinarDetails.webinarDescription,
                                webinarDuration : webinarDetails.webinarDuration,
                                collegeId : webinarDetails.collegeId,
                                webinarId : webinarDetails.webinarId
            },onComplete);
        },

                                        /*Special Event*/

        getUpcomingCollegeWebinar : function(collegeId, $scope) {
            var upcommingWebRef = new Firebase(FIREBASE_URL + 'collegeWebinar/upcomingWebinar/' + collegeId + '/');
            $scope.commingWebinars = $firebaseArray(upcommingWebRef);
            $scope.$evalAsync();
        },                                        

    };
    return Webinar;
  }
);
 
