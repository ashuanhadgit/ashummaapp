'use strict';

app.controller('StudentDashCtrl', function ($location, $document, $controller, $http, $sce, $scope, Angularytics, toaster, Search, Auth, Blog, Feedback, Webinar) {
  
  $scope.referalb = ""; 
  $scope.signedIn = Auth.signedIn;
  $scope.user = Auth.user;
  $scope.webinar_booking_success = [];
  $scope.webinarAlreadyBooked = [];
  $scope.newphoto = "";
  $scope.gender = [{
          name: "Male"
       },{  
          name: "Female"
  }];

  $scope.custom = {
      video: 'iSCIesIM8Ww',
      player: null,
      vars: {
          controls: 0,
          rel:0
      }
  };

                /*++++++++++++++++++++++++++++++++google Event Tracking+++++++++++++++++++++++++++++*/

  $scope.trackEvent = function(catagory,action,label) {
      Angularytics.trackEvent(catagory, action, label);
  };

              /*++++++++++++++++++++++++++++++++google Event Tracking+++++++++++++++++++++++++++++*/

  $scope.loginError = function(name, affiliation, state, image){
    $scope.collegeName = name;
    $scope.collegeAff = affiliation;
    $scope.collegeState = state;
    $scope.collegeImage = image;

    $scope.loginErrorModal = true;
    $scope.$applyAsync();
    

  };

  $scope.close = function(){
    $scope.loginErrorModal = false;
    $scope.$applyAsync();
  };



                                                        /*webinar*/

  $scope.thisBookedWebinarLive = [];
  $scope.studentDashboardChangeTab = function(x) {
    $('#index1').removeClass('focus');
    $('#index2').removeClass('focus');
    $('#index3').removeClass('focus');
    $('#index4').removeClass('focus');
    $('#index5').removeClass('focus');
    x = '#'+x;
    $(x).addClass('focus');
  };
  
  $scope.viewTab = "sessions";
  var tempToggle = true;
  
  $scope.searchToggle = function() {
    var a = document.getElementById("searchToggleBtn");
    if(tempToggle) {
      tempToggle = false;
      $scope.viewTab = "webinars";
      $scope.$evalAsync();
      a.style.marginLeft = "30px";
    }
    else if(!tempToggle){
      tempToggle = true;
      $scope.viewTab = "sessions";
      $scope.$evalAsync();
      a.style.marginLeft = null;
    }
  };
                                                    /*Ashu Load More Webinar Changes*/
  $scope.getBookedWebinarsByStudent = function() {
     if($scope.signedIn()){
          var currentStudent = Auth.resolveUser().auth.uid;
          Webinar.getBookedWebinarForStudent(currentStudent, $scope);
      }  
     else{
          Webinar.getBookedWebinarForStudent(currentStudent, $scope);     
     } 
  };

  $scope.getUpcommingWebinarsForStudent = function () {
    if($scope.signedIn()){
        var currentStudent = Auth.resolveUser().auth.uid;
        Webinar.getUpcommingWebinarsForStudent(currentStudent, $scope);
    }
    else{
        Webinar.getUpcommingWebinarsForStudent(currentStudent, $scope);

    }
  };

  $scope.loadMoreWebinarsForStudent = function() {
    if($scope.signedIn()){
        var currentStudent = Auth.resolveUser().auth.uid;
        Webinar.loadMoreWebinarsForStudent(currentStudent, $scope);
    }
    else{
        Webinar.loadMoreWebinarsForStudent(currentStudent, $scope);
    }    
  };

                                                /*Ashu Load More Webinar Changes Ends*/


  $scope.bookThisWebinar = function(currentWebinar, webinarIndex) {
    var currentStudent = Auth.resolveUser().auth.uid;
    Webinar.bookWebinar($scope ,currentWebinar.liveStreamURL, currentWebinar.mentorName, currentWebinar.mentorEmail,currentWebinar.mentorMobile,currentWebinar.mentorGender,currentWebinar.mentorPhoto,currentWebinar.webinarTopic,currentWebinar.webinarDate,currentWebinar.webinarTime,currentWebinar.webinarDescription,currentWebinar.webinarDuration,currentWebinar.studentsAttending,currentWebinar.collegeId,currentWebinar.webinarId,currentStudent);
    $(".web"+webinarIndex).hide();
  };

  $scope.attendWebinar = function(webinarDetail) {
    $scope.currentlyAttendingWebinar = webinarDetail;
    var Id = webinarDetail.liveStreamURL.split(".be/");
    var vedioId = Id[1];
    var videourl = "https://www.youtube.com/embed/" + vedioId + "?rel=0&amp;showinfo=0&modestbranding=1&autohide=1";
    $scope.video = {src:videourl, title:"LiveStreamUrl"};
    Webinar.attendWebinarByStudent(webinarDetail, $scope);
    $scope.getQNAdetails();
  };

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

  $scope.askQuestion = function(question) {
    $scope.question = '';
    $scope.$evalAsync();
    Webinar.studentAskedAQuestion($scope.user.uid, $scope.user.profile.studentname, $scope.currentlyAttendingWebinar, question, $scope);
  };

  $scope.getQNAdetails = function() {
    Webinar.getQNAdetails($scope.currentlyAttendingWebinar, $scope);
  };

  $scope.isThisBookedWebinarLive = function(webinarId) {
      $scope.thisBookedWebinarLive[webinarId] = "notLiveYet";
      Webinar.isThisBookedWebinarLive(webinarId, $scope);

  };

  $scope.isAnyWebinarLive = function() {
      $scope.anyLiveWebinars = Webinar.isAnyWebinarLive(); 
  };

  $scope.notifyAdminForStudentIntrestInWebinar = function(webinarInfo) {
      toaster.pop('wait', "Email verification", 'Sending Email', 10000);
      var dataToPost = {
                            stuEmail: $scope.user.profile.email, 
                            stuPass: $scope.user.profile.password, 
                            stuName: $scope.user.profile.studentname,
                            webTopic : webinarInfo.webinarTopic,
                            webMentor : webinarInfo.mentorName
                        };
      $http({
        url: "/notifyAdminForWebinarBookingWhenSeatsAreFull", 
        method: "GET",
        params: {   stuEmail: dataToPost.stuEmail,
                    stuName: dataToPost.stuName,
                    stuPass : dataToPost.stuPass,
                    webTopic : dataToPost.webTopic,
                    webMentor : dataToPost.webMentor
                }
      }).success(function(serverResponse) {
          if(serverResponse =='sent'){
            toaster.clear();
            toaster.pop('success', "Thankyou!", "Your request has been registered.");
           
          }
          else if(serverResponse =='error') {
            toaster.clear();
            toaster.pop('error', "Oops!", "Something went wrong please try after some time.");
             
          }
          else
          {
            toaster.clear();
            toaster.pop('success', "Thankyou!", "Your request has been registered.");
           
          }
      }).error(function(serverResponse) {
          if(serverResponse =='sent'){
            toaster.clear();
            toaster.pop('success', "Thankyou!", "Your request has been registered.");
           
          }
          else if(serverResponse =='error') {
            toaster.clear();
            toaster.pop('error', "Oops!", "Something went wrong please try after some time.");
             
          }
          else
          { 
            toaster.clear();
            toaster.pop('error', "Oops!", "Something went wrong please try after some time.");
           
          }
      });
  };

  $scope.checkUrlForCollapseAndActiveClass = function () {
    var temp = $location.path().split('/')[1];
    if(temp === 'all-completed-webinars' || temp === 'student-webinar-detail') {
      $scope.checkWebinarCollapse = '';
      $scope.checkHouseCollapse = 'collapse';
      if(temp === 'student-webinar-detail') 
        $scope.studentwebinardetail = 'active';
      else if(temp === 'all-completed-webinars') 
        $scope.completedwebinars = 'active';
    }
    else if(temp === 'house') {
      var houseName = $location.path().split('/')[2];
      $scope.checkWebinarCollapse = 'collapse';
      $scope.checkHouseCollapse = '';
      if(houseName === 'engineering') 
        $scope.engineering = 'active';
      else if(houseName === 'medical') 
        $scope.medical = 'active';
      else if(houseName === 'hospitality') 
        $scope.hospitality = 'active';
      else if(houseName === 'design & fashion') 
        $scope.fashion = 'active';
      else if(houseName === 'finance & commerce') 
        $scope.finance = 'active';
      else if(houseName === 'architecture') 
        $scope.architecture = 'active';
      else if(houseName === 'AngrEasy') 
        $scope.AngrEasy = 'active';
      else if(houseName === 'media-journalism') 
        $scope.journalism = 'active';
      else if(houseName === 'others') 
        $scope.others = 'active';
      else if(houseName === 'Fine Arts') 
        $scope.fineArts = 'active';
    }  
    else if(temp === 'category') {
      var houseName = $location.path().split('/')[2];
      $scope.checkWebinarCollapse = 'collapse';
      $scope.checkHouseCollapse = '';
      if(houseName === 'engineering') 
        $scope.engineering = 'active';
      else if(houseName === 'medical') 
        $scope.medical = 'active';
      else if(houseName === 'hospitality') 
        $scope.hospitality = 'active';
      else if(houseName === 'design & fashion') 
        $scope.fashion = 'active';
      else if(houseName === 'finance & commerce') 
        $scope.finance = 'active';
      else if(houseName === 'architecture') 
        $scope.architecture = 'active';
      else if(houseName === 'AngrEasy') 
        $scope.AngrEasy = 'active';
      else if(houseName === 'media-journalism') 
        $scope.journalism = 'active';
      else if(houseName === 'others') 
        $scope.others = 'active';
      else if(houseName === 'Fine Arts') 
        $scope.fineArts = 'active';
    } 
    else {
      $scope.checkWebinarCollapse = 'collapse';
      $scope.checkHouseCollapse = 'collapse';
      if(temp === 'dashboard') 
        $scope.dashboard = 'active';
      else if(temp === 'student-college-search') 
        $scope.studentcollegesearch = 'active';
      else if(temp === 'student-fund') 
        $scope.studentfund = 'active';
      else if(temp === 'student-counselling-center') 
        $scope.studentcounselling = 'active';
    }              
  }

                                                        /*End webinar*/


  $scope.student1IdFlag = "";
  $scope.showNewInvitePop = false;

  $scope.show_pop = function() {
    $scope.showNewInvitePop = true;
  };  

  $scope.close_all_pop = function() {
    $scope.showNewInvitePop = false;
  };

  $scope.roles = [
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
  $scope.uSer = {
    roles: []
  };

$scope.rolesA = [
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
  $scope.uSerA = {
    rolesA: []
  };

   $scope.checkaccept = function () {
    if(typeof ($scope.user.profile.acceptedInvites) == 'undefined' ){
        $scope.hidedetails = "true";
     }
    else {
        $scope.hidedetails = "false";
      }
  };

  $scope.refermail = function() {
    if($scope.student1IdFlag !== "Done"){
      $scope.refer();
    }
    else {
      $scope.refertologin();
    }


  }

  $scope.refer = function () {
   toaster.pop('wait', "Sending Invitation", 'Sending Email', 10000);
    var dataToPost = {
                                to: $scope.user.referemail,
                                from: $scope.user.profile.email,
                                sname: $scope.user.profile.studentname,
                                rname: $scope.user.refername
                            };
                $http({
                url: "/sendrefermail", 
                method: "GET",
                params: {   to: dataToPost.to,
                            sname: dataToPost.sname,
                            from : dataToPost.from,
                            rname : dataToPost.rname
                        }
                }).success(function(serverResponse) {
                    if(serverResponse =='sent'){
                      toaster.clear();
                      $scope.user.refername = "";
                      $scope.user.referemail = "";
                      toaster.pop('success', "Thankyou!", "Your Invitation Link has been sent.");
                    }
                    else if(serverResponse =='error') {
                      toaster.clear();
                      toaster.pop('error', "Oops!", "Something went wrong please try after some time.");
                       
                    }
                    else
                    {
                      $scope.user.refername = "";
                      $scope.user.referemail = "";
                      toaster.clear();
                      toaster.pop('success', "Thankyou!", "Your Invitation Link has been sent.");
                     
                    }
                }).error(function(serverResponse) {
                    if(serverResponse =='sent'){
                      toaster.clear();
                      toaster.pop('success', "Thankyou!", "Your Invitation Link has been sent.");
                     
                    }
                    else if(serverResponse =='error') {
                      toaster.clear();
                      toaster.pop('error', "Oops!", "Something went wrong please try after some time.");
                       
                    }
                    else
                    { 
                      toaster.clear();
                      toaster.pop('error', "Oops!", "Something went wrong please try after some time.");
                     
                    }
                });
  };

  $scope.refertologin = function () {
    toaster.pop('wait', "Sending Invitation", 'Sending Email', 10000);
    var dataToPost = {
                                to: $scope.user.referemail,
                                from: $scope.user.profile.email,
                                sname: $scope.user.profile.studentname,
                                rname: $scope.user.refername
                            };
                $http({
                url: "/sendreferloginmail", 
                method: "GET",
                params: {   to: dataToPost.to,
                            sname: dataToPost.sname,
                            from : dataToPost.from,
                            rname : dataToPost.rname
                        }
                }).success(function(serverResponse) {
                    if(serverResponse =='sent'){
                      toaster.clear();
                      $scope.user.refername = "";
                      $scope.user.referemail = "";
                      toaster.pop('success', "Thankyou!", "Your Invitation Link has been sent.");
                     
                    }
                    else if(serverResponse =='error') {
                      toaster.clear();
                      toaster.pop('error', "Oops!", "Something went wrong please try after some time.");
                       
                    }
                    else
                    {
                      toaster.clear();
                      $scope.user.refername = "";
                      $scope.user.referemail = "";
                      toaster.pop('success', "Thankyou!", "Your Invitation Link has been sent.");
                     
                    }
                }).error(function(serverResponse) {
                    if(serverResponse =='sent'){
                      toaster.clear();
                      toaster.pop('success', "Thankyou!", "Your Invitation Link has been sent.");
                     
                    }
                    else if(serverResponse =='error') {
                      toaster.clear();
                      toaster.pop('error', "Oops!", "Something went wrong please try after some time.");
                       
                    }
                    else
                    { 
                      toaster.clear();
                      toaster.pop('error', "Oops!", "Something went wrong please try after some time.");
                     
                    }
                });
  };
   
  $scope.requestInvite = function () {
    toaster.pop('wait', "Requesting Invitation", 'Sending Email', 10000);
    var dataToPost = {
                                to: $scope.user.referemail,
                                from: $scope.user.profile.email,
                                sname: $scope.user.profile.studentname,
                                rname: $scope.user.refername
                     };
    $http({
    url: "/requestInvitation", 
    method: "GET",
    params: {   to: dataToPost.to,
                sname: dataToPost.sname,
                from : dataToPost.from,
                rname : dataToPost.rname
            }
    }).success(function(serverResponse) {
        if(serverResponse =='sent'){
          toaster.clear();
          toaster.pop('success', "Thankyou!", "Your request has been sent.");
          $scope.reqSent=1;
         
        }
        else if(serverResponse =='error') {
          toaster.clear();
          toaster.pop('error', "Oops!", "Something went wrong please try again after some time.");
           
        }
        else
        {
          toaster.clear();
          toaster.pop('success', "Thankyou!", "Your request has been sent.");
         
        }
    }).error(function(serverResponse) {
        if(serverResponse =='sent'){
          toaster.clear();
          toaster.pop('success', "Thankyou!", "Your request has been sent.");
         
        }
        else if(serverResponse =='error') {
          toaster.clear();
          toaster.pop('error', "Oops!", "Something went wrong please try again after some time.");
           
        }
        else
        { 
          toaster.clear();
          toaster.pop('error', "Oops!", "Something went wrong please try again after some time.");
         
        }
    });
  };
  
  $scope.resendemail = function () {
    var str = Auth.resolveUser().uid;
    var data = str.split(":");
    if(isNaN(data[1])){
      var urlId = str;
    }
    else{
      var urlId = str.split(":");
          urlId = urlId[1];
    }
    toaster.pop('wait', "Email verification", 'Sending Email', 10000);
    var dataToPost = {
                                to: $scope.user.profile.email, 
                                pass: $scope.user.profile.password, 
                                sname: $scope.user.profile.studentname,
                                hashkey : $scope.user.profile.md5_hash,
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
                    if(serverResponse =='sent'){
                      toaster.clear();
                      toaster.pop('success', "Thankyou!", "Please check your email for the verification link.");
                     
                    }
                    else if(serverResponse =='error') {
                      toaster.clear();
                      toaster.pop('error', "Oops!", "Something went wrong please try after some time.");
                       
                    }
                    else
                    {
                      toaster.clear();
                      toaster.pop('success', "Thankyou!", "Please check your email for the verification link.");
                     
                    }
                }).error(function(serverResponse) {
                    if(serverResponse =='sent'){
                      toaster.clear();
                      toaster.pop('success', "Thankyou!", "Please check your email for the verification link.");
                     
                    }
                    else if(serverResponse =='error') {
                      toaster.clear();
                      toaster.pop('error', "Oops!", "Something went wrong please try after some time.");
                       
                    }
                    else
                    { 
                      toaster.clear();
                      toaster.pop('error', "Oops!", "Something went wrong please try after some time.");
                     
                    }
                });
  }; 

 $scope.CurrentreferalStatus = function() {
      var currentuser = Auth.resolveUser().uid;
      $scope.user.refername ="";
      $scope.user.referemail ="";
      $scope.yourstatus = "";
      $scope.referalstatus ="";
      Auth.viewChanges(currentuser).then ( function ( result10 ) {
            if(typeof result10.referredBy == 'undefined'){
              $scope.yourstatus = "old";
              var dataToPost = {
                                username: $scope.user.profile.studentname,
                                useremail: $scope.user.profile.email
                            };
                $http({
                url: "/sendmailforolduser", 
                method: "GET",
                params: {   
                          username: dataToPost.username,
                          useremail: dataToPost.useremail  
                        }
                }).success(function(serverResponse) {
                    if(serverResponse =='sent'){
                     
                    }
                    else if(serverResponse =='error') {
                       
                    }
                    else
                    {
                     
                    }
                }).error(function(serverResponse) {
                    if(serverResponse =='sent'){
                     
                    }
                    else if(serverResponse =='error') {
                       
                    }
                    else
                    { 
                     
                    }
                });
            } 
      });
 };

  $scope.pop = function(){
            toaster.pop('success', "test", "i m testing u");
            /*console.log($scope.emailsuccess);*/
        };


  $scope.getStudentincentive = function(sid){
  
    return Search.getStudentIncentive(sid);
  
  };     

  $scope.getStudentEmail = function(sid){
           return Search.getStudentEmail(sid);           
        };
  $scope.getStudentName = function(sid){
           
           return Search.getStudentName(sid);
           
        };
  $scope.getStudentPhoto = function(sid){
           return Search.getStudentPhoto(sid);
        };                 


  $scope.updateProfile = function() {
     var student = Auth.resolveUser().uid;
     $scope.submitsuccesstext1 = false;
     $scope.submitphotosuccesstext = false;
     Auth.updateProfile($scope,student);  
  };

  $scope.updateProfile2 = function() {
     console.log("function called 2");
     var student = Auth.resolveUser().uid;
     $scope.submitsuccesstext2 = false;
     $scope.submitphotosuccesstext = false;
     if($scope.user.profile.academicrecordUGMarks == null)
     {
        if($scope.user.profile.academicrecordPGMarks == null){
              $scope.message= "";
              Auth.updateProfile2($scope,student);
          }
         else{
            
              $scope.message="Please enter your 12th marks to proceed.";
         }
     } 
     else {
          $scope.message= "";
          Auth.updateProfile2($scope,student);  
     }

  };

  $scope.updateProfile3 = function() {
     var student = Auth.resolveUser().uid;
     $scope.submitsuccesstext3 = false;
     $scope.submitphotosuccesstext = false;
     Auth.updateProfile3($scope,student);  
  };

  $scope.prepareUG = function() {
        var test = [];
        $scope.submitphotosuccesstext = false;
        var student = Auth.resolveUser().uid;
        Auth.getUGCourses(student).then ( function ( result ) {
        var test  = result;
          if (typeof test == 'undefined'){
                $scope.user.profile.coursesUG = [];  
                $scope.uSer.roles= $scope.user.profile.coursesUG;
          }
          else{
                Auth.getUGCourses(student).then ( function ( result ) {
                $scope.user.profile.coursesUG  = result;
             
          }, function(error){
              console.log(error);
          });
        }             
          }, function(error){
              console.log(error);
          });
  };
  
  $scope.updateUG = function() {
       
      var student = Auth.resolveUser().uid;
      $scope.submitsuccesstext = false;
      var ug = $scope.uSer.roles;
      Auth.updateUG($scope,student,ug); 
       
    };

$scope.preparePG = function() {
        var testA = [];
        $scope.submitphotosuccesstext = false;
        var student = Auth.resolveUser().uid;
        Auth.getPGCourses(student).then ( function ( result ) {
        var testA  = result;
          if (typeof testA == 'undefined'){
                $scope.user.profile.coursesPG = [];  
                $scope.uSerA.rolesA= $scope.user.profile.coursesPG;
          }
          else{
                Auth.getPGCourses(student).then ( function ( result ) {
                $scope.user.profile.coursesPG  = result;
             
          }, function(error){
              console.log(error);
          });
        }             
          }, function(error){
              console.log(error);
          });
  };

  $scope.updatePhoto = function(newphoto) {
     var studentId = Auth.resolveUser().uid;
     $scope.submitphotosuccesstext = false;
     Auth.updatePhoto(studentId, newphoto , $scope); 
  };

    $scope.cancelUploadFile = function (studentadmissionproof) {
    $scope.user.studentadmissionproof.url = "https://www.filepicker.io/api/file/zEAoaiVbRRW0HrtJApxM";    
    $scope.submitdisabled = true; 
  };

  $scope.redeemShow = "";
  $scope.uploadFalse = function() {
    
    $scope.upload = false;
  };

  $scope.submitdisabled = true;  

  $scope.enableSubmitButton = function() {
    if($scope.user.studentadmissionproof.url !== "https://www.filepicker.io/api/file/zEAoaiVbRRW0HrtJApxM"){
    $scope.submitdisabled = false;
    }
  };

  $scope.upload = "";
  $scope.uploadAdmissionProof = function(studentAdmissionProof, user) {
      $scope.upload = false;
      var studentId = Auth.resolveUser().uid;
      Auth.uploadAdmissionProof(studentId, studentAdmissionProof.url, $scope);
      var dataToPost = {
                              to: user.profile.email,
                              sname: user.profile.studentname,
                              url: studentAdmissionProof.url,                              
                          };
              $http({
              url: "/sendStudentAdmissionProofToSupportTeam", 
              method: "GET",
              params: {   to: dataToPost.to,
                          sname : dataToPost.sname,
                          url : dataToPost.url
                      }
              }).success(function(serverResponse) {
                  
               }).error(function(serverResponse) {
                  
               });
  };


  var ext='';
  $scope.getdocumenttype = function( ) {  
      var test = $scope.user.profile.studentdocument;
      $http.get(test+'/metadata').success(function(data) { 
       ext = data.filename;
       var str = ext;
       var n = str.lastIndexOf(".");
       var extension = str.slice(n);
        $scope.extension = extension;
      });

  };

  $scope.updateDocument = function(newdocument) {
     var studentId = Auth.resolveUser().uid;
     $scope.submitdocumentsuccesstext = false;
     Auth.updateDocument(studentId, newdocument , $scope); 
  };

  $scope.updatePG = function() {
     
     var student = Auth.resolveUser().uid;
     $scope.submitsuccesstext = false;
     var pg = $scope.uSerA.rolesA;
     Auth.updatePG($scope,student,pg); 
  };

  $scope.cancel = function() {
       
     $scope.message= "";
     $scope.submitdocumentsuccesstext = false;
     $scope.submitsuccesstext = false; 
     var test = [];
     var student = Auth.resolveUser().uid;
     Auth.viewChanges(student).then( function ( result ) {
     var canceling  = result;
     $scope.submitphotosuccesstext = false;
     $scope.submitsuccesstext = false;
     $scope.submitsuccesstext2 = false;
     $scope.submitsuccesstext3 = false;
     $scope.submitsuccesstext1 = false;
     $scope.user.profile.studentdocument = canceling.studentdocument;
     $scope.getdocumenttype();
     $scope.user.profile.studentname = canceling.studentname;
     $scope.user.profile.studentmobile = canceling.studentmobile;
     $scope.user.profile.gender = canceling.gender;
     $scope.user.profile.fathername = canceling.fathername;
     $scope.user.profile.occupation = canceling.occupation;
     $scope.user.profile.fathernumber = canceling.fathernumber;
     $scope.user.profile.academicrecord12thMarks = canceling.academicrecord12thMarks;
     $scope.user.profile.academicrecordUGMarks = canceling.academicrecordUGMarks;
     $scope.user.profile.academicrecordPGMarks = canceling.academicrecordPGMarks;
     $scope.user.profile.studentabout = canceling.studentabout;
     $scope.user.profile.coursesUG = canceling.coursesUG;
     $scope.user.profile.coursesPG = canceling.coursesPG;
     $scope.user.profile.studentphoto = canceling.studentphoto;
     },
     function(error){
       console.log(error);
     }); 
  };

  $scope.doThisForCounsellor = function(collegeEmail) {
      if(!collegeEmail) {
        $scope.collegeIdFlag = "";
      }
      else {
        Search.getCollegeIdByEmail(collegeEmail).then ( function ( result ) {
        $scope.collegeUid = result;
        if($scope.collegeUid !== "user doesnot exists") {
          $scope.collegeIdFlag = "Done";
          $scope.collegeName = Search.getCollegeName($scope.collegeUid); 
         }
        else{
          $scope.collegeIdFlag = "Not Done";
        }
        }, function(error){
          $scope.collegeIdFlag = "Not Done";
          console.log(error);
        });
      }
    };

    $scope.doThisForStudent = function(studentEmail1) { 
      $scope.error= "";
      $scope.referalstatus = "";
      studentEmail1 =angular.lowercase(studentEmail1);    
      if(!studentEmail1) {
        $scope.student1IdFlag = "";
        $scope.student1Uid = "";
        $scope.referalstatus = "";
      }
      else {
          Search.getStudentIdByEmail(studentEmail1).then ( function ( result ) {
          $scope.student1Uid = result;
          if($scope.student1Uid !== "user doesnot exists") {
            $scope.student1IdFlag = "Done";
            $scope.student1Name = Search.getStudentName($scope.student1Uid);
            Auth.viewChanges($scope.student1Uid).then ( function ( result1 ) {
            if($scope.user.profile.email === studentEmail1){
              $scope.student1IdFlag = "";
              $scope.referalstatus = "same"; 
            }
            else if(typeof result1.referredBy == 'undefined'){
              $scope.referalstatus = "old";
            }
            else if(result1.referredBy == 'nobody'){
              $scope.referalstatus = "Not";               
            }
            else if (result1.referredBy)  {
              $scope.referalstatus = "Done";             
            }
            else  {
              $scope.referalstatus = "else";
              var dataToPost = {
                                usercc: studentEmail1
                            };
                $http({
                url: "/sendmailforsuspiciousactivity", 
                method: "GET",
                params: {   
                          usercc: dataToPost.usercc  
                        }
                }).success(function(serverResponse) {
                    console.log(serverResponse);
                }).error(function(serverResponse) {
                    console.log(serverResponse);
                });
              /*console.log($scope.referalstatus);*/
            }
          });
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


  $scope.go = function ( path ) {
      $location.path( path );
  };

  $scope.collegephoto = function (collegeId) {
    var collegePhotoObj = Search.getCollegePhoto(collegeId);
    return collegePhotoObj;
  };

  $scope.collegename = function (collegeId) {
    var collegeNameObj = Search.getCollegeName(collegeId);
    return collegeNameObj;
  };

  $scope.toTheTop = function() {
      $document.scrollTopAnimated(0, 2000).then(function() {
      });
    };
    $scope.profileIncomplete = 'Not Done';
    $scope.incompleteProfileCheck = function() {
       $scope.profiletab = 'show';
       Search.studentDetailForNotification(Auth.resolveUser().auth.uid,$scope);
       
    };

    $scope.checkNewBookSessionForNotification = function() {
        $scope.bookhistorytab = 'show';
         Search.checkNewBookSessionForNotification(Auth.resolveUser().auth.uid,$scope);
    };

    $scope.notificationOfIncentiveChange = function() {
      Search.notificationOfIncentiveChange(Auth.resolveUser().auth.uid,$scope);
    };
  
   $scope.changeStudentPassword = function(){
     $scope.message = '';
    //console.log(Auth.resolveUser().auth.uid);
    
    //console.log($scope.user.profile.email);   
        Auth.changeStudentPassword($scope.user.profile.email,Auth.resolveUser().auth.uid,$scope.user.oldpassword,$scope.user.resetpassword,$scope);
        $scope.user.oldpassword='';
        $scope.user.resetpassword='';
        $scope.user.confirm_password='';
  };

  $scope.getstudentWebinarFeedbacks = function(webinarId){

        $scope.successmessage = "";
        $scope.errormessage = "";
        Webinar.getstudentWebinarFeedbacks(webinarId,$scope);

    };




    $scope.SaveWebinarStudentFeedback = function(collegeId,webinarId,webinarSatisfaction,SpeakerInterested,Interested,InterestedArea,QNA, QuestionDetails) {
      
        $scope.successmessage = "";  
        $scope.errormessage = "";

        if(webinarSatisfaction === null){
          $scope.errormessage = "Please fill all the fields.";
        }
        if(SpeakerInterested === null){
            $scope.errormessage = "Please fill all the fields.";
        }
        if(Interested === null){
            $scope.errormessage = "Please fill all the fields.";
        }
        if(QNA === null){
            $scope.errormessage = "Please fill all the fields.";
        }



        if(typeof webinarSatisfaction !== 'undefined'  && typeof SpeakerInterested !== 'undefined' &&  typeof Interested !== 'undefined' && typeof QNA !== 'undefined'){
                
                if(Interested === 'Yes' &&  QNA === 'Yes'){
                    if(typeof InterestedArea !== 'undefined'){
                       Webinar.SaveWebinarStudentFeedback(collegeId,webinarId,webinarSatisfaction,SpeakerInterested,Interested,InterestedArea,QNA, QuestionDetails,$scope);
                    }
                    else{
                        $scope.errormessage = "Please fill your Interested area.";
                    }
                
                }
                else if(Interested === 'No' &&  QNA === 'Yes'){
                       Webinar.SaveWebinarStudentFeedback(collegeId,webinarId,webinarSatisfaction,SpeakerInterested,Interested,InterestedArea,QNA, QuestionDetails,$scope);                   
                
                }
                else if(Interested === 'No' && QNA === 'No'){
                    if(typeof QuestionDetails !== 'undefined'){
                       Webinar.SaveWebinarStudentFeedback(collegeId,webinarId,webinarSatisfaction,SpeakerInterested,Interested,InterestedArea,QNA, QuestionDetails,$scope);
                    }
                    else{
                        $scope.errormessage = "Please submit your questions";
                    }
                
                }
                else if(Interested === 'Yes' &&  QNA === 'No'){
                    if(typeof InterestedArea !== 'undefined' && typeof QuestionDetails !== 'undefined'){
                       Webinar.SaveWebinarStudentFeedback(collegeId,webinarId,webinarSatisfaction,SpeakerInterested,Interested,InterestedArea,QNA, QuestionDetails,$scope);
                      }
                    else if(typeof InterestedArea === 'undefined'){
                        $scope.errormessage = "Please fill your Interested area.";
                    }
                    else if(typeof QuestionDetails === 'undefined'){
                        $scope.errormessage = "Please submit your questions.";
                    }
                }

        }
        else{
            $scope.errormessage = "Please fill all the fields";
        }
    };

    $scope.getStudentDashBoardPosts = function() {
      Blog.getStudentDashBoardPosts($scope);
    };

    $scope.LoadMoreStudentDashBoardPosts = function() {
      Blog.LoadMoreStudentDashBoardPosts($scope);
    };

    $scope.getNumberOfClick = function() {
      $scope.numberOfClick = Search.getNumberOfClick();
    };

                                          /*collegeFeed*/
    $scope.seeCollegeFeed = function() {
      Blog.seeCollegeFeed($scope);
    }; 

    $scope.loadMoreAllCollegeFeeds = function() {
      Blog.loadMoreAllCollegeFeeds($scope);
    };                               
                                          /*collegeFeed*/      



                                          /* student_query */ 

    $scope.submitQueryForm = function (dream_college,course_intrested,stu_queries) {
      var currentUser = Auth.resolveUser().uid;
      Auth.submitQueryForm(dream_college,course_intrested,stu_queries,currentUser, $scope);
    };

    $scope.getQueryNotification = function(college,course,query){
    $scope.empty = "";
    toaster.pop('wait', "Query", 'Sending Request', 10000);
    var dataToPost = {
                                collegeInterested: college,
                                courseInterested: course,
                                studentQuery:query,
                                sname: $scope.user.profile.studentname,
                                email: $scope.user.profile.email,
                                phone: $scope.user.profile.studentmobile
                            };

                               
                $http({
                url: "/sendmailtoadminFordashboardQuery", 
                method: "GET",
                params: {  
                            collegeInterested: dataToPost.collegeInterested,
                            courseInterested: dataToPost.courseInterested,   
                             studentQuery: dataToPost.studentQuery,    
                             studentName: dataToPost.sname,        
                            studentEmail: dataToPost.email,
                            studentNumber:dataToPost.phone 
                        }
                }).success(function(serverResponse) {
                      toaster.clear();
                      toaster.pop('success', "Thankyou!", "We have received your query.");
                      console.log(serverResponse);
                      $scope.dream_college = "";
                      $scope.course_intrested="";
                      $scope.stu_queries="";
                      $scope.$evalAsync();
                }).error(function(serverResponse) {
                      toaster.clear();
                      toaster.pop('error', "Oops!", "Something went wrong please try after some time.");
                      console.log(serverResponse);
                      $scope.dream_college = "";
                      $scope.course_intrested="";
                      $scope.stu_queries="";
                      $scope.$evalAsync();
               });

  };

                                          /* student_query */    
}).value('duScrollOffset', 30);
