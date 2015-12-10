'use strict';

var pos=null;
var app = angular.module('mmaApp', [
    'ngAnimate',
    'ngRoute',
    'ui.utils',
    'checklist-model',
    'firebase',
    'angularFilepicker',
    'ui.bootstrap',
    'toaster',
    'youtube-embed',
    'duScroll',
    'angular-md5',
    'ngMap',
    'textAngular',
    'me-lazyload',
    'angularytics'
  ])
  app.constant('FIREBASE_URL', 'https://mmaapp.firebaseio.com/');
  app.run(function($rootScope, $location, $anchorScroll, $routeParams) {
  $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    if($location.path() == '/main') {
      $location.hash($routeParams.scrollTo);
      $anchorScroll(); 
      }
    });
  });
  app.filter('convert', function(){
  return function(input){
  var months={'01':"Jan",'02':"Feb",'03':"Mar",'04':"Apr",'05':"May",'06':"Jun",'07':"Jul",'08':"Aug",'09':"Sep",'10':"Oct",'11':"Nov",'12':"Dec"};   
  var mm=String(input[4]+input[5]);
  var output=input[6]+input[7]+' '+months[mm]+' '+input[0]+input[1]+input[2]+input[3];
    return output; 
  };
   
  });
  app.filter('change_time', function(){
   return function(input){
    var dd = "AM";
    var h = parseInt(input[0]+input[1]);
    if (h >= '12') {
        h = h-'12';
        dd = "PM";
    }
    if (h == '0') {
        h = '12';
    }
    var output=h+':'+input[3]+input[4]+dd;
      return output; 
    };
   
  });
  app.controller('mapController', function($scope) {
    $('#mma-button').fadeOut();
    $scope.setMapCenterToMarker=function(){
      $scope.map.panTo({lat: 28.621398, lng: 77.081163});
      $scope.map.setZoom(16);
      $('#mma-button').fadeOut(100);
    };
    $scope.onDrag=function(){
      var MMAmarker=new google.maps.LatLng(28.621398,77.076163);
      if($scope.map.getBounds().contains(MMAmarker)){
        $('#mma-button').fadeOut(100);
      }
      else{
        $('#mma-button').fadeIn(100);
      }
    };
  });
  app.directive('scrollTrigger', function($window) {
    return {
        link : function(scope, element, attrs) {
            var offset = parseInt(attrs.threshold) || 0;
            var e = jQuery(element[0]);
            var doc = jQuery(document);
            angular.element(document).bind('scroll', function() {
                if (doc.scrollTop() + $window.innerHeight + offset > e.offset().top) {
                    scope.$apply(attrs.scrollTrigger);
                }
            });
        }
    };
  });

  app.directive('demoEditor', function(broadcastFactory) {
  return {
    restrict: 'AE',
    link: function(scope, elem, attrs) {
      scope.$watch('isEditable', function(newValue) {
        elem.attr('contenteditable', newValue);
      });
      elem.on('keyup keydown', function() {
        scope.$apply(function() {
          scope[attrs.model] = elem.html().trim();
        });
      });
    }
  };
  });

  app.directive('scroll', function($window, $route, $location){//, $cookies) {
    return {
      restrict: 'AE',
      link: function(scope, elem, attrs) {
        var pos=null;
        if($location.path() == '/main') {
          angular.element($window).unbind("scroll");
          angular.element($window).bind("scroll", function() {
            if($(window).width()>768&&$location.path() == '/main'){
              elem.removeClass("set-bottom");
              elem.removeClass("stick-top");
              $('.main-page-feature-second-how-it-works-img-div-right').removeClass('col-md-offset-6');
              pos = $('#howItWorks').position().top;//elem.position().top;
               pos = pos + 82;
              var windowpos = $window.scrollY;
              var stickermax = $('#howItWorks').position().top+$('#howItWorks').height()-($('#howItWorks').height()/10)*2.3;
              if (windowpos >= pos && windowpos < stickermax) {
                $('.main-page-feature-second-how-it-works-img-div-right').addClass('col-md-offset-6');
                elem.removeClass("set-bottom");
                elem.addClass("stick-top");
              }
              else if (windowpos >= stickermax) {
                elem.removeClass("stick-top");
                elem.addClass("set-bottom");
                $('.main-page-feature-second-how-it-works-img-div-right').removeClass('col-md-offset-6');
              }
              else {
                elem.removeClass("set-bottom");
                elem.removeClass("stick-top");
                $('.main-page-feature-second-how-it-works-img-div-right').removeClass('col-md-offset-6');
              }

              if($route.current.activePage == 'transNav') {
                if(windowpos >= 10) {
                  $('nav.navbar.navbar-default').removeClass('nav-signed-out');
                  $('nav.navbar.navbar-default').addClass('blue-dark nav-signed-in');
                }
                else {
                  $('nav.navbar.navbar-default').removeClass('blue-dark nav-signed-in');
                  $('nav.navbar.navbar-default').addClass('nav-signed-out');
                }
              }
              scope.$apply();
            }
          });
        }
        else if($location.path().indexOf('/college-profile/simplelogin:')+1) {
          angular.element($window).unbind("scroll");
          angular.element($window).bind("scroll", function() {
            var windowpos = $window.scrollY;
            if($route.current.activePage == 'transNav') {
              if(windowpos >= 10) {
                
                $('nav.navbar.navbar-default').removeClass('nav-signed-out');
                $('nav.navbar.navbar-default').addClass('blue-dark nav-signed-in');
              }
              else {
                $('nav.navbar.navbar-default').removeClass('blue-dark nav-signed-in');
                $('nav.navbar.navbar-default').addClass('nav-signed-out');
              }
            }
          });
          scope.$evalAsync();
        }
    }
  }
});

  app.directive("starRating", function() {
    return {
      restrict : "A",
      template : "<ul class='rating'>" +
                 "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
                 "    <i class='fa fa-star anhadcust{{$index}}'></i>" + //&#9733
                 "  </li>" +
                 "</ul>",
      scope : {
        ratingValue : "=",
        max : "=",
        onRatingSelected : "&"
      },
      link : function(scope, elem, attrs) {
        var updateStars = function() {
          scope.stars = [];
          for ( var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled : i < scope.ratingValue
            });
          }
        };
        scope.toggle = function(index) {
          scope.ratingValue = index + 1;
          scope.onRatingSelected({
            rating : index + 1
          });
        };
        scope.$watch("ratingValue", function(oldVal, newVal) {
          if (newVal) { updateStars(); }
        });
      }
    };
  });
  app.filter('titleCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
  });

  app.filter('slice', function() {
      return function(arr, start, end) {
            return arr.slice(start, end);
          };
  });

  app.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

    app.filter('cut_phone', function () {
        return function (value) {
            if (!value) return '';
            
            var max = 6;
            var value_num;
            value_num = value.substr(max, 9);
            
            return 'xxxxxx' + value_num;
        };
    });

    app.filter('cut_email',function() {
      return function (email) {
        var tempEmail='';
        var temp = email.split('@');
        for(var i=0;i<temp[0].length-5;i++) {
          tempEmail= tempEmail + (temp[0][i]);
        }
        tempEmail = tempEmail + "****@" + "****.com";
        return tempEmail;
      };
    });

    app.config(function(AngularyticsProvider) {
      AngularyticsProvider.setEventHandlers(['Console', 'GoogleUniversal']);
    }).run(function(Angularytics) {
      Angularytics.init();
    });
  

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'AuthCtrl as registration',
        resolve: {
          user: function(Auth) {
            return Auth.resolveUser();
          }
        },
        activePage: 'normNav'
      })

     .when('/register/:email', {
        templateUrl: 'views/refer-register.html',
        controller: 'ReferCtrl',
        resolve: {
          user: function(Auth) {
            return Auth.resolveUser();
          }
        },
        activePage: 'normNav'
      }) 
     .when('/login/:email', {
        templateUrl: 'views/refer-login.html',
        controller: 'ReferCtrl',
        resolve: {
          user: function(Auth) {
          return Auth.resolveUser();
          }
        },
        activePage: 'normNav'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AuthCtrl',
        resolve: {
          user: function(Auth) {
          return Auth.resolveUser();
          }
        },
        activePage: 'normNav'
      })
      .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
        activePage: 'normNav'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          user: function(Auth) {
          return Auth.resolveUser();
          }
        },
        activePage: 'transNav'
      })
      .when('/about', {
        templateUrl: 'views/about-us.html',
        controller: 'AboutCtrl',
        activePage: 'normNav'
      })
      .when('/student-counselling-center', {
        templateUrl: 'views/counselling.html',
        controller: 'studentDashBookedHistoryCtrl',
        activePage: 'noFoot'
      })
      .when('/dashboard', {
        templateUrl: 'views/student-dashboard-dash.html',
        controller: 'StudentDashCtrl',
        activePage: 'noFoot'
      })
      .when('/student-profile', {
        templateUrl: 'views/student-dashboard-profile.html',
        controller: 'StudentDashCtrl',
        activePage: 'noFoot'
      })
      .when('/student-college-search', {
        templateUrl: 'views/studentCollegeSearch.html',
        controller: 'SearchCtrl',
        activePage: 'noFoot'
      })
      .when('/student-fund', {
        templateUrl: 'views/student-dashboard-incentive.html',
        controller: 'StudentDashCtrl',
        activePage: 'noFoot'
      })
      .when('/student-houses', {
        templateUrl: 'views/student-houses.html',
        controller: 'BlogCtrl',
        activePage: 'noFoot'
      })
      .when('/student-webinar-detail', {
        templateUrl: 'views/student-webinar-detail.html',
        controller: 'StudentDashCtrl',
        activePage: 'noFoot'
      })
      .when('/all-completed-webinars', {
        templateUrl: 'views/archieve-webinar.html',
        controller: 'studentDashBookedHistoryCtrl',
        activePage: 'noFoot'
      })
      .when('/house/:houseName', {
        templateUrl: 'views/student-houses.html',
        controller: 'BlogCtrl',
        activePage: 'noFoot'
      })
      .when('/student-booked-history', {
        templateUrl: 'views/student-dashboard-bh.html',
        controller: 'studentDashBookedHistoryCtrl',
        activePage: 'noFoot'
      })
     .when('/error', {
        templateUrl: 'views/err.html',
        controller: 'Nav-dashCtrl',
        activePage: 'normNav'
      })
      .when('/verify/:userId', {
        templateUrl: 'views/verify.html',
        controller: 'VerifyCtrl',
        activePage: 'normNav'
      }) 
      .when('/refer', {
        templateUrl: 'views/student-dashboard-incentive.html',
        controller: 'StudentDashCtrl',
        activePage: 'normNav'
      })
      .when('/contact', {
        templateUrl: 'views/contact-us.html',
        controller: 'ContactCtrl',
        activePage: 'normNav'
      })
      .when('/blog/:Year', {
        templateUrl: 'views/yearlyData.html',
        controller: 'BlogCtrl',
        activePage: 'normNav' 
      })
      .when('/blog/:Year/:Month', {
        templateUrl: 'views/monthlyData.html',
        controller: 'BlogCtrl',
        activePage: 'normNav' 
      })
      .when('/post/:postId', {
        templateUrl: 'views/view-post.html',
        controller: 'BlogCtrl',
        activePage: 'normNav' 
      })
      .when('/category/:catagoryName', {
        templateUrl: 'views/blogCatagory.html',
        controller: 'BlogCtrl',
        activePage: 'normNav' 
      })
      .when('/sitemap',{
        templateUrl: 'views/sitemap.html',
        controller: 'MainCtrl',
        activePage: 'normNav' 
      })
      .when('/mobile', {
        templateUrl: 'views/android.html',
        controller: 'MainCtrl',
        activePage: 'normNav' 
      })
      .when('/faq', {
        templateUrl: 'views/faq.html',
        controller: 'MainCtrl',
        activePage: 'normNav' 
      })
      .when('/forgotpassword', {
        templateUrl: 'views/forgotpassword.html',
        controller: 'MainCtrl',
        activePage: 'normNav'
      })
      .when('/resetpassword/:url', {
        templateUrl: 'views/reset-password.html',
        controller: 'MainCtrl',
        activePage: 'normNav'
      })
      .when('/account-settings', {
        templateUrl: 'views/account-settings.html',
        controller: 'StudentDashCtrl',
        activePage: 'noFoot'

      })
      .when('/all-posts', {
        templateUrl: 'views/allposts.html',
        controller: 'BlogCtrl',
        activePage: 'normNav'
      })
      .when('/author-profile/:mentorid', {
        templateUrl: 'views/author-profile.html',
        controller: 'MentorCtrl',
        activePage: 'noFoot'
      })
      .when('/view-monthly-post/:postDate',{
        templateUrl: 'views/monthly-post.html',
        controller: 'BlogCtrl',
        activePage: 'normNav' 
      })
      .when('/earn-scholarship',{
        templateUrl: 'views/earn-scholarship.html',
        controller: 'MainCtrl',
        activePage: 'normNav' 
      })
      .when('/facebook',{
        templateUrl: 'views/facebook-auth.html',
        controller: 'MainCtrl',
        activePage: 'normNav' 
      })
      .when('/signup-success',{
        templateUrl: 'views/complete-signup.html',
        controller: 'MainCtrl',
        activePage: 'normNav' 
      })
      .when('/house', {
        templateUrl: 'views/houses.html',
        controller: 'StudentDashCtrl',
        activePage: 'noFoot'
      })
      .when('/all-college-posts', {
        templateUrl: 'views/allCollegePosts.html',
        controller: 'BlogCtrl',
        activePage: 'noFoot'
      })
      .when('/collegePost/:postId', {
        templateUrl: 'views/view-college-post.html',
        controller: 'BlogCtrl',
        activePage: 'noFoot' 
      })
      .when('/view-webinar/:webinarId',{
        templateUrl: 'views/view-webinar.html',
        controller: 'WebinarCtrl',
        activePage: 'normNav' 
      })
      .when('/ReferNodalVerify/:userId', {
        templateUrl: 'views/refernodalverify.html',
        controller: 'VerifyReferNodalCtrl',
        activePage: 'normNav'
      }) 
      .when('/college-profile/:collegeId', {
        templateUrl: 'views/college-profile.html',
        controller: 'CollegeProfileCtrl',
        activePage: 'transNav'
      })
      .when('/special-event',{
        templateUrl: 'views/special-event.html',
        controller: 'WebinarCtrl',
        activePage: 'normNav' 
      })
      .when('/live-webinar',{
        templateUrl: 'views/live-webinar.html',
        controller: 'MainCtrl',
        activePage: 'normNav' 
      })
      .otherwise({
        redirectTo: '/main'
      });
  });