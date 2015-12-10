'use strict';
 
app.factory('Search',
  function (FIREBASE_URL, $rootScope, $q , $firebaseObject , $firebaseArray) {

    var ref = new Firebase(FIREBASE_URL + 'profileForCollege' + '/');
    var refstudent = new Firebase(FIREBASE_URL + 'profileForStudents/' + '/');
    var refadmin = new Firebase(FIREBASE_URL + 'profileForAdmins/' + '/');
    var refnodaladmin = new Firebase(FIREBASE_URL + 'profileForNodalAdmins/' + '/');
    var collegeObj = $firebaseObject(ref);
    var collegeListAfterSearch = [];
    var tempState='';
    var tempCourse='';
    var collegeArray = $firebaseArray(ref);
    var ugCourse =  {
                     roles: []
                    };
    var pgCourse =  {
                      roles: []
                    };
    var ugCourseList = [
      {id: '0', text: 'Engineering'},
      {id: '1', text: 'Computer Applications / IT'},
      {id: '2', text: 'Biotechnology'},
      {id: '3', text: 'Microbiology'},
      {id: '4', text: 'Agriculture'},
      {id: '5', text: 'Food Technology'},
      {id: '6', text: 'Nutrition and Dietetics'}, 
      {id: '7', text: 'Arts (Humanities)'},
      {id: '8', text: 'Library Science'},
      {id: '9', text: 'Management'},
      {id: '10', text: 'Commerce'},
      {id: '11', text: 'Economics'},
      {id: '12', text: 'Hotel Management/Hospitality and Tourism'},
      {id: '13', text: 'Architecture'},
      {id: '14', text: 'Planning'},
      {id: '15', text: 'Fine Arts'},
      {id: '16', text: 'Performing Arts'},
      {id: '17', text: 'Pharmaceutical Sciences'},
      {id: '18', text: 'Ayurvedic Pharmaceutical Sciences'},
      {id: '19', text: 'Physiotherapy'},
      {id: '20', text: 'Paramedical Sciences'},
      {id: '21', text: 'Education'},    
      {id: '22', text: 'Physical Education'},
      {id: '23', text: 'Law'},
      {id: '24', text: 'Design'},
      {id: '25', text: 'Sciences'},
      {id: '26', text: 'Nursing'},
      {id: '27', text: 'Film & Television'},
      {id: '28', text: 'Media & Journalism'}
    ];

    var pgCourseList = [
      {idA: '0', textA: 'Engineering'},
      {idA: '1', textA: 'Computer Applications / IT'},
      {idA: '2', textA: 'Biotechnology'},
      {idA: '3', textA: 'Microbiology'},
      {idA: '4', textA: 'Biochemistry'},
      {idA: '5', textA: 'Agriculture'},
      {idA: '6', textA: 'Food Technology'},
      {idA: '7', textA: 'Nutrition and Dietetics'},
      {idA: '8', textA: 'English and Foreign Languages'},
      {idA: '9', textA: 'Indian Languages'},
      {idA: '10', textA: 'Library Science'},
      {idA: '11', textA: 'Sociology'},
      {idA: '12', textA: 'Geography'},
      {idA: '13', textA: 'Management'},
      {idA: '14', textA: 'Commerce'},
      {idA: '15', textA: 'Economics'},
      {idA: '16', textA: 'Hotel Management/Hospitality and Tourism'},
      {idA: '17', textA: 'Architecture'},
      {idA: '18', textA: 'Planning'},
      {idA: '19', textA: 'Fine Arts'},
      {idA: '20', textA: 'Performing Arts'},
      {idA: '21', textA: 'Pharmaceutical Sciences'},
      {idA: '22', textA: 'Ayurvedic Pharmaceutical Sciences'},
      {idA: '23', textA: 'Physiotherapy'},
      {idA: '24', textA: 'Paramedical Sciences'},
      {idA: '25', textA: 'History'},
      {idA: '26', textA: 'Political Science'},
      {idA: '27', textA: 'Psychology'},
      {idA: '28', textA: 'Education'},    
      {idA: '29', textA: 'Physical Education'},
      {idA: '30', textA: 'Law'},
      {idA: '31', textA: 'Design'},
      {idA: '32', textA: 'Sciences'},
      {idA: '33', textA: 'Nursing'},
      {idA: '34', textA: 'Film & Television'},
      {idA: '35', textA: 'Media & Journalism'}
    ];


    var collegesSearchList = [];
    var College = {
      all: collegeObj,
      allAsArray: collegeArray,

      find: function (collegeId) {
        return $firebaseObject(ref.child(collegeId));
      },
        
      getCourseIdByName: function(courseName) {
        var deferred = $q.defer();
        var courseArray = ($firebaseArray(new Firebase(FIREBASE_URL+"courseList/courses/")));
        courseArray.$loaded(function(courseArray) {
            for(var i=0; i<courseArray.length; i++) 
            {
              if((courseArray[i].$value) == courseName)
              {
                var simpleUser = courseArray.$keyAt(courseArray[i]);                       
              }
            }
            if(simpleUser){
              deferred.resolve(simpleUser);
            }
            else {
              var simpleUser = "user doesnot exists";
              deferred.resolve(simpleUser);
            }
            
        }, function(error) {
          console.error("Error:", error);
          deferred.reject(error);
        });
        return deferred.promise;
      },

      setStateToView: function(state){
        tempState = state;
      },
     
      setCourseToView: function(course){
        tempCourse = course;
      },


      getStateToView: function(){
        if(tempState !=='')
          return (tempState);
      },
      getCourseToView: function(){
        if(tempCourse !== '')
          return (tempCourse);
      },

      getCollegeByState: function(state){
        var deferred = $q.defer();
        var collegeListAfterSearch = [];
        var stateName = ($firebaseObject(new Firebase(FIREBASE_URL+"stateList/states/" + state +'/')));
        stateName.$loaded(function(stateName){
          var CollegeInState = ($firebaseArray(new Firebase(FIREBASE_URL+"StateCollegeSearch/" + stateName.$value +'/')));
          CollegeInState.$loaded(function(CollegeInState){
            for(var i=0;i<CollegeInState.length;i++)
            {
              var collegeref = $firebaseObject(ref.child(CollegeInState[i].$id));
              collegeref.$loaded(function(collegeref) {
                collegeListAfterSearch.push(collegeref);
              }).then(function(){
                deferred.resolve(collegeListAfterSearch);
              });
            }
          })
        })
        return deferred.promise;
      },

      getStateIdByName: function(stateName) {
        var deferred = $q.defer();
        var stateArray = ($firebaseArray(new Firebase(FIREBASE_URL+"stateList/states/")));
        stateArray.$loaded(function(stateArray) {
          for(var i=0; i<stateArray.length; i++) 
          {
            if((stateArray[i].$value) == stateName)
            {
                 var simpleUser = stateArray.$keyAt(stateArray[i]);                 
            }
          }
          if(simpleUser){
                  deferred.resolve(simpleUser);
          }
          else {
               var simpleUser = "user doesnot exists";
               deferred.resolve(simpleUser);
          }
        }, function(error) {
          console.error("Error:", error);
          deferred.reject(error);
        });
        return deferred.promise;
      },

      getStudentDetail: function (studenturl) {
        return $firebaseObject(refstudent.child(studenturl));
      },

       
      getAllStateDropdownObjects: function() {
        return $firebaseObject(new Firebase(FIREBASE_URL+"stateList/states/"));
      },
      
      getStateDropdownObject: function(key) {
        return $firebaseObject(new Firebase(FIREBASE_URL +"stateList/states/"+ key));
      },

      getAllCourseDropdownObjects: function() {
        return $firebaseObject(new Firebase(FIREBASE_URL+"courseList/courses/"));
      },

      getCourseDropdownObject: function(key) {
        return $firebaseObject(new Firebase(FIREBASE_URL +"courseList/courses/"+ key));
      },

      getcollegeDetail: function (collegeId) {
        var deferred = $q.defer();
        var collegeref = $firebaseObject(ref.child(collegeId));
        collegeref.$loaded(function(collegeref) {
          deferred.resolve(collegeref);         
        }, function(error) {
            console.error("Error:", error);
            deferred.reject(error);
        });
        return deferred.promise;
      },

      getStudentName: function (studentId) {
        var studentnameref = new Firebase(FIREBASE_URL + 'profileForStudents/' + studentId + '/studentname');
        return $firebaseObject(studentnameref);
      },

      getStudentStatus: function(studentId){
             var studentnameref = new Firebase(FIREBASE_URL + 'profileForStudents/' + studentId + '/studentstatus');
             return $firebaseObject(studentnameref);
      },

      getStudentIncentive: function (StudentId) {
             var studentincentiveref = new Firebase(FIREBASE_URL + 'profileForStudents/' + StudentId + '/totalIncentiveForSessions');
             return $firebaseObject(studentincentiveref);
      },

      getStudentEmail: function (studentId) {
             var studentemailref = new Firebase(FIREBASE_URL + 'profileForStudents/' + studentId + '/email');
             return $firebaseObject(studentemailref);
      },

      getstudentphone: function (studentId) {
             var studentphoneref = new Firebase(FIREBASE_URL + 'profileForStudents/' + studentId + '/studentmobile');
             return $firebaseObject(studentphoneref);
      },

      getStudentPhoto: function (studentId) {
             var studentphotoref = new Firebase(FIREBASE_URL + 'profileForStudents/' + studentId + '/studentphoto');
             return $firebaseObject(studentphotoref);
      },

      getCollegePhoto: function (collegeId) {
             var collegephotoref = new Firebase(FIREBASE_URL + 'profileForCollege/' + collegeId + '/collegephoto');
             return $firebaseObject(collegephotoref);
      },

      getCollegeName: function (collegeId) {
             var collegenameref = new Firebase(FIREBASE_URL + 'profileForCollege/' + collegeId + '/collegename');
             return $firebaseObject(collegenameref);
      },
      getCollegeEmail: function (collegeId) {
             var collegeemailref = new Firebase(FIREBASE_URL + 'profileForCollege/' + collegeId + '/counsellorEmail');
             return $firebaseObject(collegeemailref);
      },
      getCollegeVerification: function (collegeId) {    
             var collegenameref = new Firebase(FIREBASE_URL + 'profileForCollege/' + collegeId + '/verifiedcollege');   
             return $firebaseObject(collegenameref);    
      },
      getCollegeType: function (collegeId) {
             var collegenameref = new Firebase(FIREBASE_URL + 'profileForCollege/' + collegeId + '/collegetype');   
             return $firebaseObject(collegenameref);    
      },

      getCollegeIdByEmail: function(counsellorEmail) {
        var deferred = $q.defer();
        var collegeUserArray = ($firebaseArray(new Firebase(FIREBASE_URL+"admin/collegeUsers")));
        collegeUserArray.$loaded(function(collegeUserArray) {
            for(var i=0; i<collegeUserArray.length; i++) 
            {
              if((collegeUserArray[i].$value) == counsellorEmail)
              {
                   var simpleUser = collegeUserArray.$keyAt(collegeUserArray[i]);
              }
            }
            if(simpleUser){
                    deferred.resolve(simpleUser);
            }
            else {
                 var simpleUser = "user doesnot exists";
                 deferred.resolve(simpleUser);
            }
        }, function(error) {
            console.error("Error:", error);
            deferred.reject(error);
        });
        return deferred.promise;
        },

        getStudentNameByEmail: function(studentEmail) {
          var deferred = $q.defer();
          var studentUserArray = ($firebaseArray(new Firebase(FIREBASE_URL+"admin/studentUsers")));
          studentUserArray.$loaded(function(studentUserArray) {
              for(var i=0; i<studentUserArray.length; i++) 
              {
                if((studentUserArray[i].$value) == studentEmail)
                {
                  var simpleUser = studentUserArray.$keyAt(studentUserArray[i]);                       
                     
                }
                
              }
              if(simpleUser){
                var stu = College.getStudentName(simpleUser); 
                stu.$loaded(function(stu){
                  var studentname = stu.$value;
                  deferred.resolve(studentname);
                });
              }
              else {
              }
          }, function(error) {
              console.error("Error:", error);
              deferred.reject(error);
          });
          return deferred.promise;
        },

        getStudentIdByEmail: function(studentEmail) {
              var deferred = $q.defer();
              var studentUserArray = ($firebaseArray(new Firebase(FIREBASE_URL+"admin/studentUsers")));
              studentUserArray.$loaded(function(studentUserArray) {
                  for(var i=0; i<studentUserArray.length; i++) 
                  {
                    if((studentUserArray[i].$value) == studentEmail)
                    {
                         var simpleUser = studentUserArray.$keyAt(studentUserArray[i]);                       
                    }
                  }
                  if(simpleUser){
                          deferred.resolve(simpleUser);
                  }
                  else {
                       var simpleUser = "user doesnot exists";
                       deferred.resolve(simpleUser);
                  }
                  
              }, function(error) {
                  console.error("Error:", error);
                  deferred.reject(error);
              });
              return deferred.promise;
        },

        getSessionStatus: function(studentId, collegeId) {
            var deferred = $q.defer();
            var sessionVerStatusRef = new Firebase(FIREBASE_URL + 'collegeSessions/' + collegeId + '/' + studentId + "/sessionVerificationStatus");
            var sessionVerStatusObj = $firebaseObject(sessionVerStatusRef);
            sessionVerStatusObj.$loaded(function(sessionVerStatusObj) {
              deferred.resolve(sessionVerStatusObj);         
            }, function(error) {
                console.error("Error:", error);
                deferred.reject(error);
            });
            return deferred.promise;
        },

        isFeedbackGiven: function(studentId, collegeId) {
            var deferred = $q.defer();
            var feedbackStatusRef = new Firebase(FIREBASE_URL + 'collegeSessions/' + collegeId + '/' + studentId);
            var feedbackStatusObj = $firebaseObject(feedbackStatusRef);
            feedbackStatusObj.$loaded(function() {
              deferred.resolve(feedbackStatusObj);         
            })
            return deferred.promise;
        },

        getStudentEmailStatus: function (studentId) {
          var studentemailref = new Firebase(FIREBASE_URL + 'profileForStudents/' + studentId + '/emailverificationstatus');
          return $firebaseObject(studentemailref);
        },

        getFeedbackStatus : function(studentId, collegeId) {
          return ($firebaseObject(new Firebase(FIREBASE_URL + "collegeFeedback/" + collegeId + "/" + studentId)));
        }, 

        getFeedbackNotGivenCount : function(collegeId, $scope) {
          var collegeRef = new Firebase(FIREBASE_URL + 'profileForCollege/' + collegeId + '/');
          var collegeObj = $firebaseObject(collegeRef);
          collegeObj.$loaded(function(result) {
            $scope.sessionno = result.sessionCount;
            $scope.feedbacknum = result.feedbacknotgivenCount
          });  
        },       

        getStudentSessions : function(studentId) {
          return $firebaseObject(new Firebase(FIREBASE_URL + 'studentSessions/' + studentId + '/'));
        },

        checkNewBookSessionForNotification : function(studentId,$scope) {
          $scope.sessionLength = 0;
         var studentSessionLengthRef = (new Firebase(FIREBASE_URL + 'studentSessions/' + studentId + '/'));
         studentSessionLengthRef.on('value', function(dataSnapshot) {
             $scope.sessionLength = $scope.sessionLength + 1;
              $scope.bookhistorytab = 'show';
             $scope.$evalAsync();
            });
        },

        notificationOfIncentiveChange : function(studentId,$scope) {
          $scope.sessionIncentive = 0;
          $scope.referralIncentive =0;
          var sessionIncentiveRef = (new Firebase(FIREBASE_URL + 'profileForStudents/' + studentId + '/' + 'totalIncentiveForSessions'));
          sessionIncentiveRef.on('value', function(dataSnapshot) {
            $scope.sessionIncentive = $scope.sessionIncentive + 1;
            $scope.$evalAsync();
          });
          var referralIncentiveRef = (new Firebase(FIREBASE_URL + 'profileForStudents/' + studentId + '/' + 'totalIncentiveForReferral'));
          referralIncentiveRef.on('value', function(dataSnapshot1) {
            $scope.referralIncentive = $scope.referralIncentive + 1;
            $scope.$evalAsync();
          });
        },

        getStudentEmailVerificationStatus : function(studentId,$scope) {
          $scope.getStudentEmailVerification = '';
          var emailStatus = (new Firebase(FIREBASE_URL + 'profileForStudents/' + studentId + '/' + 'emailverificationstatus'));
          emailStatus.on('value', function(dataSnapshot1) {
            $scope.getStudentEmailVerification = dataSnapshot1.val();
            $scope.$evalAsync();
          });
        },

        storeview: function (collegeId) {
          var updatePendingStatusref = new Firebase(FIREBASE_URL + 'profileForCollege/' + collegeId);
          var sync = $firebaseObject(updatePendingStatusref);
          sync.$loaded(function(sync) {
            if(typeof sync.collegeView === 'undefined'){
              updatePendingStatusref.update({ collegeView: 1 });
            }
            else {
              var view = sync.collegeView;
              updatePendingStatusref.update({ collegeView : view + 1 });
            } 
          });
        },

        studentDetailForNotification : function(studentId,$scope) {
          $scope.profileIncomplete='';
          var student = (new Firebase(FIREBASE_URL + 'profileForStudents/' + studentId ));
          student.on('value', function(dataSnapshot1) {
            var student = dataSnapshot1.val();
            if((typeof student.academicrecord12thMarks == 'undefined') || ((typeof student.coursesUG == 'undefined')  ) ||  (typeof student.fathername == 'undefined') ||  (typeof student.fathernumber == 'undefined') ||  (typeof student.occupation == 'undefined') ||  (typeof student.studentabout == 'undefined') ||  (typeof student.studentdocument == 'undefined') ||  (student.studentphoto == "https://www.filepicker.io/api/file/M6FYqDmeRlaLV3sTl1tp")) {
              $scope.profileIncomplete = 'Done';
              $scope.$evalAsync();
            }
            else{
              $scope.profileIncomplete = 'Not Done';
              $scope.$evalAsync();
            }
          });
        },

        getStudentIdAndUrlidByEmail : function(studentEmail) {
          var deferred = $q.defer();
          var studentUserArray = ($firebaseArray(new Firebase(FIREBASE_URL+"admin/studentUsers")));
          studentUserArray.$loaded(function(studentUserArray) {
              var simpleuser = {};
              for(var i=0; i<studentUserArray.length; i++) 
              {
                if((studentUserArray[i].$value) == studentEmail)
                {
                     simpleuser.uid = studentUserArray.$keyAt(studentUserArray[i]);                       
                }
              }
              if(simpleuser.uid){
                      var studentUrlidRef = new Firebase(FIREBASE_URL + "profileForStudents/" + simpleuser.uid + "/studenturlid");
                      studentUrlidRef.once("value", function(snapshot){
                        simpleuser.urlId = snapshot.val();
                      });
                      deferred.resolve(simpleuser);
              }
              else {
                   simpleuser.uid = "user doesnot exists";
                   deferred.resolve(simpleuser);
              }
              
          }, function(error) {
              console.error("Error:", error);
              deferred.reject(error);
          });
          return deferred.promise;
        },

        getCollegeIdAndUrlidByEmail : function(counsellorEmail) {
          var deferred = $q.defer();
          var collegeUserArray = ($firebaseArray(new Firebase(FIREBASE_URL+"admin/collegeUsers")));
          collegeUserArray.$loaded(function(collegeUserArray) {
              var simpleuser = {};
              for(var i=0; i<collegeUserArray.length; i++) 
              {
                if((collegeUserArray[i].$value) == counsellorEmail)
                {
                     simpleuser.uid = collegeUserArray.$keyAt(collegeUserArray[i]);
                }
              }
              if(simpleuser.uid){
                      var collegeUrlidRef = new Firebase(FIREBASE_URL + "profileForCollege/" + simpleuser.uid + "/collegeurlid");
                      collegeUrlidRef.once("value", function(snapshot){
                        simpleuser.urlId = snapshot.val();
                      });
                      deferred.resolve(simpleuser);
              }
              else {
                   simpleuser.uid = "user doesnot exists";
                   deferred.resolve(simpleuser);
              }
          }, function(error) {
              console.error("Error:", error);
              deferred.reject(error);
          });
          return deferred.promise;
        },

        getMSFImages : function() {
          return $firebaseObject(new Firebase(FIREBASE_URL + "ImageUrl/msf"));
        },
    };   
    return College;
  }
);

