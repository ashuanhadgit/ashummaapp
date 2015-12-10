'use strict';

app.controller('MainCtrl', function ($window, $route, $scope,$http , $log, $document, $location, $sce, Angularytics, md5, toaster, Auth, Search, dropdownFactory, Webinar) {
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.user = Auth.user;
  $scope.posTemp = "";
  $scope.successmessage = "";
  $scope.knowMoreClicked = 'false';
  $scope.webinar_booking_success = [];
  $scope.webinarAlreadyBooked = [];
  $scope.anyLiveWebinars = [];
  $scope.$route = $route;
  $scope.error ="";
  
    $scope.custom = {
        video: 'FXh6tuXPXGU',
        player: null,
        vars: {
            controls: 0,
            rel:0
        }
    };

    $scope.gender = [{
            name: "Male"
         },{  
            name: "Female"
    }];


              /*++++++++++++++++++++++++++++++++google Event Tracking+++++++++++++++++++++++++++++*/

    $scope.trackEvent = function(catagory,action,label) {
        Angularytics.trackEvent(catagory, action, label);
    };

              /*++++++++++++++++++++++++++++++++google Event Tracking+++++++++++++++++++++++++++++*/


                                             /*live webinar div*/

    $scope.isAnyWebinarLive = function() {
      $scope.anyLiveWebinars = Webinar.isAnyWebinarLive();
    };

    $scope.getLocationDefaultNavBar = function() {
      var loc = $location.path();
      if(loc === '/live-webinar') {
        $('#nav-login-form').hide();
        $('#nav-how-it-works').hide();
      }
      else{
        $('#nav-login-form').show();
        $('#nav-how-it-works').show();
      }
    };

    $scope.showWebinar = function(webinar) {
      $scope.currentLiveWebinar = webinar;
      if(Auth.signedIn()) {
        $scope.bookThisWebinar(Auth.resolveUser().auth.uid,webinar);
        $scope.getQNAdetails(webinar);
        $scope.getVedioSrc(webinar.liveStreamURL)
        $("#listOfLiveWebinar").hide();
        $('#LiveWebinar').show();
      }
      else {
        $(".xxaa").css("border","3px solid red");
      }
    };

    $scope.bookThisWebinar = function(currentStudent,currentWebinar) {
      var currentStudent = currentStudent;
      Webinar.bookWebinar($scope ,currentWebinar.liveStreamURL, currentWebinar.mentorName, currentWebinar.mentorEmail,currentWebinar.mentorMobile,currentWebinar.mentorGender,currentWebinar.mentorPhoto,currentWebinar.webinarTopic,currentWebinar.webinarDate,currentWebinar.webinarTime,currentWebinar.webinarDescription,currentWebinar.webinarDuration,currentWebinar.studentsAttending,currentWebinar.collegeId,currentWebinar.webinarId,currentStudent);
    };

    $scope.getVedioSrc = function(liveStreamURL) {
      var Id = liveStreamURL.split(".be/");
      var vedioId = Id[1];
      var videourl = "https://www.youtube.com/embed/" + vedioId + "?rel=0&amp;showinfo=0&modestbranding=1&autohide=1";
      $scope.video = {src:videourl, title:"LiveStreamUrl"};
    };

    $scope.getQNAdetails = function(webinar) {
      Webinar.getQNAdetails(webinar, $scope);
    };

    $scope.askQuestion = function(question) {
      Webinar.studentAskedAQuestion($scope.user.uid, $scope.user.profile.studentname, $scope.currentLiveWebinar, question, $scope);
      $scope.question = '';
    };

    $scope.loginforlive = function (studentemail,studentpassword) {
      $scope.modalShown = true;
      Auth.login(studentemail,studentpassword, $scope).then(function () {
        var usertype = Auth.resolveUser().auth.uid;
        $scope.modalShown = false;
        $scope.getQNAdetails($scope.currentLiveWebinar);
        $scope.getVedioSrc($scope.currentLiveWebinar.liveStreamURL);
        $scope.bookThisWebinar(usertype,$scope.currentLiveWebinar);
        $("#listOfLiveWebinar").hide();
        $('#LiveWebinar').show();
      });
    };

    $scope.registerforlive = function (studentname,email,password,studentmobile,gender) {
      if(typeof $scope.currentLiveWebinar !== 'undefined') {
        $scope.submitbuttondisabled = true;
        $scope.modalShown = true;
        Auth.register($scope.user).then(function(user) {
          return Auth.login($scope.user.email,$scope.user.password, $scope).then(function() {
            user.md5_hash = md5.createHash($scope.user.email || '');
            user.studentname = studentname;
            user.studentmobile = studentmobile;
            user.email = angular.lowercase(email); 
            user.gender = gender;
            user.password = password;
            user.profiletype = 'student';
            user.studentAvailability = 'offline';
            user.studentstatus = 'notverified';
            user.emailverificationstatus = 'false';
            user.referredBy = 'nobody';
            user.studentphoto ='https://www.filepicker.io/api/file/zEAoaiVbRRW0HrtJApxM';
            return Auth.createProfile(user);
          }).then(function() {
            $scope.modalShown = false;
            var urlId = user.uid;
            Auth.createAdminForStudent(user);
            var dataToPost = {
                                  to: user.email, 
                                  pass:user.password, 
                                  sname:user.studentname,
                                  hashkey : user.md5_hash,
                                  semail : user.email,
                                  smobile :user.studentmobile,
                                  urlId : urlId
                              };
                  $http({
                  url: "/sendstudentmail", 
                  method: "GET",
                  params: {   to: dataToPost.to,
                              sname: dataToPost.sname,
                              pass : dataToPost.pass,
                              hashkey : dataToPost.hashkey,
                              urlId : dataToPost.urlId
                          }
                  }).success(function(serverResponse) {
                      console.log(serverResponse);
                  }).error(function(serverResponse) {
                      console.log(serverResponse);
                  });
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
            $scope.modalShown = false;
            $scope.bookThisWebinar(user.uid,$scope.currentLiveWebinar);
            $scope.getQNAdetails($scope.currentLiveWebinar);
            $scope.getVedioSrc($scope.currentLiveWebinar.liveStreamURL)
            $("#listOfLiveWebinar").hide();
            $('#LiveWebinar').show();
          });
        }, function(error) {
          $scope.modalShown = false;
          $scope.submitbuttondisabled = false;
          $scope.error = error.message;
          $("#signupemail").css({'border': '2px solid red','color': 'red'});
        });
        $scope.message = "";
        $scope.error ="";        
      }
      else {
        $scope.register(studentname,email,password,studentmobile,gender);       
      }
    };

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };


                                             /*live webinar div*/


    $scope.AfterOAuthLogin = function () {
    var uid =Auth.resolveUser().uid;
    Auth.AfterOAuthLogin($scope.user.profile.email,$scope.user.profile.studentmobile,uid,$scope);
    };


    $scope.loginusingfb = function () {
      Auth.loginusingfb($scope.user , $scope);
    };

    $scope.loginusinggoogle = function () {
      Auth.loginusinggoogle($scope.user , $scope);
    };

    $scope.login = function () {
      $scope.modalShown = true;
      Auth.login($scope.user.stuemail,$scope.user.stupassword, $scope).then(function () {
        var usertype = Auth.resolveUser().auth.uid;
        $location.path('/dashboard');
      });
    };

    $scope.doThisForStudent = function(studentEmail1) {
    studentEmail1 = angular.lowercase(studentEmail1); 
      if(!studentEmail1) {
        $scope.student1IdFlag = "";
        $scope.student1Uid = "";
      }
      else {
          Search.getStudentIdByEmail(studentEmail1).then ( function ( result ) {
          $scope.student1Uid = result;
          if($scope.student1Uid !== "user doesnot exists") {
            $scope.student1IdFlag = "Done";
            $scope.student1Name = Search.getStudentName($scope.student1Uid);
            }
          else{
            $scope.student1IdFlag = "Not Done";
          }
        }, function(error){
            $scope.student1IdFlag = "Not Done";
            console.log(error);
        });
      }
    };

  $scope.toTheTop = function() {
      $document.scrollTopAnimated(0, 2000).then(function() {
      });
    };

 
  $scope.register = function (studentname,email,password,studentmobile,gender) {
        $scope.submitbuttondisabled = true;
        $scope.modalShown = true;
          Auth.register($scope.user).then(function(user) {
            return Auth.login($scope.user.email,$scope.user.password, $scope).then(function() {
              user.md5_hash = md5.createHash($scope.user.email || '');
              user.studentname = studentname;
              user.studentmobile = studentmobile;
              user.email = angular.lowercase(email); 
              user.gender = gender;
              user.password = password;
              user.profiletype = 'student';
              user.studentAvailability = 'offline';
              user.studentstatus = 'notverified';
              user.emailverificationstatus = 'false';
              user.referredBy = 'nobody';
              user.studentphoto ='https://www.filepicker.io/api/file/zEAoaiVbRRW0HrtJApxM';
              return Auth.createProfile(user);
            }).then(function() {
              $scope.modalShown = false;
              //var str = user.uid;
              var urlId = user.uid;
              Auth.createAdminForStudent(user);
              var dataToPost = {
                                    to: user.email, 
                                    pass:user.password, 
                                    sname:user.studentname,
                                    hashkey : user.md5_hash,
                                    semail : user.email,
                                    smobile :user.studentmobile,
                                    urlId : urlId
                                };
                    $http({
                    url: "/sendstudentmail", 
                    method: "GET",
                    params: {   to: dataToPost.to,
                                sname: dataToPost.sname,
                                pass : dataToPost.pass,
                                hashkey : dataToPost.hashkey,
                                urlId : dataToPost.urlId
                            }
                    }).success(function(serverResponse) {
                        console.log(serverResponse);
                    }).error(function(serverResponse) {
                        console.log(serverResponse);
                    });
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
              $location.path('/signup-success');
            });
          }, function(error) {
            $scope.modalShown = false;
            $scope.submitbuttondisabled = false;
            $scope.error = error.message;
            $("#signupemail").css({'border': '2px solid red','color': 'red'});
          });
          $scope.message = "";
          $scope.error ="";
  };

  $scope.clearall = function () {
        $scope.error = "";
        $("#signupemail").css({"border": "1px solid rgba(92,169,214,.3)",'color': 'black'});
  };


    $scope.setDefaults = function() {
      var s = window.document.querySelector('.main-page-feature-second-how-it-works-img-div');
      var q = window.document.querySelector('.main-page-feature-third');
      var pos=null;

      if(s&&q) {
        q.style.height = '477px';
        s.style.height = '1px';
      /*  pos = s.getBoundingClientRect(); */
      }
    };

    $(window).scroll(function() {

      var stickermax = 3650;
      var windowpos = $window.scrollY;

      var s = $('.main-page-feature-second-how-it-works-img-div');

      if(windowpos>=0 && windowpos < 2100) {
        $('.main-page-feature-second-how-it-works-desktop-img img').css("margin-top","-5px");
      }
      else if(windowpos >= 2100 && windowpos < 2650) {
        $('.main-page-feature-second-how-it-works-desktop-img img').css("margin-top","-220px");
      }
      else if (windowpos >= 2650 && windowpos < 3100 ) {
        $('.main-page-feature-second-how-it-works-desktop-img img').css("margin-top","-445px");
      }
      else if(windowpos >= 3100) {
        $('.main-page-feature-second-how-it-works-desktop-img img').css("margin-top","-670px");
      }
    });

    $scope.stateSelectedFromSiteMap = function(stateId) {
        $scope.stateToView = stateId;
        $scope.state = '';
        $scope.state = dropdownFactory.getStateDropdownObject($scope.stateToView);
        $scope.disableButton1 = false;
        dropdownFactory.sendState($scope.state);
     };

     $scope.courseSelectedFromSiteMap = function(courseId) {
        $scope.courseToView = courseId;
        $scope.course = '';
        $scope.course = dropdownFactory.getCourseDropdownObject($scope.courseToView);
        $scope.disableButton2 = false;
        dropdownFactory.sendCourse($scope.course);
    };


    $scope.state = '';

      $scope.go = function ( path ) {
        $location.path( path );
      };

     $scope.dropdownMessage = 'Retrieving Locations...';
     
     $scope.states = dropdownFactory.getAllStateDropdownObjects();
      $scope.stateSelected = function() {
        $scope.state = '';
        $scope.state = dropdownFactory.getStateDropdownObject($scope.stateToView);
        $scope.disableButton1 = false;
        dropdownFactory.sendState($scope.state);
     }

    $scope.states.$loaded().then(function(data) {
        $scope.dropdownMessage = 'Where do you want to study?';
    });

    $scope.toTheTop = function() {
        $document.scrollTopAnimated(0, 2000).then(function() {
        });
    };

    $scope.dropdownMessageCourses = 'Retrieving Courses...';
    
    $scope.courses = dropdownFactory.getAllCourseDropdownObjects();
    
    $scope.courseSelected = function() {
        $scope.course = '';
        $scope.course = dropdownFactory.getCourseDropdownObject($scope.courseToView);
        $scope.disableButton2 = false;
        dropdownFactory.sendCourse($scope.course);
    };

    $scope.pop = function(){
       toaster.pop('success', "title", "text");
    };

    $scope.courses.$loaded().then(function(data) {
        $scope.dropdownMessageCourses = 'What do you want to study?';
    });

    $scope.androidNotification = function () {
      dropdownFactory.saveAndroidRequest($scope.notify.email).then(function() {
       var dataToPost = {
                                      to: 'support@gmail.com', 
                                      email : $scope.notify.email,
                          };
                      $http({
                      url: "/sendandroidrequestmail", 
                      method: "GET",
                      params: {   to: dataToPost.to,
                                  email : dataToPost.email     
                              }
                      }).success(function(serverResponse) {
                        $scope.notify.email = null;
                        $scope.successmessage = "Your Email is Received Thank you for Showing Interest."
                          console.log(serverResponse);
                      }).error(function(serverResponse) {
                          $scope.successmessage = "Something Went Wrong Please Try After Sometime."
                          console.log(serverResponse);
                      });
      });
    };
    
    
    $scope.sendSuccessFully = 'Not Done';
    $scope.forgotPassword = function  () {
      $scope.message='';
        $scope.sendSuccessFully = 'Not Done';
        dropdownFactory.forgotPassword($scope.user.email,$scope);
        $scope.user.email='';
      };
    $scope.resetPassword = function(){
      $scope.message = '';
      var location=$location.path();
          var temp = location.split("abcd.xyz=");
          var token = temp[1].split('&')[0];
          var email =temp[1].split('&')[1].split('email=')[1];
          dropdownFactory.resetPassword(email,token,$scope.user.resetpassword,$scope);
          $scope.user.resetpassword= '';
          $scope.confirm_password= '';
    };

    $scope.isUserSignedIn = function() {
      if($scope.signedIn() === false) {
          var w = window.innerWidth;
          var h = window.innerHeight;
          if(w<767)
          {
            $("#popup-background").hide();
            $(".newsletter-message").hide();
          }
          else
          {
            $('.newsletter-message').show();
            $("#popup-background").show();
          }
      }
      else {
          $('.newsletter-message').hide();
          $("#popup-background").hide();
      }
    };

    $scope.closeTheQueryModal = function() {
        $('.newsletter-message').fadeOut('slow', function(c){
          $('.newsletter-message').remove();
          $("#popup-background").fadeOut();
        });
    };

  }).value('duScrollOffset', 30);
