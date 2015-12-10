'use strict';
app.factory('Blog', function ($firebaseAuth, $location, FIREBASE_URL, $firebaseObject, $firebaseArray, $rootScope, $filter , $timeout, AuthMentor, AuthCollege, Search, $q) {
            
  var Blog = 
  {
    getPost: function($scope) {
      $scope.post = [];
      var postRef = new Firebase(FIREBASE_URL+"posts/allPosts");
        $scope.post = $firebaseArray(postRef.limitToLast(2));
        $scope.$evalAsync();
    },

    loadMoreBlogs : function(postNumber, $scope) {
      var tempPostArr = [];
      if(($scope.starting !== postNumber-2) && ($scope.ending !== postNumber-1)) {
        $scope.starting = postNumber-2;
        $scope.ending = postNumber-1;
        if(($scope.ending > 0 || $scope.ending == 0) && ($scope.starting > 0 || $scope.starting == 0)) {
          var postRef = new Firebase(FIREBASE_URL+"posts/allPosts");
          var tempPost = $firebaseArray(postRef.orderByChild("postNumber").startAt($scope.starting).endAt($scope.ending));
          tempPost.$loaded(function(value,key) {
            tempPostArr = value;
            tempPostArr = tempPostArr.concat($scope.post);
            $scope.post = tempPostArr;
            $scope.$evalAsync();
          });  
        };
      };
    },
  
    getPostDetail: function(postId,$scope) {
      var postRef = new Firebase(FIREBASE_URL + "posts/allPosts/" + postId);
      var postObject = $firebaseObject(postRef);
      postObject.$loaded(function(postObject) {
          $scope.mentorName =  Blog.getMentorName(postObject.mentoruid);
          Blog.getBlogComment(postId,$scope);
          $scope.$evalAsync();
         
      })
     return $firebaseObject(postRef); 
    },

    getCatagoryPosts: function(catagory, $scope) {
      $scope.post = [];
      var postCatagoryWiseRef = new Firebase(FIREBASE_URL+"posts/catagories/" + catagory);
      $scope.post = $firebaseArray(postCatagoryWiseRef.limitToLast(2));
      $scope.$evalAsync();
    },
      

    loadMoreCatagoryBlogs : function(catagory, postNumber, $scope) {
      var tempPostArr = [];
      if(($scope.starting !== postNumber-2) && ($scope.ending !== postNumber-1)) {
        $scope.starting = postNumber-2;
        $scope.ending = postNumber-1;
        if(($scope.ending > 0 || $scope.ending == 0) && ($scope.starting > 0 || $scope.starting == 0)) {
          var postCatagoryWiseRef = new Firebase(FIREBASE_URL+"posts/catagories/" + catagory);
          var tempPost = $firebaseArray(postCatagoryWiseRef.orderByChild("postNumber").startAt($scope.starting).endAt($scope.ending));
          tempPost.$loaded(function(value,key) {
            tempPostArr = value;
            tempPostArr = tempPostArr.concat($scope.post);
            $scope.post = tempPostArr;
            $scope.$evalAsync();
          });  
        };
      };
    },

    getYearlyPosts: function(year,$scope) {
      $scope.post=[];
      var postDateWiseRef = new Firebase(FIREBASE_URL+"posts/dateWise/" + year);
      postDateWiseRef.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key();
          angular.forEach(childSnapshot.val(), function(posts) {
            $scope.post=$scope.post.concat(posts);
            $scope.$evalAsync();
          });
        });
      });
    },

    getMonthlyPosts: function(year, month, $scope) {
      $scope.post=[];
      var postDateWiseRef = new Firebase(FIREBASE_URL+"posts/dateWise/" + year+ "/" +month);
      postDateWiseRef.on("value", function(snapshot) {
        angular.forEach(snapshot.val(), function(posts) {
          $scope.post=$scope.post.concat(posts);
          $scope.$evalAsync();
        });
      });
    },

    getAllPostsForMentor : function() {
      var mentoruid = AuthMentor.resolveUser().uid;
      return $firebaseArray(new Firebase(FIREBASE_URL + "/posts/mentorWise/" + mentoruid));
    },

    getMentorName : function(mentoruid) {
          return $firebaseObject(new Firebase(FIREBASE_URL + "/profileForMentors/" + mentoruid + "/mentorname"));
    },
    
    saveComment : function(postId,comment,name,email,$scope) {
           var defered = $q.defer();
           var commentRef = new Firebase(FIREBASE_URL + "blogComments/" + postId);
           commentRef.push({name:name,email:email,comment:comment},function(){
                $scope.commentSaveSuccessfully = true;
                defered.resolve($scope.commentSaveSuccessfully);
                $scope.$evalAsync();
           })

           return defered.promise;
    },

    getBlogComment : function(postId,$scope) {
        $scope.blogCommentList = $firebaseArray(new Firebase(FIREBASE_URL + "blogComments/" + postId));
        $scope.$evalAsync();
    },

    getHouseProfile : function(houseName, $scope) {
      var houseDetailRef = new Firebase(FIREBASE_URL+"posts/housesDetails/" + houseName);
      $scope.houseDetail = $firebaseObject(houseDetailRef);
      $scope.$evalAsync();
    },

    getStudentDashBoardPosts : function($scope) {
      $scope.post_loaded=5;
      $scope.post = [];
      var postCatagoryWiseRef = new Firebase(FIREBASE_URL+"posts/allPosts");
      postCatagoryWiseRef.on('value' , function(allPosts) {
        $scope.totalPosts = allPosts.numChildren();
        if($scope.totalPosts < 5 || $scope.totalPosts == 5) {
          $scope.hideLoadMore = "yes";
        }
        else 
          $scope.hideLoadMore = "no"; 
      });
      var postsArr = $firebaseArray(postCatagoryWiseRef.orderByChild("postNumber").limitToLast(5));
      postsArr.$loaded(function(postsArr) {
        $scope.post = postsArr;
        $scope.post.reverse();
        $scope.$evalAsync();
      });
    },

    LoadMoreStudentDashBoardPosts : function($scope) {
      var tempPostArr = [];
      var postCatagoryWiseRef = new Firebase(FIREBASE_URL+"posts/allPosts");
      if($scope.post_loaded < $scope.totalPosts)
      {
        var morePostArray =  $firebaseArray(postCatagoryWiseRef.orderByChild("postNumber").startAt($scope.totalPosts-($scope.post_loaded+5)).endAt($scope.totalPosts-($scope.post_loaded)));
        morePostArray.$loaded(function(morePostArray) {
          tempPostArr = morePostArray;
          tempPostArr.reverse();
          $scope.post = $scope.post.concat(tempPostArr);
          $scope.post_loaded = $scope.post.length;
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

     getAuthorDetailAndPost : function(authorUid,$scope) {
      var authorDetailRef = new Firebase(FIREBASE_URL + "/profileForMentors/" + authorUid);
      var authorPostRef = new Firebase(FIREBASE_URL + "posts/mentorWise/" + authorUid)
      $scope.authorDetails = $firebaseObject(authorDetailRef);
      $scope.authorPosts = $firebaseArray(authorPostRef);
      $scope.$evalAsync();
    },

    userClickForScholarship : function() {
      var numberOfClick = $firebaseObject(new Firebase(FIREBASE_URL + "userScholarshipClick"));
      numberOfClick.$loaded(function(numberOfClick) {
        var clickReff = new Firebase(FIREBASE_URL + "userScholarshipClick");
        clickReff.update({userClick : numberOfClick.userClick+1});
      })
      
    },

                                              /*shubham's load more post work*/


    getHousePosts: function(catagory, $scope) {
      $scope.post_loaded=2;
      $scope.post = [];
      var postCatagoryWiseRef = new Firebase(FIREBASE_URL+"posts/catagories/" + catagory);
      postCatagoryWiseRef.on('value' , function(allPosts) {
        $scope.totalPosts = allPosts.numChildren();
        if($scope.totalPosts < 2 || $scope.totalPosts == 2) {
          $scope.hideLoadMore = "yes";
        }
        else 
          $scope.hideLoadMore = "no"; 
      });
      var postsArr = $firebaseArray(postCatagoryWiseRef.orderByChild("postNumber").limitToLast(2));
      postsArr.$loaded(function(postsArr) {
        $scope.post = postsArr;
        $scope.post.reverse();
        $scope.$evalAsync();
      });
    },

    load_more_posts : function(catagory,$scope){
      var tempPostArr = [];
      var postCatagoryWiseRef = new Firebase(FIREBASE_URL+"posts/catagories/" + catagory);
      if($scope.post_loaded < $scope.totalPosts)
      {
        var morePostArray =  $firebaseArray(postCatagoryWiseRef.orderByChild("postNumber").startAt($scope.totalPosts-($scope.post_loaded+3)).endAt($scope.totalPosts-($scope.post_loaded)));
        morePostArray.$loaded(function(morePostArray) {
          tempPostArr = morePostArray;
          tempPostArr.reverse();
          $scope.post = $scope.post.concat(tempPostArr);
          $scope.post_loaded = $scope.post.length;
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
                                          /*shubham's load more post work*/
                                          /*mentor house findable starts*/
    getHouseMentor : function(houseName,$scope) {
      $scope.mentorDetail = [];
      var key = 0;
      var houseMentorRef = new Firebase(FIREBASE_URL + "/houseWiseMentors/" + houseName);
      houseMentorRef.on('value', function(snapshot) {
        angular.forEach(snapshot.val(), function(mentorId) {
          var mentorDetailRef = new Firebase(FIREBASE_URL + "/profileForMentors/" + mentorId);
          mentorDetailRef.on('value', function(mentorDetail) {
            $scope.mentorDetail[key]={image : mentorDetail.val().mentorphoto, mentorname : mentorDetail.val().mentorname, mentorid : mentorId};
            $scope.$evalAsync();
            key = key+1;
          });
        });
      });
    },
                                          /*mentor house findable ends*/

                                      /*commnents for house posts starts*/

    addHousePostComment : function(postKey,postId,PostComment,userId,date,commentTime,timestamp,studentphoto,studentname,$scope) {
      if(!$scope.userName[postId])
        $scope.userName[postId] = [];
      if(!$scope.userPic[postId])
        $scope.userPic[postId] = [];
      var houseCommentRef = new Firebase(FIREBASE_URL + "/houseComments/comments/" + postId);
      houseCommentRef.once("value", function(snapshot) {
        var temp = snapshot.exists();
        if(temp === true) {
          var commentNumber = snapshot.numChildren()+1;
          var comment = houseCommentRef.push({commentNumber:commentNumber, comment:PostComment, likes:0, userId:userId, timestamp:timestamp, date:date, time:commentTime});
          var commentId = comment.key();
          var updateCommentIdRef = new Firebase(FIREBASE_URL + "/houseComments/comments/" + postId + "/" + commentId);
          updateCommentIdRef.update({commentId:commentId});
          $scope.comments[postKey] = $scope.comments[postKey].concat({commentId:commentId, commentNumber:commentNumber, comment:PostComment, likes:0, userId:userId, timestamp:timestamp, date:date, time:commentTime});
          $scope.userName[postId][commentId] = ({"$id":"studentname","$priority":null,"$value":studentname});
          $scope.userPic[postId][commentId] = ({"$id":"studentphoto","$priority":null,"$value":studentphoto});
          $scope.comment_loaded[postKey] = $scope.comment_loaded[postKey] + 1;
          $scope.totalComments[postKey] = $scope.totalComments[postKey] + 1;
          if($scope.comment_loaded[postKey] === $scope.totalComments[postKey] || $scope.comment_loaded[postKey] > $scope.totalComments[postKey])
            $scope.hideLoadMoreButton[postKey] = 'yes';
          else
            $scope.hideLoadMoreButton[postKey] = 'no';
          $scope.$evalAsync();
        }
        else {
          var commentNumber = 1;
          var comment = houseCommentRef.push({commentNumber:commentNumber, comment:PostComment, likes:0, userId:userId, timestamp:timestamp, date:date, time:commentTime});
          var commentId = comment.key();
          var updateCommentIdRef = new Firebase(FIREBASE_URL + "/houseComments/comments/" + postId + "/" + commentId);
          updateCommentIdRef.update({commentId:commentId});
          $scope.comments[postKey] = $scope.comments[postKey].concat({commentId:commentId, commentNumber:commentNumber, comment:PostComment, likes:0, userId:userId, timestamp:timestamp, date:date, time:commentTime});
          $scope.userName[postId][commentId] = ({"$id":"studentname","$priority":null,"$value":studentname});
          $scope.userPic[postId][commentId] = ({"$id":"studentphoto","$priority":null,"$value":studentphoto});
          $scope.totalComments[postKey] = $scope.totalComments[postKey] + 1;
          if($scope.comment_loaded[postKey] === $scope.totalComments[postKey] || $scope.comment_loaded[postKey] > $scope.totalComments[postKey])
            $scope.hideLoadMoreButton[postKey] = 'yes';
          else
            $scope.hideLoadMoreButton[postKey] = 'no';
          $scope.$evalAsync();
        }
      })  
    },


                                          /*commnents for house posts ends*/

                                              /* Load post comments*/

    loadPostComments : function(postId,postKey,$scope){
      if(!$scope.userName[postId])
        $scope.userName[postId] = [];
      if(!$scope.userPic[postId])
        $scope.userPic[postId] = [];
      var commentRef = new Firebase(FIREBASE_URL + "/houseComments/comments/" + postId);
      $scope.comment_loaded[postKey] = 2;
      commentRef.once('value' , function(allComments) {
        $scope.totalComments[postKey] = allComments.numChildren();
        $scope.$evalAsync();
        if($scope.totalComments[postKey] == 0) {
          $scope.hideLoadMoreButton[postKey] = 'yes';
          $scope.$evalAsync();
        }
        var commentsArr = $firebaseArray(commentRef.orderByChild("commentNumber").limitToLast(2));
        commentsArr.$loaded(function(commentsArr) {
          $scope.comments[postKey] = commentsArr;
          angular.forEach(commentsArr, function(commentData, commentId) {
            $scope.userName[postId][commentData.commentId] = Search.getStudentName(commentData.userId);
            $scope.userPic[postId][commentData.commentId] = Search.getStudentPhoto(commentData.userId);
            $scope.$evalAsync();
          })
          if($scope.comment_loaded[postKey] === $scope.totalComments[postKey] || $scope.comment_loaded[postKey] > $scope.totalComments[postKey])
            $scope.hideLoadMoreButton[postKey] = 'yes';
          $scope.$evalAsync();
        });
      })
    },

    loadMoreComments : function(postId,postKey,$scope){
      if($scope.totalComments[postKey] > $scope.comment_loaded[postKey]) {
        var commentRef = new Firebase(FIREBASE_URL + "/houseComments/comments/" + postId);
        var commentsArr = $firebaseArray(commentRef.orderByChild("commentNumber").startAt($scope.totalComments[postKey]-($scope.comment_loaded[postKey]+3)).endAt($scope.totalComments[postKey]-($scope.comment_loaded[postKey])));
        commentsArr.$loaded(function(commentsArr) {
          if(commentsArr.length > 0) {
            angular.forEach(commentsArr, function(commentData, commentId) {
              $scope.userName[postId][commentData.commentId] = Search.getStudentName(commentData.userId);
            $scope.userPic[postId][commentData.commentId] = Search.getStudentPhoto(commentData.userId);
              $scope.$evalAsync();
            })
            var temp = commentsArr;
            temp = temp.concat($scope.comments[postKey]);
            $scope.comments[postKey] = temp;
            $scope.comment_loaded[postKey] = $scope.comments[postKey].length;
          }
          if($scope.comment_loaded[postKey] === $scope.totalComments[postKey] || $scope.comment_loaded[postKey] > $scope.totalComments[postKey])
            $scope.hideLoadMoreButton[postKey] = 'yes';
        });
        $scope.$evalAsync();
      }
      else {
        $scope.hideLoadMoreButton[postKey] = 'yes';
        $scope.$evalAsync();
      }
    },

                                           /* load post comments ends*/
                                          /*EDIT & dELETE POST COMMENTS starts*/
    editPostComment : function(postId, postComment, postKey, commentKey, commentId) {
      var updateCommentRef = new Firebase(FIREBASE_URL + "/houseComments/comments/" + postId + "/" + commentId);
      updateCommentRef.update({comment:postComment});
    },
                                           /*EDIT & dELETE POST COMMENTS ends*/
      
                                            /*like a post's comment starts*/

    getNumberOfLikesOnThisComment : function(postId,commentId,$scope) {
      if(!$scope.numberOfLikesOnThisComment[postId])
        $scope.numberOfLikesOnThisComment[postId] = [];
      var totalPostCommentRef = new Firebase(FIREBASE_URL + "/houseComments/likesOnPostComments/" + postId + "/" + commentId);
      totalPostCommentRef.once("value", function(commentsSnapshot) {
        $scope.numberOfLikesOnThisComment[postId][commentId] = (commentsSnapshot.numChildren());
        $scope.$evalAsync();
      });
    },

    likeThisComment : function(commentId,postId,userId,$scope){
      var updateLike = function() {
        var totalPostCommentRef = new Firebase(FIREBASE_URL + "/houseComments/likesOnPostComments/" + postId + "/" + commentId);
        totalPostCommentRef.once("value", function(commentsSnapshot) {
          $scope.numberOfLikesOnThisComment[postId][commentId] = (commentsSnapshot.numChildren());
          $scope.$evalAsync();
        });
      };
      var likePostCommentRef = new Firebase(FIREBASE_URL + "/houseComments/likesOnPostComments/" + postId + "/" + commentId + "/" + userId);
      likePostCommentRef.set(userId);
      var updateNumberOfLikes = new Firebase(FIREBASE_URL + "/houseComments/comments/" + postId + "/" + commentId);
      updateNumberOfLikes.update({likes : $scope.numberOfLikesOnThisComment[postId][commentId]+1},updateLike);
    },
                                            /*like a post's comment ends*/      


    recentCollegeFeed : function(collegeId,$scope){
      $scope.collegePost = [];
      var collegeFeedRef= new Firebase(FIREBASE_URL + "posts/collegeWise/" + collegeId);
      var postsArr = $firebaseArray(collegeFeedRef.orderByChild("postNumber").limitToLast(4));
      postsArr.$loaded(function(postsArr) {
        $scope.collegePost = postsArr;
        $scope.collegePost.reverse();
        $scope.college_post_loaded=$scope.collegePost.length;
        $scope.$evalAsync();
        collegeFeedRef.on('value' , function(collegePosts) {
          $scope.totalCollegePosts = collegePosts.numChildren();
          if($scope.totalCollegePosts < 4 || $scope.totalCollegePosts == 4) {
            $scope.hideLoadMoreCollegePosts = "yes";
            $scope.$evalAsync();
          }
          else 
            $scope.hideLoadMoreCollegePosts = "no"; 
            $scope.$evalAsync();
        });
      });
    },


    loadMoreCollegeFeeds : function(collegeId,$scope){
      if($scope.totalCollegePosts > $scope.college_post_loaded) {
        var collegeFeedRef = new Firebase(FIREBASE_URL + "posts/collegeWise/" + collegeId);
        var postArr = $firebaseArray(collegeFeedRef.orderByChild("postNumber").startAt($scope.totalCollegePosts-($scope.college_post_loaded+3)).endAt($scope.totalCollegePosts-$scope.college_post_loaded));
        postArr.$loaded(function(postArray) {
          if(postArray.length > 0) {
            postArray.reverse();
            $scope.collegePost = $scope.collegePost.concat(postArray);
            $scope.college_post_loaded = $scope.collegePost.length;
          }
          if($scope.college_post_loaded === $scope.totalCollegePosts || $scope.college_post_loaded > $scope.totalCollegePosts)
            $scope.hideLoadMoreButton = 'yes';
          $scope.$evalAsync();
        });
      }
      else {
        $scope.hideLoadMoreButton = 'yes';
        $scope.$evalAsync();
      }
    },


    seeCollegeFeedcollegewise : function($scope,collegeId) {
      $scope.collegePost = [];
      var collegeFeedRef= new Firebase(FIREBASE_URL + "posts/collegeWise/" + collegeId);
      var postsArr = $firebaseArray(collegeFeedRef.orderByChild("postNumber").limitToLast(4));
      postsArr.$loaded(function(postsArr) {
        $scope.collegePost = postsArr;
        $scope.collegePost.reverse();
        $scope.college_post_loaded = $scope.collegePost.length;
        $scope.$evalAsync();
        collegeFeedRef.on('value' , function(collegePosts) {
          $scope.totalCollegePosts = collegePosts.numChildren();
          if($scope.totalCollegePosts < 4 || $scope.totalCollegePosts == 4) {
            $scope.hideLoadMoreCollegePosts = "yes";
            $scope.$evalAsync();
          }
          else 
            $scope.hideLoadMoreCollegePosts = "no"; 
            $scope.$evalAsync();
        });
      });
    },

    getCollegeUpcommingWebinars : function($scope,collegeId) {
      $scope.collegeUpcommingWebinar = [];
      var collegeUpWebRef= new Firebase(FIREBASE_URL + "collegeWebinar/upcomingWebinar/" + collegeId);
      var upWebArr = $firebaseArray(collegeUpWebRef.orderByChild("webinarNumber").limitToLast(4));
      upWebArr.$loaded(function(upWebArr) {
        $scope.collegeUpcommingWebinar = upWebArr;
        $scope.collegeUpcommingWebinar.reverse();
        $scope.college_up_webinar_loaded = $scope.collegeUpcommingWebinar.length;
        $scope.$evalAsync();
        collegeUpWebRef.on('value' , function(collegeUpWebinars) {
          $scope.totalCollegeUpWebinars = collegeUpWebinars.numChildren();
          if($scope.totalCollegeUpWebinars < 4 || $scope.totalCollegeUpWebinars == 4) {
            $scope.hideLoadMoreCollegeUpWebinars = "yes";
            $scope.$evalAsync();
          }
          else 
            $scope.hideLoadMoreCollegeUpWebinars = "no"; 
            $scope.$evalAsync();
        });
      });
    },

      getCollegeCompletedWebinars : function($scope,collegeId) {
      $scope.collegeCompletedWebinar = [];
      var collegeComWebRef= new Firebase(FIREBASE_URL + "collegeWebinar/completedWebinar/" + collegeId);
      var comWebArr = $firebaseArray(collegeComWebRef.orderByChild("webinarNumber").limitToLast(4));
      comWebArr.$loaded(function(comWebArr) {
        $scope.collegeCompletedWebinar = comWebArr;
        $scope.collegeCompletedWebinar.reverse();
        $scope.college_com_webinar_loaded = $scope.collegeCompletedWebinar.length;
        $scope.$evalAsync();
        collegeComWebRef.on('value' , function(collegeComWebinars) {
          $scope.totalCollegeComWebinars = collegeComWebinars.numChildren();
          if($scope.totalCollegeComWebinars < 4 || $scope.totalCollegeComWebinars == 4) {
            $scope.hideLoadMoreCollegeComWebinars = "yes";
            $scope.$evalAsync();
          }
          else 
            $scope.hideLoadMoreCollegeComWebinars = "no"; 
            $scope.$evalAsync();
        });
      });
    },

    seeCollegeFeed : function($scope) {
      $scope.collegePost = [];
      var collegeFeedRef= new Firebase(FIREBASE_URL + "posts/catagories/collegePost");
      var postsArr = $firebaseArray(collegeFeedRef.orderByChild("postNumber").limitToLast(4));
      postsArr.$loaded(function(postsArr) {
        $scope.collegePost = postsArr;
        $scope.collegePost.reverse();
        $scope.college_post_loaded=$scope.collegePost.length;
        $scope.$evalAsync();
        collegeFeedRef.on('value' , function(collegePosts) {
          $scope.totalCollegePosts = collegePosts.numChildren();
          if($scope.totalCollegePosts < 4 || $scope.totalCollegePosts == 4) {
            $scope.hideLoadMoreCollegePosts = "yes";
            $scope.$evalAsync();
          }
          else 
            $scope.hideLoadMoreCollegePosts = "no"; 
            $scope.$evalAsync();
        });
      });
    },

    loadMoreAllCollegeFeeds : function($scope) {
      if($scope.totalCollegePosts > $scope.college_post_loaded) {
        var collegeFeedRef= new Firebase(FIREBASE_URL + "posts/catagories/collegePost");
        var postArr = $firebaseArray(collegeFeedRef.orderByChild("postNumber").startAt($scope.totalCollegePosts-($scope.college_post_loaded+3)).endAt($scope.totalCollegePosts-$scope.college_post_loaded));
        postArr.$loaded(function(postArray) {
          if(postArray.length > 0) {
            postArray.reverse();
            $scope.collegePost = $scope.collegePost.concat(postArray);
            $scope.college_post_loaded = $scope.collegePost.length;
          }
          if($scope.college_post_loaded === $scope.totalCollegePosts || $scope.college_post_loaded > $scope.totalCollegePosts)
            $scope.hideLoadMoreButton = 'yes';
          $scope.$evalAsync();
        });
      }
      else {
        $scope.hideLoadMoreButton = 'yes';
        $scope.$evalAsync();
      }
    },
/**********************************************college Post************************************************************/
  };
  return Blog;
});