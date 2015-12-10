'use strict';

app.controller('WebinarCtrl', function ($scope, $log, $document, $filter, $http, $location, $modal, $sce, $interval, $window, toaster, AuthMentor, AuthSchool, Webinar, Auth, AuthCollege) {

    $scope.webinar = [];
    $scope.user = Auth.user;
    $scope.signedIn = Auth.signedIn;
    $scope.users = AuthSchool.users;
    $scope.userc = AuthCollege.userc;
    $scope.userd = AuthMentor.userd;
    $scope.gender = [{
                        name: "Male"
                    },
                    {  
                        name: "Female"
                    }];

    $scope.expandSlip = false;

    $scope.webinar_booking_success = [];  
     $scope.webinarAlreadyBooked = [];              
    $scope.today = function() {
        $scope.dt = new Date();
    };
      
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };
    $scope.attendees = [];

      // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        var currentDate = new Date();
       $scope.minDate =  new Date(currentDate.getTime() + (15 * 24* 60 * 60 * 1000));
    };
      
    $scope.toggleMin();

    $scope.toTheTop = function() {
      $document.scrollTopAnimated(0, 2000).then(function() {
      });
    };


    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.update = function() {
        var d = new Date();
        d.setHours( 14 );
        d.setMinutes( 0 );
        $scope.mytime = d;
    };

    $scope.changed = function () {
        $log.log('Time changed to: ' + $scope.mytime);
    };

    $scope.clear = function() {
        $scope.mytime = null;
    };

    $scope.toggleScheduleWebinarSuccessMsg = function() {
        $scope.schedule_webinar_success = '';
    }

    $scope.loadAllWebinars = function() {
        Webinar.getAllUpcomingWebinar($scope);
    };

    $scope.hideWebinar = [];

    $scope.getBookedWebinarForStudent = function() {
        $scope.studentBookedWebinar = [];
        $scope.studentWebinar = [];
        var studentId = Auth.resolveUser().uid;
        Webinar.getBookedWebinarForStudent(studentId,$scope);
    };

    $scope.getUpcomingWebinar = function() {
        var currentCollege = AuthCollege.resolveUser();
        Webinar.getUpcomingWebinar(currentCollege.uid, $scope);
    };

    $scope.studentsAttending = function(webinatId, $scope) {
        Webinar.studentsAttending(webinarId, $scope);
    };
    
    $scope.getAllUpcomingWebinar = function() {
        Webinar.getAllUpcomingWebinar($scope);
    };

    $scope.startChat = function(webinar) {
        $window.open("https://www.youtube.com/my_live_events");
    };

    $scope.WebinarChat = function(){
        var path = $location.path();
        var str = path.split(":");
        Webinar.getWebinarChat(str[1], $scope);
    };    

    $scope.showTextBox = function(id)
    {
        $("#adminreply"+id).fadeIn();
        $("#replybtn"+id).fadeOut();
        $("#submitbtn"+id).fadeIn();
        $("#cancelbtn"+id).fadeIn();
    };

    $scope.cancelReply = function(id)
    {
        $("#adminreply"+id).fadeOut();
        $("#replybtn"+id).fadeIn();
        $("#submitbtn"+id).fadeOut();
        $("#cancelbtn"+id).fadeOut();
    };

    $scope.getWebinarDetail = function() {
        var path = $location.path();
        var str = path.split(":");
        Webinar.getWebinarDetailByWebinarId(str[1], $scope);
    };

    $scope.getWebinarDetailForView = function() {
        var path = $location.path();
        var webinarId = path.split(":")[1];
        Webinar.getWebinarDetail(webinarId).then(function(webinarDetail) {
                    $scope.webinarDetail = webinarDetail;
        });
    };

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    $scope.getCompletedWebinarsHistory = function() {
        var currentCollege = AuthCollege.resolveUser().uid;
        Webinar.getCompletedWebinarsHistory(currentCollege, $scope);
    };

    $scope.getWebinarFeedbacks = function(webinarId) {
        $scope.successmessage = "";
        $scope.errormessage = "";
        var currentCollege = AuthCollege.resolveUser().uid;
        Webinar.getWebinarFeedbacks(currentCollege, $scope,webinarId);
    };

    $scope.SaveWebinarFeedback = function(webinarId,webinarexperience,satisfaction,quality,problems,QNA, technicalProblem, recommendation) {
       $scope.successmessage = "";
       var currentCollege = AuthCollege.resolveUser().uid;
        $scope.errormessage = "";

        if(webinarexperience === null){
          $scope.errormessage = "Please fill all the fields.";
        }
        if(satisfaction === null){
            $scope.errormessage = "Please fill all the fields.";
        }
        if(quality === null){
            $scope.errormessage = "Please fill all the fields.";
        }
        if(problems === null){
            $scope.errormessage = "Please fill all the fields.";
        }
        if(QNA === null){
            $scope.errormessage = "Please fill all the fields.";
        }
    
        if(typeof webinarexperience !== 'undefined' && typeof satisfaction !== 'undefined' && typeof quality !== 'undefined' &&  typeof problems !== 'undefined' && typeof QNA !== 'undefined'){
                if(problems === 'Yes' &&  QNA === 'No'){
                    if(typeof technicalProblem !== 'undefined'){
                       Webinar.SaveWebinarFeedback(webinarId,currentCollege, $scope,webinarexperience,satisfaction,quality,problems,QNA, technicalProblem, recommendation);
                    }
                    else{
                        $scope.errormessage = "Please write the problems you faced";
                    }
                
                }
                else if(problems === 'No' &&  QNA === 'Yes'){
                    if(typeof recommendation !== 'undefined'){
                       Webinar.SaveWebinarFeedback(webinarId,currentCollege, $scope,webinarexperience,satisfaction,quality,problems,QNA, technicalProblem, recommendation);
                    }
                    else{
                        $scope.errormessage = "Please write the recommendation.";
                    }
                
                }
                else if(problems === 'Yes' && QNA === 'Yes'){
                    if(typeof technicalProblem !== 'undefined' && typeof recommendation !== 'undefined'){
                       Webinar.SaveWebinarFeedback(webinarId,currentCollege, $scope,webinarexperience,satisfaction,quality,problems,QNA, technicalProblem, recommendation);
                    }
                    else if(typeof technicalProblem === 'undefined'){
                        $scope.errormessage = "Please write the problems you faced";
                    }
                    else if(typeof recommendation === 'undefined'){
                        $scope.errormessage = "Please write the recommendation.";
                    }
                
                }
                else if(problems === 'No' &&  QNA === 'No'){
                    Webinar.SaveWebinarFeedback(webinarId,currentCollege, $scope,webinarexperience,satisfaction,quality,problems,QNA, technicalProblem, recommendation);
                }

        }
        else{
            $scope.errormessage = "Please fill all the fields";
        }
    };
    
    $scope.bookThisWebinar = function(currentWebinar) {
        if(Auth.signedIn()) {
          var currentStudent = Auth.resolveUser().auth.uid;
          Webinar.bookWebinar($scope , currentWebinar.liveStreamURL,currentWebinar.mentorName, currentWebinar.mentorEmail,currentWebinar.mentorMobile,currentWebinar.mentorGender,currentWebinar.mentorPhoto,currentWebinar.webinarTopic,currentWebinar.webinarDate,currentWebinar.webinarTime,currentWebinar.webinarDescription,currentWebinar.webinarDuration,currentWebinar.studentsAttending,currentWebinar.collegeId,currentWebinar.webinarId,currentStudent);
          Auth.followCollege($scope.webinarDetail.collegeId,currentStudent,$scope);
            
        }
        else {
            $location.path('/login');

        }
    };

    $scope.getQNAdetails = function() {
        Webinar.getQNAdetails($scope.currentlyAttendingWebinar, $scope);
    };

    $scope.thisBookedWebinarLive = [];
    
    $scope.isThisBookedWebinarLive = function(webinarId) {
          $scope.thisBookedWebinarLive[webinarId] = "notLiveYet";
          Webinar.isThisBookedWebinarLive(webinarId, $scope);
    };

    $scope.sendWebinarInvitation = function(studentName,webinar,friendemail) {
        $scope.invitationMsg = null;
        $scope.invitationSuccessMsg = null;
        $scope.invitationErrorMsg = null;
        var webinarUrl = $location.path();
        if(typeof friendemail === 'undefined' || friendemail === '') {
            $scope.invitationMsg = "Enter valid friend's email.";
            return;
        }
        var dataToPost = {
                                to: friendemail, 
                                studentName : studentName,
                                mentorName : webinar.mentorName,
                                webinarTopic : webinar.webinarTopic,
                                webinarDate : webinar.webinarDate,
                                webinarTime : webinar.webinarTime,
                                webinarUrl : webinarUrl
                   };
                $http({
                url: "/sendwebinarinvitationmailtofriend", 
                method: "GET",
                params: {   to: dataToPost.to,
                            studentName : dataToPost.studentName,
                            mentorName: dataToPost.mentorName,
                            webinarTopic : dataToPost.webinarTopic,
                            webinarDate : dataToPost.webinarDate,
                            webinarTime : dataToPost.webinarTime,
                            webinarUrl : webinarUrl
                        }
                }).success(function(serverResponse) {
                    console.log(serverResponse);
                    $scope.invitationSuccessMsg = "Invitation is successfully sent.";
                }).error(function(serverResponse) {
                     $scope.invitationErrorMsg = "something went wrong. Please try after sometime."
                    console.log(serverResponse);
                });
    };


                                   /*specialEvent Start*/

    $scope.shareHangoutError = "";
    $scope.shareHangout = function(webinar,password) {
        $scope.hangoutShared = "";
        $scope.shareHangoutError = "";
        if(typeof password === 'undefined') 
            $scope.shareHangoutError = "Please Enter Password";
        else
            Webinar.saveSpecialEvent(webinar,password,$scope);
    };

    $scope.getAllSpecialEvents = function() {
        $scope.specialEvents = Webinar.getAllSpecialEvents();
    };

    $scope.eventError = "";
    $scope.authorizeSpecialEvent = function(eventId,event_password) {
        if(typeof event_password === 'undefined') {
            $scope.eventError = "Password Empty";
            $scope.$evalAsync();
        }
        else
            Webinar.authorizeSpecialEvent(eventId,event_password,$scope);
    };
    
    
                                        /*specialEvent Ends*/
  }).value('duScrollOffset', 30);