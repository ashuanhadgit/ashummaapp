'use strict';

app.controller('BlogCtrl', function ($scope, $log, $document, $location, $interval, $filter, Angularytics, Blog, Search, toaster, AuthMentor, AdminAuth, Auth, AuthCollege, AuthSchool) {

   $scope.user = Auth.user;
   $scope.usera = AdminAuth.usera;
   $scope.userc = AuthCollege.userc;
   /*$scope.usern = NodalAuth.usern;*/
   $scope.users = AuthSchool.users;
    $scope.userd = AuthMentor.userd;
    $scope.signedIn = Auth.signedIn;
    $scope.imageurl = '';
    $scope.message  = '';
    $scope.saveStatus = false;
    $scope.postSaveSuccessfully = false;
    $scope.featuredImage = {};
   
    $scope.toTheTop = function() {
      $document.scrollTopAnimated(0, 2000).then(function() {
      });
    };
     
      $scope.tags = "none";

                  

                  /*++++++++++++++++++++++++++++++++google Event Tracking+++++++++++++++++++++++++++++*/

    $scope.trackEvent = function(catagory,action,label) {
        Angularytics.trackEvent(catagory, action, label);
    };

              /*++++++++++++++++++++++++++++++++google Event Tracking+++++++++++++++++++++++++++++*/



    $scope.userClickForScholarship = function(numberOfClick) {
        $location.path('/register');
        Blog.userClickForScholarship(numberOfClick);
    };
    $scope.logoutUsersOtherThanStudent = function() {
      if($scope.signedIn) {
        if(typeof $scope.user.profile.profiletype === 'undefined' && $scope.user.profile.profiletype !== 'student') {
          AuthCollege.logout();
          AdminAuth.logout();
          AuthMentor.logout();
          AuthSchool.logout();
        }
      }
    };

    $scope.getPost = function () {
      $scope.numberOfPostsLoaded = 2;
      Blog.getPost($scope);
      $interval(function() {
        var temp = $location.path();
        var data = temp.split("/");
        if(data[1] === "blog") {
          Blog.loadMoreBlogs($scope.postNumber, $scope);
        }
      },5000,5);
    };

    $scope.loadMoreBlogs = function() {
      Blog.loadMoreBlogs($scope.postNumber, $scope);
    };

    $scope.getPostDetail = function() {
      var postUrl = $location.path();
      var postId = postUrl.slice(-20);
      return Blog.getPostDetail(postId,$scope);
    };

    $scope.getCatagoryPosts = function() {
      var temp = $location.path();
      var data = temp.split("category/");
      var catagory = data[1];
      $scope.categoryName = catagory;
      Blog.getCatagoryPosts(catagory, $scope);
      $interval(function() {
        var temp = $location.path();
        var data = temp.split("/category/");
        if(typeof data[1] !== 'undefined' && data[1] !== 'blog') {
          Blog.loadMoreCatagoryBlogs(catagory, $scope.postNumber, $scope);
        }
      },5000,5);
    };

    $scope.loadMoreCatagoryBlogs = function() {
      var temp = $location.path();
      var data = temp.split("catagory/");
      var catagory = data[1];
      Blog.loadMoreCatagoryBlogs(catagory, $scope.postNumber, $scope);
    };

    $scope.updateYear = function(year) {
      var path1="/view-monthly-post/"+year;
      $location.path( path1 );
    };

    $scope.updateMonth = function(month) {
      var temp = $location.path();
      var data = temp.split("view-monthly-post/");
      var year = data[1].slice(0,4);
      var path = "/view-monthly-post/"+year+month;
      $location.path( path );
    };

    $scope.getYearlyPosts = function() {
      var temp = $location.path();
      var data = temp.split("blog/");
      var year = data[1];
      Blog.getYearlyPosts(year,$scope);
    };
    
    $scope.getMonthlyPosts = function(month) {
      var temp = $location.path();
      var data = temp.split("view-monthly-post/");
      var year = data[1].slice(0,4);
      var month = data[1].slice(4,6);
      if(month === '' && year !== '') {
        $scope.selectedYear = year;
        $scope.selectedMonth = "none";
        Blog.getYearlyPosts(year,$scope);
      }
      else if(month !== '' && year !== '') {
        $scope.selectedYear = year;
        if(month === '01')
          $scope.selectedMonth = "January";
        else if(month === '02')
          $scope.selectedMonth = "February";
        else if(month === '03')
          $scope.selectedMonth = "March";
        else if(month === '04')
          $scope.selectedMonth = "April";
        else if(month === '05')
          $scope.selectedMonth = "May";
        else if(month === '06')
          $scope.selectedMonth = "June";
        else if(month === '07')
          $scope.selectedMonth = "July";
        else if(month === '08')
          $scope.selectedMonth = "August";
        else if(month === '09')
          $scope.selectedMonth = "September";
        else if(month === '10')
          $scope.selectedMonth = "October";
        else if(month === '11')
          $scope.selectedMonth = "November";
        else
          $scope.selectedMonth = "December";
        Blog.getMonthlyPosts(year, month, $scope);
      }
    };

    $scope.updateTimestamp = function(postNumber) {
      $scope.postNumber = postNumber;
    };

    $scope.getAllPostsForMentor = function() {
          $scope.mentorPosts = Blog.getAllPostsForMentor();
    };
    
    $scope.getMentorName = function() {
      $scope.mentorName = Blog.getMentorName(AuthMentor.resolveUser().uid);
    };

    $scope.getBlogComment = function(postId) {
      $scope.blogCommentList = Blog.getBlogComment(postId);
    };

    $scope.getHouseProfile = function() {
      console.log("called");
      var temp = $location.path();
      var houseName = temp.split("/house/")[1];
      Blog.getHouseProfile(houseName,$scope);
    };

    $scope.getcategoryProfile = function() {
      var temp = $location.path();
      var houseName = temp.split("/category/")[1];
      Blog.getHouseProfile(houseName,$scope);
    };
    
    $scope.getCategoryPosts = function() {
      var temp = $location.path();
      var houseName = temp.split("/category/")[1];
      Blog.getHousePosts(houseName,$scope);
    };
                                
                                /*shubham's work load more posts*/
    
    $scope.getHousePosts = function() {
      var temp = $location.path();
      $scope.currentLocation = temp.split("/")[1];
      var houseName = temp.split("/house/")[1];
      Blog.getHousePosts(houseName,$scope);
    };
    
    $scope.load_more_posts = function() {
      var temp = $location.path();
      var houseName = temp.split("/house/")[1];
      Blog.load_more_posts(houseName,$scope);
    };

    $scope.load_more_posts_for_guest_user = function() {
      var temp = $location.path();
      var houseName = temp.split("/category/")[1];
      Blog.load_more_posts(houseName,$scope);
    };
                              /*shubham's work load more posts Ends*/
                                
                                    /*mentor house findable*/
    $scope.getHouseMentors = function () {
      var temp = $location.path();
      var houseName = temp.split("/house/")[1];
      Blog.getHouseMentor(houseName,$scope);
    };
                                /*mentor house findable ends*/

                                      /*Add comments for house posts starts*/
    $scope.PostComments = [];  
    $scope.commentSubmitError = [];                                
    $scope.addHousePostComment = function(postId,PostComments,postKey) {
      $scope.commentSubmitError[postKey] = "";
      if(typeof PostComments === 'undefined' || PostComments === "") {
        $scope.PostComments[postKey] = "";
        $scope.commentSubmitError[postKey] = "Please write a comment";
      }
      else {
        var commentDate = new Date();
        var date = $filter('date')(commentDate,'yyyyMMdd');
        var commentTime = (commentDate.getHours()<10?'0':'') + commentDate.getHours()+ ":" + (commentDate.getMinutes()<10?'0':'') + commentDate.getMinutes();
        var time = (commentDate.getHours()<10?'0':'') + commentDate.getHours()+ ":" + (commentDate.getMinutes()<10?'0':'') + commentDate.getMinutes()+ ":" + (commentDate.getSeconds()<10?'0':'') + commentDate.getSeconds()+ ":" + (commentDate.getMilliseconds()<10?'0':'') + commentDate.getMilliseconds();
        var temporary = time.split(':');
        var timestamp = date.toString()+temporary[0].toString()+temporary[1].toString()+temporary[2].toString()+temporary[3].toString();
        Blog.addHousePostComment(postKey,postId,$scope.PostComments[postKey],$scope.user.profile.$id,date,commentTime,timestamp,$scope.user.profile.studentphoto,$scope.user.profile.studentname,$scope);
        $scope.PostComments[postKey] = "";
        $scope.$evalAsync();
      }
    };

                                  /*Add comments for house posts ends*/

                                        /*Edit & Delete Post Starts*/

    $scope.initializeCommentEditing = function(commentId,postId) {
      $(".commentBox"+postId).hide();
      $(".commentImg"+postId).hide();
      $(".commentButton"+postId).hide();
      $(".commenterImgC"+commentId+"P"+postId).hide();
      $(".originalCommentDataC"+commentId+"P"+postId).hide();
      $(".originalCommentToolsC"+commentId+"P"+postId).hide();
      
      $(".editCommentsDivC"+commentId+"P"+postId).show();
      $(".editCommentsDivC"+commentId+"P"+postId).show();
      $(".editCommentBoxC"+commentId+"P"+postId).show();
      $(".editCommentButtonC"+commentId+"P"+postId).show();
    };

    $scope.editPostComment = function(postId,PostComments,postKey,commentKey,commentId) {
      $("#editCommentsDiv"+postKey).hide();
      $("#editCommentImg"+postKey).hide();
      $("#editCommentBox"+postKey).hide();
      $("#editCommentButton"+postKey).hide();
      $(".editCommentsDivC"+commentKey+"P"+postKey).hide();
      $(".editCommentsDivC"+commentKey+"P"+postKey).hide();
      $(".editCommentBoxC"+commentKey+"P"+postKey).hide();
      $(".editCommentButtonC"+commentKey+"P"+postKey).hide();

      $(".commentBox"+postKey).show();
      $(".commentImg"+postKey).show();
      $(".commentButton"+postKey).show();
      $(".commenterImgC"+commentKey+"P"+postKey).show();
      $(".originalCommentDataC"+commentKey+"P"+postKey).show();
      $(".originalCommentToolsC"+commentKey+"P"+postKey).show();
      Blog.editPostComment(postId,PostComments,postKey,commentKey,commentId);
    };

    $scope.likeThisComment = function(commentId,postId) {
      Blog.likeThisComment(commentId,postId,$scope.user.profile.$id,$scope);
    };

    $scope.getNumberOfLikesOnThisComment = function(postId,commentId) {
      Blog.getNumberOfLikesOnThisComment(postId,commentId,$scope);
    };

    $scope.deletePostComment = function(postId,PostComments,postKey,commentId) {
      Blog.deletePostComment(postId,PostComments,postKey,commentId);
    };

                                        /*Edit & Delete Post Ends*/


                                     /*Load comment for house posts*/


    $scope.comments = [];
    $scope.totalComments = [];
    $scope.comment_loaded = [];
    $scope.hideLoadMoreButton = [];
    $scope.userName = [];
    $scope.userPic = [];
    $scope.numberOfLikesOnThisComment = [];
    $scope.loadPostComments = function(postId,postKey) {
      Blog.loadPostComments(postId,postKey,$scope);
    };


    $scope.loadMoreComments = function(postId,postKey){
      Blog.loadMoreComments(postId,postKey,$scope);
    };

    $scope.setFocusOnCommentBox = function(postId) {
      $(".commentBox"+postId).focus()
    };

    $scope.displayCommentSection = function(postId) {
      $(".commnt-part"+postId) .show(1000);
    };
  
    $scope.displaySharerButtons = function(postId) {
      $("#sharebar"+postId).toggle(500);
    };
                                  /*Load comment for house posts ends*/                                

  }).value('duScrollOffset', 30);
