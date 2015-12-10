'use strict';

app.controller('AuthCtrl', function ($scope, $document, md5, $controller, $http, $location, Auth, user, Search) {
  $scope.submitbuttondisabled = false;
  $scope.modalShown = false;
  if (user) {
    $location.path('/');
  }
 $scope.message = "";

  $scope.gender = [{
          name: "Male"
       },{  
          name: "Female"
  }];

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

  $scope.loginusingfb = function () {
    //$scope.modalShown = true;
    Auth.loginusingfb($scope.user , $scope);
  };

  $scope.loginusinggoogle = function () {
    //$scope.modalShown = true;
    Auth.loginusinggoogle($scope.user , $scope);
  };

  $scope.login = function () {
    $scope.modalShown = true;
    Auth.login($scope.user.email,$scope.user.password, $scope).then(function () {
      var usertype = Auth.resolveUser().auth.uid;
      $location.path('/dashboard');
    });
  };

  
  $scope.doThisForStudent = function(studentEmail1) {
    studentEmail1 = angular.lowercase(studentEmail1); 
      if(!studentEmail1) {
        $scope.student1IdFlag = "";
        $scope.student1Uid = "";
        //$scope.submitdisabled = true;
      }
      else {
          Search.getStudentIdByEmail(studentEmail1).then ( function ( result ) {
          $scope.student1Uid = result;
          if($scope.student1Uid !== "user doesnot exists") {
            $scope.student1IdFlag = "Done";
            $scope.student1Name = Search.getStudentName($scope.student1Uid);
          //  $scope.submitdisabled = false;
            }
          else{
            $scope.student1IdFlag = "Not Done";
            //$scope.submitdisabled = true;
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

  $scope.showEmailText = false;
  $scope.showEmail = function() {
    if($scope.user.email == "") {
      $scope.showEmailText = false;
    }
    else {
      $scope.showEmailText = true;
    }  
  };
 

  $scope.checkCount = function() {
    Auth.checkCount();
  };

  $scope.showPasswordText = false;
  $scope.showPass = function() {
    if($scope.user.password == "") {
      $scope.showPasswordText = false;
    }
    else {
      $scope.showPasswordText = true;
    }
  };
  
  $scope.register = function () {
    $scope.submitbuttondisabled = true;
    $scope.modalShown = true;
      Auth.register($scope.user).then(function(user) {
        return Auth.login($scope.user.email,$scope.user.password, $scope).then(function() {
          user.md5_hash = md5.createHash($scope.user.email || '');
          user.studentname = $scope.user.studentname;
          user.studentmobile = $scope.user.studentmobile;
          user.email = angular.lowercase($scope.user.email); 
          user.gender = $scope.user.gender;
          user.password = $scope.user.password;
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
                                pass: $scope.user.password, 
                                sname: $scope.user.studentname,
                                hashkey : user.md5_hash,
                                semail : $scope.user.email,
                                smobile : $scope.user.studentmobile,
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
      });
      $scope.message = "";
      $scope.error ="";
  };
}).value('duScrollOffset', 30);