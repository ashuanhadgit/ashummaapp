'use strict';

app.factory('Session',function (FIREBASE_URL, $rootScope, Auth, $q, AdminAuth , $firebaseArray , $firebaseObject) {

    var ref = new Firebase(FIREBASE_URL + 'profileForCollege' + '/');
    var collegeObj = $firebaseObject(ref);
    var collegeArray = $firebaseArray(ref);
   
    var Session = {

        all: collegeObj,
        allAsArray: collegeArray,

        sessionQuery: function(collegeId,$scope) {
            var currentUser = Auth.resolveUser();
            console.log(currentUser.uid);
            var sessionCollegeRef = new Firebase(FIREBASE_URL + 'collegeSessions/' + collegeId + '/' + currentUser.uid);
            $scope.queryy = $firebaseObject(sessionCollegeRef);
        },

        doesSessionExists: function(collegeId) {
            var deferred = $q.defer();
            var currentUser = Auth.resolveUser();
            var checksessionRef = new Firebase(FIREBASE_URL + 'collegeSessions/' + collegeId + '/' + currentUser.uid);
            var checksessionObj = $firebaseObject(checksessionRef);  
            checksessionObj.$loaded(function(checksessionObj) {
                if(typeof checksessionObj.sessiondate == 'undefined'){
                    deferred.resolve(false);
                }
                else deferred.resolve(true);
            });
            return deferred.promise;
        },

        booksession: function (collegeId, studenturlid, collegeurlid, hours, minutes, date, query) {
            var currentUser = Auth.resolveUser();
            var studentUrlId = '';
            var collegeurlId = '';
            var studentId = currentUser.uid;
            if(typeof studenturlid === 'undefined') {
                var data = currentUser.uid.split(":");
                studentUrlId = data[1];
            }
            else {
                studentUrlId = studenturlid;
            }
            if(typeof collegeurlid === 'undefined') {
                var str = collegeId;
                var collegeIdArraySplit = str.split(":");
                collegeurlId = collegeIdArraySplit[1];
            }
            else {
                collegeurlId = collegeurlid;
            }
            var sessionno = 999999999;
            var checksessionRef = new Firebase(FIREBASE_URL + 'collegeSessions/' + collegeId + '/' + currentUser.uid);
            var checksessionObj = $firebaseObject(checksessionRef);  
            checksessionObj.$loaded(function(checksessionObj) {
                if ((checksessionObj.sessionVerificationStatus === 'pending' || checksessionObj.sessionVerificationStatus === 'approved') && typeof checksessionObj.interactionId !== 'undefined' ) {
                    var sessionCollegeRef = new Firebase(FIREBASE_URL + 'collegeSessions/' + collegeId + '/' + currentUser.uid + '/');
                    var sessionCollegeSync = (sessionCollegeRef);
                    sessionCollegeSync.update({studentquery : query});
                    
                    var sessionStudentRef = new Firebase(FIREBASE_URL + 'studentSessions/' + currentUser.uid + '/' + collegeId + '/');
                    var sessionStudentSync = (sessionStudentRef);
                    sessionStudentSync.update({studentquery : query});

                }
                else {
                    if (typeof checksessionObj.sessiondate== 'undefined' ) {
                        var sessionCountRef = new Firebase(FIREBASE_URL + 'profileForCollege/' + collegeId + '/' );
                        var sync = $firebaseObject(sessionCountRef);
                        sync.$loaded(function(sync) {
                            var sessionno =sync.sessionCount;
                            var feedbackno =sync.feedbacknotgivenCount;
                                                                      
                            var sessionCountRef1 = new Firebase(FIREBASE_URL + 'profileForCollege/' + collegeId + '/');
                            var sync1 = (sessionCountRef1);
                                sync1.update({ sessionCount: sessionno + 1 });
                                sync1.update({ feedbacknotgivenCount: feedbackno + 1 });
                            var currentSessionCountObj = $firebaseObject(new Firebase(FIREBASE_URL + 'collegeSessions/' + collegeId + '/currentSessionCount'));
                            currentSessionCountObj.$loaded(function(count) {
                                var sessionCollegeRef = new Firebase(FIREBASE_URL + 'collegeSessions/' + collegeId + '/' + currentUser.uid + '/');
                                var sessionCollegeObj = $firebaseObject(sessionCollegeRef);
                                sessionCollegeObj.collegeurl = collegeId;
                                sessionCollegeObj.collegeurlId = collegeurlId;
                                sessionCollegeObj.studenturl = currentUser.uid;
                                sessionCollegeObj.studenturlId = studentUrlId;                         
                                sessionCollegeObj.sessionhour = hours;
                                sessionCollegeObj.sessionminute = minutes;
                                sessionCollegeObj.sessiondate = date;
                                sessionCollegeObj.studentquery = query;
                                sessionCollegeObj.nodalId = "NODAL1025";
                                sessionCollegeObj.sessionCompleted = "No";
                                sessionCollegeObj.sessionNumber = count.$value + 1;
                                sessionCollegeObj.$save().then(function(ref) {
                                          
                                }, function(error) {
                                    console.log("Error:", error);
                                });
                                var a = date.split(" ");
                                var month = a[1];
                                var year = a[2];
                                console.log("year" +year);
                                var ClgStdSimlogRef = new Firebase(FIREBASE_URL + 'collegeSessionRecordMonthWise/' + a[2] + '/' + month + '/college/' + collegeId + '/' + studentId + '/studenturl');
                                var ClgnodalSimlogRef = new Firebase(FIREBASE_URL + 'collegeSessionRecordMonthWise/' + a[2] + '/' + month + '/college/' + collegeId + '/' + studentId +'/nodalurl');
                                var allSessionNodalRef = new Firebase(FIREBASE_URL + 'collegeSessionRecordMonthWise/allSessions/'  + collegeId + '/' + studentId +'/nodalurl');
                                var allSessionStdRef = new Firebase(FIREBASE_URL + 'collegeSessionRecordMonthWise/allSessions/'  + collegeId + '/' + studentId +'/studenturl');
                                var nodalRef = new Firebase(FIREBASE_URL + 'nodalSessionRecordMonthWise/'+ a[2] + "/" +month + '/' + "simplelogin:1025" + '/college/' + collegeId +'/' + studentId +'/studenturl');
                                var allNodalSessionRef = new Firebase(FIREBASE_URL + 'nodalSessionRecordMonthWise/allSessions/' + "simplelogin:1025" + "/" + collegeId + '/' + studentId +'/studenturl');
                                ClgnodalSimlogRef.set("simplelogin:1025");
                                ClgStdSimlogRef.set(studentId);
                                allSessionStdRef.set(studentId);
                                allSessionNodalRef.set("simplelogin:1025");
                                nodalRef.set(studentId);
                                allNodalSessionRef.set(studentId);

                                var currentSessionCountUpdate = (new Firebase(FIREBASE_URL + 'collegeSessions/' + collegeId + '/'));
                                currentSessionCountUpdate.update({currentSessionCount : count.$value + 1});
                            });

                            var sessionStudentRef = new Firebase(FIREBASE_URL + 'studentSessions/' + currentUser.uid + '/' + collegeId + '/');
                            var sessionStudentObj = $firebaseObject(sessionStudentRef);
                            sessionStudentObj.collegeurl = collegeId;
                            sessionStudentObj.collegeurlId = collegeurlId;
                            sessionStudentObj.studenturl = currentUser.uid;
                            sessionStudentObj.studenturlId = studentUrlId;
                            sessionStudentObj.sessionhour = hours;
                            sessionStudentObj.sessionminute = minutes;
                            sessionStudentObj.sessiondate = date;
                            sessionStudentObj.studentquery = query;
                            sessionStudentObj.nodalId = "NODAL1025";
                            sessionStudentObj.sessionCompleted = "No";
                            sessionStudentObj.$save().then(function(ref) {
                                var a = date.split(" ");  
                                var sample = "1025"+"H"+hours+"MT"+minutes+"D"+a[0]+"M"+a[1]+"Y2015";
                                var ref = new Firebase(FIREBASE_URL + 'allignedStudentGroup/' + collegeId + '/' + sample + "/" + studentId);
                                ref.set(studentId);
                                


                                var day = a[0];
                                var month = a[1];
                                var year = a[2];
                                var numberOfBookings = 1;

                                var adminSessionRef = new Firebase(FIREBASE_URL + 'adminUpcommingCounsellingSessions/'+year+'/'+month+'/'+day);
                                adminSessionRef.once('value',function(snapshot) {
                                    var sessionNumber = snapshot.numChildren()+1;
                                    adminSessionRef.push({sessionNumber : sessionNumber, studentId : currentUser.uid, collegeId : collegeId, nodalId : 'NODAL1025'});   
                                });
                                var numberOfBookingsRef = new Firebase(FIREBASE_URL + 'datesOfUpcommingCounsellingSessions/'+year+'/'+month+'/'+day+'/numberOfBookings');
                                numberOfBookingsRef.once('value',function(snapshot) {
                                    if(snapshot.val()) 
                                        numberOfBookings = snapshot.val()+1;
                                    var newNumberOfBookingsRef = new Firebase(FIREBASE_URL + 'datesOfUpcommingCounsellingSessions/'+year+'/'+month+'/'+day);
                                    newNumberOfBookingsRef.set({numberOfBookings : numberOfBookings, date : day});
                                });


                            }, function(error) {
                                console.log("Error:", error);
                            });
                        });
                    }
                    else {
                        var sessionCollegeRef = new Firebase(FIREBASE_URL + 'collegeSessions/' + collegeId  + '/' + currentUser.uid + '/');
                        var sessionCollegeSync = (sessionCollegeRef);
                        sessionCollegeSync.update({studentquery : query});
                        
                        var sessionStudentRef = new Firebase(FIREBASE_URL + 'studentSessions/' + currentUser.uid  + '/' + collegeId + '/');
                        var sessionStudentSync = (sessionStudentRef);
                        sessionStudentSync.update({studentquery : query});

                    }
                }          
            })
        },
    };  
  return Session;
});