'use strict';

app.factory('Auth', function ($firebaseAuth,$location,  $filter, FIREBASE_URL, $rootScope,$http, $firebaseObject, $firebaseArray, $q,md5) {
  var ref = new Firebase(FIREBASE_URL);
  var auth = $firebaseAuth(ref);

  var Auth = {
    createProfile: function (user) {
      var profile = {
        studentname: user.studentname,
        studentmobile: user.studentmobile,
        email: user.email,
        gender: user.gender,
        password: user.password,
        profiletype: user.profiletype,
        studentAvailability: user.studentAvailability,        
        md5_hash: user.md5_hash,
        studentstatus: user.studentstatus,
        studentphoto: user.studentphoto,
        emailverificationstatus : user.emailverificationstatus,
        referredBy : user.referredBy

      };
      var profileRef = (ref.child('profileForStudents/' + user.uid));

      return profileRef.set(profile ,function(ref) {
          var useridref = new Firebase(FIREBASE_URL + '/' + 'currentUID' );
          useridref.once("value",function(snapshot){
            var currentCount = snapshot.val()+1;
            var newref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + user.uid);
            var newprofileObj = $firebaseObject(newref);
            newprofileObj.studentname = user.studentname;
            newprofileObj.studentmobile = user.studentmobile;
            newprofileObj.email = user.email;
            newprofileObj.gender = user.gender;
            newprofileObj.referredBy = user.referredBy;
            newprofileObj.dateOfRegistration = $filter('date')(new Date(),'d MMMM yyyy'); 
            newprofileObj.password = user.password;        
            newprofileObj.profiletype = user.profiletype;
            newprofileObj.studentAvailability = user.studentAvailability;
            newprofileObj.md5_hash = user.md5_hash;
            newprofileObj.studentstatus = user.studentstatus;
            newprofileObj.emailverificationstatus = user.emailverificationstatus;
            newprofileObj.studentphoto = user.studentphoto;
            newprofileObj.studenturlid = currentCount;
            useridref.set(currentCount);
            var idTableRef = new Firebase(FIREBASE_URL + "customUserIdTable/studentCustomId/" + currentCount);
            idTableRef.set(user.uid);
          
            newprofileObj.$save().then(function(ref) {
              var stuRef = new Firebase(FIREBASE_URL+"/DateWiseStuRegInfo");
              stuRef.once("value",function(students) {
                var index = students.numChildren()+1;
                stuRef.push({studentId:user.uid,studentNumber:index});
              });
             /* console.log("Student Profile is successfully created");*/
            }, function(error) {
              console.log("Error:", error);
            });
          });
        }), function(error) {
          console.log("Error:", error);
      };
    },

    
    updatereferBy: function (student,refer, $scope) {
          var ref11 = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + student + '/referredBy');
          var sync11 = $firebaseObject(ref11);
          var ref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + student + '/');
          sync11.$loaded(function(sync11) {
          if(sync11.$value === "nobody"){
            ref.update({ referredBy: refer },function () { 
             Auth.updateReferralIncentive(student,refer);
             });
          } 
        }); 
    },

    updateReferralIncentive: function(referringTo,referredById) {
      var referralCouponAmount = 100;
      var approvedSessionsCount = 0;
      var loopCounter = 0;
      var str = referringTo;
      var referringToId = str.split(":");
      var couponCode = referredById+"RID"+referringToId[1];
      var referredBy = "simplelogin:"+referredById;
      var studentSessionRef = new Firebase(FIREBASE_URL + 'profileForStudents/' +referringTo+ '/sessions');
      var studentSessionArr = $firebaseArray(studentSessionRef);
      studentSessionArr.$loaded( function () {
        var arrayLength = (studentSessionArr.length);
        angular.forEach(studentSessionArr, function(value,key) {
          var collegeId = value.$id;
          if(value.$id !== "totalIncentiveForSessions") {
            var collegeSessionRef = new Firebase(FIREBASE_URL + 'profileForCollege/' +collegeId+ '/sessions/' +referringTo);
            var collegeSessionObj =  $firebaseObject(collegeSessionRef);
            collegeSessionObj.$loaded( function(){
              loopCounter = loopCounter + 1;
              if(collegeSessionObj.sessionVerificationStatus === "approved") {
                approvedSessionsCount = approvedSessionsCount + 1;                              
              }
              if((loopCounter === arrayLength) && ((approvedSessionsCount > 3) || (approvedSessionsCount == 3)) && (approvedSessionsCount !== 0)) {
                Auth.incentifyForReferral(referringTo,referredBy,couponCode,referralCouponAmount);
              } 
            });
          }
        });
      });
    },

    incentifyForReferral: function(referringTo,referredBy,couponCode,referralCouponAmount) {
      var referredByIdRef = new Firebase(FIREBASE_URL + "profileForStudents/" +referringTo+ "/referredBy");
      var referredByIdObj = $firebaseObject(referredByIdRef);
      referredByIdObj.$loaded( function () {
        if(referredByIdObj.$value !== null) {
          Auth.generateCouponForReferral(referringTo,referredBy,couponCode,referralCouponAmount);                  
        }
        else {
        }
      });
    },

    updateDocument: function (studentId,newdocument,$scope) { 
               $scope.submitphotosuccesstext = false; 
               var ref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + studentId + '/' ); 
                ref.update({ studentdocument: newdocument }); 
                ref.update({ studentstatus: "notverified" });
                $scope.submitdocumentsuccesstext = true; 
    }, 


    generateCouponForReferral : function (referringTo,referredBy,couponCode,referralCouponAmount) {
     /* console.log("comming in function generateCouponForReferral");*/
      var incentiveSchemeRef = new Firebase(FIREBASE_URL + "incentiveScheme/incentivePlan/couponTable/" + couponCode);
      //var incentiveSchemeSync =  $firebase(incentiveSchemeRef);
      incentiveSchemeRef.update({referralIncentive:referralCouponAmount , studenturl: referringTo , validity : "not used" , incentiveType : "referral" , referredBy: referredBy}).then(function() {
        Auth.awardCoupon(referringTo,referredBy,couponCode,referralCouponAmount);
      })
    },

    awardCoupon: function(referringTo,referredBy,couponCode,referralCouponAmount) {
     /* console.log("comming in function awardCoupon");*/
      var couponTableRef = new Firebase(FIREBASE_URL + "incentiveScheme/incentivePlan/couponTable/" +couponCode);
      var couponTableObj = $firebaseObject(couponTableRef);
      couponTableObj.$loaded( function() {
        if(couponTableObj.$value !== null && couponTableObj.incentiveType == "referral") {
          Auth.awardCouponBasedOnReferral(referringTo,referredBy,couponCode,referralCouponAmount,couponTableObj.referralIncentive,couponTableObj.validity);
        }
      })
    },

    awardCouponBasedOnReferral: function(referringTo,referredBy,couponCode,referralCouponAmount,referralIncentive,couponValidity) {
     /* console.log("comming in function awardCouponBasedOnReferral");*/
      if(referralIncentive == referralCouponAmount) {
        if(couponValidity == "not used") {
          var stuIncentiveDetailBasedOnReferralRef = new Firebase(FIREBASE_URL + "incentiveScheme/studentIncentiveDetail/basedOnReferral/" + referredBy + "/" + referringTo);
          //var stuIncentiveDetailBasedOnReferralSync =  $firebase(stuIncentiveDetailBasedOnReferralRef);
          stuIncentiveDetailBasedOnReferralRef.update({couponCode: couponCode , addingAmount : referralCouponAmount }).then( function(){
            var stuBalanceRef = new Firebase(FIREBASE_URL + "incentiveScheme/studentIncentiveDetail/basedOnReferral/" + referredBy + "/totalIncentiveForReferral");
            var stuBalanceObj = $firebaseObject(stuBalanceRef);
            var newBalanceRef = new Firebase(FIREBASE_URL + "incentiveScheme/studentIncentiveDetail/basedOnReferral/" + referredBy);
            //var newBalanceSync = $firebase(newBalanceRef);
            stuBalanceObj.$loaded( function () {
              if (stuBalanceObj.$value == null) {
                newBalanceRef.update({ totalIncentiveForReferral: referralCouponAmount}).then( function () {
                  Auth.updateReferralAwardInStudentForge(referringTo,referredBy,couponCode,referralCouponAmount);
                })
              } 
              else { 
                var newBalance = stuBalanceObj.$value + referralCouponAmount;
                newBalanceRef.update({ totalIncentiveForReferral: newBalance}).then( function () {
                  Auth.updateReferralAwardInStudentForge(referringTo,referredBy,couponCode,referralCouponAmount);
                })
              }
            })
          })
        }
      }
    },

    updateReferralAwardInStudentForge: function(referringTo,referredBy,couponCode,referralCouponAmount) {
      var referralIncentiveRef = new Firebase(FIREBASE_URL + "profileForStudents/" + referredBy + "/referralIncentive/referredStudentsDetail/" + referringTo);
      //var referralIncentiveSync = $firebase(referralIncentiveRef);
      referralIncentiveRef.update({ addingAmount : referralCouponAmount });
      var totalIncentiveForReferralRef = new Firebase(FIREBASE_URL + "profileForStudents/" + referredBy + "/referralIncentive/totalIncentiveForReferral");
      var totalIncentiveForReferralObj = $firebaseObject(totalIncentiveForReferralRef);
      var referralRef = new Firebase(FIREBASE_URL + "profileForStudents/" + referredBy + "/referralIncentive");
      //var referralSync = $firebase(referralRef);
      totalIncentiveForReferralObj.$loaded( function() {
        if(totalIncentiveForReferralObj.$value == null) {
          referralRef.update({ totalIncentiveForReferral : referralCouponAmount }).then(function() { 
            Auth.updateThreeApprovedSessionsStatus(referringTo,referredBy);
            Auth.updateCouponValidity(referringTo,referredBy,couponCode,referralCouponAmount);
          })
        }
        else {
          var newAmount = totalIncentiveForReferralObj.$value + referralCouponAmount;
          referralRef.update({ totalIncentiveForReferral : newAmount }).then(function() { 
            Auth.updateThreeApprovedSessionsStatus(referringTo,referredBy);
            Auth.updateCouponValidity(referringTo,referredBy,couponCode,referralCouponAmount);
          })
        }
      })
    },

    updateCouponValidity: function(referringTo,referredBy,couponCode,referralCouponAmount) {
      var couponCodeRef = new Firebase(FIREBASE_URL + "incentiveScheme/incentivePlan/couponTable/" + couponCode); 
      //var couponCodeSync =  $firebase(couponCodeRef);
      var couponCodeObj = $firebase(couponCodeRef).$asObject();
      couponCodeObj.$loaded( function () {
        if(couponCodeObj.validity == "not used") {
          couponCodeRef.update({ validity : "used" });
        }
        else if(couponCodeObj.validity == "used"){
          couponCodeRef.update({ validity : "blacklist" });
          //Auth.somethingWentWrongSendMailToAdmin(studenturl,collegeurl,couponCode,sessionCouponAmount,referralCouponAmount,issue);
        }
      })  
    },

    updateThreeApprovedSessionsStatus : function(referringTo,referredBy) {
      var referredByRef = new Firebase(FIREBASE_URL + "profileForStudents/" +referredBy+ "/acceptedInvites/");
      //var referredBySync =  $firebase(referredByRef);
      var statusRef = new Firebase(FIREBASE_URL + "profileForStudents/" +referredBy+ "/acceptedInvites/" +referringTo);
      var statusObj = $firebaseObject(statusRef);
      statusObj.$loaded(function() {
        if(statusObj.$value === 'Not Done') {
          referredByRef.set("done");
        }
      })
    },

    saveEntry: function (student, newid) {
      var referstudent = (ref.child('profileForStudents' + '/' + student + '/acceptedInvites/' + newid));
      referstudent.set("Not Done"); 
    },

    updateProfile: function ($scope,student) {
          $scope.submitsuccesstext = false;
          var ref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + student + '/');
          //var sync = $firebase(ref);
          ref.update({ studentname: $scope.user.profile.studentname  });
          ref.update({ gender: $scope.user.profile.gender  });
          ref.update({ studentmobile: $scope.user.profile.studentmobile  });
          ref.update({ fathername: $scope.user.profile.fathername  });
          ref.update({ occupation: $scope.user.profile.occupation  });
          ref.update({ fathernumber: $scope.user.profile.fathernumber  });
          $scope.submitsuccesstext2 = false;
          $scope.submitsuccesstext3 = false;
          $scope.submitsuccesstext1 = true;

        },

    updateProfile2: function ($scope,student) {
          $scope.submitsuccesstext = false;
          var ref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + student + '/');
          //var sync = $firebase(ref);
          ref.update({ studentstatus: "notverified" });
          $scope.submitsuccesstext2 = true;
          $scope.submitsuccesstext3 = false;
          $scope.submitsuccesstext1 = false;

          if(typeof $scope.user.profile.academicrecord12thMarks!== 'undefined'){
            ref.update({ academicrecord12thMarks: $scope.user.profile.academicrecord12thMarks });
             if(typeof $scope.user.profile.academicrecordUGMarks !== 'undefined'){
                ref.update({ academicrecordUGMarks: $scope.user.profile.academicrecordUGMarks });
                if(typeof $scope.user.profile.academicrecordPGMarks !== 'undefined'){
                  ref.update({ academicrecordPGMarks: $scope.user.profile.academicrecordPGMarks });
                };
            };
          };
          if(typeof $scope.user.profile.studentstream !== 'undefined'){
            ref.update({ studentstream: $scope.user.profile.studentstream });
          };

        },

    updateProfile3: function ($scope,student) {
          $scope.submitsuccesstext = false;
          var ref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + student + '/');
          //var sync = $firebase(ref);
          ref.update({ studentabout: $scope.user.profile.studentabout });
          $scope.submitsuccesstext2 = false;
          $scope.submitsuccesstext1 = false;
          $scope.submitsuccesstext3 = true;
        },

    updateUG: function ($scope,student,ug) {
          $scope.submitsuccesstext = false;
          var ref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + student + '/' );
          //var sync = $firebase(ref);
          ref.update({ coursesUG: ug });
          $scope.submitsuccesstext = true;
        },    

    updatePG: function ($scope,student,pg) {
          $scope.submitsuccesstext = false;
          var ref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + student + '/' );
          //var sync = $firebase(ref);
           ref.update({ coursesPG: pg });
           $scope.submitsuccesstext = true;
    },

    updatePhoto: function (studentId,newphoto,$scope) { 
               $scope.submitphotosuccesstext = false; 
               var ref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + studentId + '/' ); 
               //var sync = $firebase(ref); 
                ref.update({ studentphoto: newphoto }); 
                ref.update({ studentstatus: "notverified" });
                $scope.submitphotosuccesstext = true; 
    }, 

    uploadAdmissionProof: function (studentId, studentAdmissionProof, $scope) {
       var ref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + studentId + '/' ); 
       //var sync = $firebase(ref); 
       ref.update({ studentAdmissionProof: studentAdmissionProof },function(){
          $scope.upload = true;
       })           
    },
     

    viewChanges: function (student) {
          var deferred = $q.defer();
          var ref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + student + '/');
          var view = $firebaseObject(ref);
          view.$loaded( function(view) {
            deferred.resolve(view);
            });
          return deferred.promise;
    },

    getUGCourses: function (student) {
          var deferred = $q.defer();
          var ref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + student + '/');
          var data = $firebaseObject(ref);
          data.$loaded( function(data) {
            deferred.resolve(data.coursesUG);
           /* console.log(data.coursesUG);           */
          });
          return deferred.promise;
    },

    getPGCourses: function (student) {
          var deferred = $q.defer();
          var ref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + student + '/');
          var data = $firebaseObject(ref);
          data.$loaded( function(data) {
            deferred.resolve(data.coursesPG);
           /* console.log(data.coursesPG);           */
          });
          return deferred.promise;
    },

    //funtion for changing student password starts here.
    changeStudentPassword: function(email,studentId,oldpassword,newpassword,$scope) {
      var ref = new Firebase(FIREBASE_URL);
        ref.changePassword({
        email: email,
        oldPassword:oldpassword,
        newPassword: newpassword
          }, function(error) {
            if (error) 
            {
                switch (error.code) {
                case "INVALID_PASSWORD":
                //console.log("The specified user account password is incorrect.");
                $scope.message = "The specified user account password is incorrect.";
                $scope.$evalAsync();
                break;
                case "INVALID_USER":
                //console.log("The specified user account does not exist.");
                $scope.message = "The specified user account does not exist.";
                $scope.$evalAsync();
                break;
                default:
                console.log("Error changing password:", error);
            }
          } else 
          {
            //console.log("User password changed successfully!");
            $scope.message = "User password changed successfully!";
            $scope.$evalAsync();
             (new Firebase(FIREBASE_URL + "profileForStudents/" + studentId + "/password")).set(newpassword);
              
              return;
          }
        });
     
  },
  //changing student password ends here.  

    followCollege: function (college,student,$scope) {   
      var d = new Date();
      var n= $filter('date')(d,'d MMMM yyyy HH:mm:ss');
      var refstudent = (ref.child('Followers/FollowerByStudentId/' + student + '/' + college));
      refstudent.set(n);
      var reffstudent = (ref.child('Followers/FollowerByCollegeId/' + college + '/' + student));
      reffstudent.set(n);
      $scope.following = 'yes'; 
      
    },

    unfollowCollege: function (college, student,$scope) {   
      var refstudent = (ref.child('Followers/FollowerByStudentId/' + student + '/' + college));
      refstudent.set(null);
      var reffstudent = (ref.child('Followers/FollowerByCollegeId/' + college + '/' + student));
      reffstudent.set(null);
      $scope.following = 'no'; 
      
    },

    getfollowers: function (college, student,$scope) {   
      var ref = new Firebase(FIREBASE_URL + 'Followers/FollowerByStudentId/'  + student + '/');
      ref.once("value", function(snapshot) {
        var a = snapshot.exists();
          if(a === true){
              var b = snapshot.child(college).exists();
               if(b === true){
                $scope.following = 'yes'; 
               }
               else{
                $scope.following = 'no';  
               } 
          }
          else{
                $scope.following = 'no';
          }
      }); 
    }, 
  
    createAdminForStudent: function (user) {
      var studentAdminSync = (ref.child('admin/studentUsers/' + user.uid));
      studentAdminSync.set(user.email);
    },  


    register: function (user) {
      return auth.$createUser({email:user.email, password:user.password}  );
    },


    login: function (email,password, $scope) {
      var deferred = $q.defer();
      ref.authWithPassword({
          "email": email,
          "password": password
      }, function(error, authData) {
        if (error) {
          $scope.error = error.message;
          if($scope.error === 'The specified password is incorrect.'){
            $("#pass").css({"border": "2px solid red"});
            $("#usr").css({"border": "1px solid rgba(92,169,214,.3)"});
          }
          if($scope.error === 'The specified user does not exist.'){
            $("#usr").css({"border": "2px solid red"});
            $("#pass").css({"border": "1px solid rgba(92,169,214,.3)"});
          }

          console.log($scope.error);
          $scope.modalShown = false;
          $scope.$apply();

        } else {
          $scope.error = "";
          $("#pass").css({"border": "1px solid rgba(92,169,214,.3)"});
          $("#usr").css({"border": "1px solid rgba(92,169,214,.3)"});
          var usertype = Auth.resolveUser().uid;
          deferred.resolve(usertype);
         (new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + usertype + '/' + '/studentAvailability')).set('online'); 
        }
      })
      return deferred.promise;
    },


    logout: function () {
      if(Auth.user.profile && Auth.user.accept) {
          Auth.user.profile.$destroy();
          Auth.user.accept.$destroy();
          // Auth.user.sessions.$destroy();
          angular.copy({}, Auth.user);
          $location.path('/');
      }
      (new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + Auth.resolveUser().uid + '/' + '/studentAvailability')).set('offline'); 
      auth.$unauth(); 
    },

    
    resolveUser: function() {
      var getAuth = auth.$getAuth();
      return getAuth;
    },

    

    signedIn: function() {
      return !!Auth.user.provider;
    },


    loginusinggoogle: function (user, $scope) {     
      var ref = new Firebase(FIREBASE_URL);
      ref.authWithOAuthPopup("google", function(error, authData) { 
          var reff = new Firebase(FIREBASE_URL +'admin/GoogleUsers/' + authData.uid );
          reff.once("value", function(snapshot) {
            var a = snapshot.exists();
            if(a === false){
            var ouser = {
                  uid: authData.uid, 
                  studentname:  authData.google.displayName,
                  email: authData.google.email,
                  gender: authData.google.cachedUserProfile.gender,
                  studentphoto: authData.google.profileImageURL,
                  verifyemail: authData.google.cachedUserProfile.verified_email
            };
                  Auth.createProfileForOAuth(ouser);
                  $location.path('/facebook'); 
            }
            else{
                angular.copy(authData, Auth.user);
                Auth.user.profile = $firebaseObject(ref.child('profileForStudents').child(authData.uid));
                Auth.user.accept = $firebaseObject(ref.child('profileForStudents').child(authData.uid).child('acceptedInvites'));
                $location.path('/dashboard');
            }
          });
      },{
        remember: "sessionOnly",
        scope: "email"
      });
    },



    loginusingfb: function (user, $scope) {     
      var ref = new Firebase(FIREBASE_URL);
      ref.authWithOAuthPopup("facebook", function(error, authData) {      
      var reff = new Firebase(FIREBASE_URL +'admin/FBUsers/' + authData.uid );
          reff.once("value", function(snapshot) {
            var a = snapshot.exists();
            if(a === false){
            var ouser = {
                  uid: authData.uid, 
                  studentname:  authData.facebook.displayName,
                  email: authData.facebook.email,
                  gender: authData.facebook.cachedUserProfile.gender,
                  studentphoto: authData.facebook.profileImageURL
            };
                  Auth.createProfileForOAuth(ouser);
                  $location.path('/facebook'); 
            }
            else{
                angular.copy(authData, Auth.user);
                Auth.user.profile = $firebaseObject(ref.child('profileForStudents').child(authData.uid));
                Auth.user.accept = $firebaseObject(ref.child('profileForStudents').child(authData.uid).child('acceptedInvites'));
                $location.path('/dashboard');
            }
          });          
      }, {
        remember: "sessionOnly",
        scope: "email,user_likes"
      });
    },

    AfterOAuthLogin: function(email,phone,uid,$scope){
      var provider = Auth.resolveUser().auth.provider;
      var oncomplete = function(){
        if(provider === 'facebook'){
        var studentAdminSync = (ref.child('admin/FBUsers/' + uid));
          studentAdminSync.set(email);
        }
        else{
         var studentAdminSync = (ref.child('admin/GoogleUsers/' + uid));
          studentAdminSync.set(email);  
        }  
        var studentAdminSync = (ref.child('admin/studentUsers/' + uid));
        studentAdminSync.set(email);   
        var dataToPost = {          
                                    to: email,
                                    pass: "No password as student from facebook and google", 
                                    sname: $scope.user.profile.studentname,
                                    semail : $scope.user.profile.email,
                                    smobile : $scope.user.profile.studentmobile
                                };
                    $http({
                    url: "/sendstudentregistrationmail", 
                    method: "GET",
                    params: {   to: dataToPost.to,
                                semail : dataToPost.semail,
                                sname: dataToPost.sname,
                                pass : dataToPost.pass,
                                smobile : dataToPost.smobile,
                            }
                    }).success(function(serverResponse) {
                        console.log(serverResponse);
                    }).error(function(serverResponse) {
                        console.log(serverResponse);
                    });
                    $http({
                    url: "/sendmailtostudentafterregistration", 
                    method: "GET",
                    params: {   
                                to:      dataToPost.to,
                                semail:  dataToPost.semail,
                                sname:   dataToPost.sname,
                            }
                    }).success(function(serverResponse) {
                        console.log(serverResponse);
                    }).error(function(serverResponse) {
                        console.log(serverResponse);
                    });  
          var useridrefff = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + uid + '/emailget/');
          useridrefff.once("value",function(snapshot){
            useridrefff.set(null);          
          });

      };
       
      $location.path('/signup-success');
      var useridref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + uid + '/');
          useridref.update({email: email});
          useridref.update({studentmobile: phone},oncomplete);
    },

    createProfileForOAuth: function(user){
          var useridref = new Firebase(FIREBASE_URL + '/' + 'currentUID' );
          useridref.once("value",function(snapshot){
            var currentCount = snapshot.val()+1;
            var newref = new Firebase(FIREBASE_URL + 'profileForStudents' + '/' + user.uid);
            var newprofileObj = $firebaseObject(newref);
            newprofileObj.studentname = user.studentname;
            if(typeof user.email !== 'undefined'){
              newprofileObj.email = user.email;
            }
            else{
              newprofileObj.emailget = "false";
            }
            if(typeof user.gender !== 'undefined'){
              newprofileObj.gender = user.gender.charAt(0).toUpperCase() + user.gender.slice(1);  
            }
            newprofileObj.referredBy = 'nobody';
            newprofileObj.dateOfRegistration = $filter('date')(new Date(),'d MMMM yyyy'); 
            newprofileObj.profiletype = 'student';
            newprofileObj.studentAvailability = 'offline';
            newprofileObj.md5_hash = md5.createHash(user.email || '');
            newprofileObj.studentstatus = 'notverified';
            if(typeof user.email !== 'undefined'){
               newprofileObj.emailverificationstatus = 'true'; 
            }
            else{
               newprofileObj.emailverificationstatus = 'false';              
            }
            newprofileObj.studentphoto = user.studentphoto;
            newprofileObj.studenturlid = currentCount;
            useridref.set(currentCount);
            var idTableRef = new Firebase(FIREBASE_URL + "customUserIdTable/studentCustomId/" + currentCount);
            idTableRef.set(user.uid);
          
            newprofileObj.$save().then(function(ref) {
              var stuRef = new Firebase(FIREBASE_URL+"/DateWiseStuRegInfo");
              stuRef.once("value",function(students) {
                var index = students.numChildren()+1;
                stuRef.push({studentId:user.uid,studentNumber:index});
              });
            }, function(error) {
              console.log("Error:", error);
            });
          });
    },

    submitQueryForm : function (dream_college,course_intrested,stu_queries,currentUser,$scope) {
      var stu_query_Reff = new Firebase(FIREBASE_URL+ "/DashboardQuery/" +currentUser);
      stu_query_Reff.push({ studentDreamCollege : dream_college, 
                             courseIntrested : course_intrested, 
                             studentQuery : stu_queries
                          });
      var stu_profile_Reff = new Firebase(FIREBASE_URL+ "/profileForStudents/" +currentUser);
      stu_profile_Reff.update({DashboardQuerySubmitted:"yes"});
    },

    user: {}
  };

 
  auth.$onAuth(function(authData) {
  if (authData) {
    angular.copy(authData, Auth.user);
    Auth.user.profile = $firebaseObject(ref.child('profileForStudents').child(authData.uid));
    Auth.user.accept = $firebaseObject(ref.child('profileForStudents').child(authData.uid).child('acceptedInvites'));
    Auth.user.sessions = $firebaseObject(new Firebase(FIREBASE_URL + 'profileForStudents/' + authData.uid + '/sessions' + '/'));
  } else {
    if(Auth.user.profile && Auth.user.accept) {
      Auth.user.profile.$destroy();
      Auth.user.accept.$destroy();
      //Auth.user.sessions.$destroy();
      angular.copy({}, Auth.user);
    }
   }
  });

  
  return Auth;
});