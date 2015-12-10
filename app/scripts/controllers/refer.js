'use strict';

app.controller('ReferCtrl', function ($scope, $document, $controller, md5, $http, $location, Auth, user, Search) {
 $scope.submitbuttondisabled = false;
 if(user){
        Auth.logout();
 }
 $scope.message = "";
 $scope.referalstatus ="";
 $scope.checkuid;
 $scope.checkloginuid;
 var str2;
 var str4;
 var referredBy;
  $scope.referId = "Not";
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
$scope.error
  $scope.login = function () {
      Auth.login($scope.user,$scope).then(function () {
      var usertype = Auth.resolveUser().uid;
      Auth.updatereferBy(usertype,referredBy, $scope);
      Search.getStudentIdByEmail(str4).then ( function (result2) {
          var new3 = result2;
          Auth.saveEntry(new3,usertype);
          Auth.viewChanges(usertype).then ( function ( result15 ) {
          if(result15.gender == 'Female'){
            var stugender = "her";
          }
          else{
             stugender = "his"; 
          }
          var dataToPost = {
                                to: str4, 
                                sname: $scope.oldstudentname.$value,
                                fname: result15.studentname,
                                fgender: stugender
                            };
                $http({
                url: "/sendacceptinvitemail", 
                method: "GET",
                params: {   
                            to: dataToPost.to,
                            sname: dataToPost.sname,
                            fname: dataToPost.fname,
                            fgender: dataToPost.fgender   
                        }
                }).success(function(serverResponse) {
                    console.log(serverResponse);
                }).error(function(serverResponse) {
                    console.log(serverResponse);
                });
            });      
          $location.path('/dashboard');
        });
    }, function (error) {
      console.log(error);
      $scope.error = error.message;
    });
  };

 
  $scope.checkurl = function () {
    var str = $location.path();
    var data = str.split("/register/:");
    str2 = data[1];
    Search.getStudentIdByEmail(str2).then ( function ( result ) {
          $scope.checkuid = result;
          $scope.oldstudentname = Search.getStudentName($scope.checkuid);
          Auth.viewChanges(result).then ( function ( result11 ) {
            if(typeof result11.referredBy == 'undefined'){
              $scope.yourstatus = "old";
            } 
          });
          if($scope.checkuid !== "user doesnot exists") {
              var stuSplit = $scope.checkuid.split(":");
              var stuId = stuSplit[1];
              $scope.user.referredBy = $scope.checkuid;
          }
          else{
               $scope.yourstatus = "old";
               $scope.user.referredBy = "nobody";
            }
        }, function(error){
            console.log(error);
        });
    };

    $scope.checkloginurl = function () {
    var strget = $location.path();
    var data1 = strget.split("/login/:");
        str4 = data1[1];      
    $scope.friendsemail = str4;    
    Search.getStudentIdByEmail(str4).then ( function ( result ) {
          $scope.checkloginuid = result;
          $scope.oldstudentname = Search.getStudentName($scope.checkloginuid);
          Auth.viewChanges(result).then ( function ( result12 ) {
            if(typeof result12.referredBy == 'undefined'){
              $scope.yourstatus = "old";
            } 
          });
          if($scope.checkloginuid !== "user doesnot exists") {
              var stuSplit = $scope.checkloginuid.split(":");
              var stuId = stuSplit[1];
              referredBy = $scope.checkloginuid;
          }
          else{
               $scope.yourstatus = "old";
               referredBy = "nobody";
               }
        }, function(error){
            console.log(error);
        });
    };

  $scope.doThisForCounsellor = function(collegeEmail) {
      collegeEmail =angular.lowercase(collegeEmail); 
      if(!collegeEmail) {
        $scope.collegeIdFlag = "";
        $scope.error = "";
      }
      else {
        Search.getCollegeIdByEmail(collegeEmail).then ( function ( result ) {
        $scope.collegeUid = result;
        if($scope.collegeUid !== "user doesnot exists") {
          $scope.collegeIdFlag = "Done";
          $scope.collegeName = Search.getCollegeName($scope.collegeUid); 
          //$scope.submitdisabled = false;       
         }
        else{
          $scope.collegeIdFlag = "Not Done";
          //$scope.submitdisabled = true;
        }
        }, function(error){
          $scope.collegeIdFlag = "Not Done";
          console.log(error);
        });
      }
    };

    $scope.doThisForStudent = function(studentEmail1) { 
      $scope.error= "";
      studentEmail1 =angular.lowercase(studentEmail1);
      if(!studentEmail1) {
        $scope.student1IdFlag = "";
        $scope.student1Uid = "";
        $scope.referalstatus = "";
        $scope.error = "";
      }
      else {
          Search.getStudentIdByEmail(studentEmail1).then ( function ( result ) {
          $scope.student1Uid = result;
          if($scope.student1Uid !== "user doesnot exists") {
            $scope.student1IdFlag = "Done";
            $scope.student1Name = Search.getStudentName($scope.student1Uid);
            Auth.viewChanges($scope.student1Uid).then ( function ( result1 ) {
            if(str4 === studentEmail1){
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
            else {
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
                    if(serverResponse =='sent'){
                      console.log(serverResponse);
                    }
                    else if(serverResponse =='error') {
                      console.log(serverResponse);  
                    }
                    else
                    {
                      console.log(serverResponse);
                    }
                }).error(function(serverResponse) {
                    if(serverResponse =='sent'){
                      console.log(serverResponse);
                    }
                    else if(serverResponse =='error') {
                      console.log(serverResponse);  
                    }
                    else
                    { 
                      console.log(serverResponse);
                    }
                });
            }
          });
          }
          else{
            $scope.student1IdFlag = "Not Done";
            $scope.referalstatus = "";
            }
        }, function(error){
            $scope.student1IdFlag = "Not Done";
            $scope.referalstatus = "";
            console.log(error);
        });
      }
    };

  $scope.toTheTop = function() {
    if(user) {
      Auth.logout();
    }
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
    var check = !(($scope.student_reg.confirm_password.$dirty) && ($scope.student_reg.confirm_password.$error.validator));
    var check1 = !(($scope.student_reg.confirm_email.$dirty) && ($scope.student_reg.confirm_email.$error.validator));
    if (check && check1) {
      Auth.register($scope.user).then(function(user) {
        return Auth.login($scope.user).then(function() {
          user.md5_hash = md5.createHash($scope.user.email || '');
          user.studentname = $scope.user.studentname;
          user.studentmobile = $scope.user.studentmobile;
          user.email = angular.lowercase($scope.user.email); 
          user.fathername = $scope.user.fathername;
          user.gender = $scope.user.gender;
          user.password = $scope.user.password;
          user.profiletype = 'student';
          user.studentAvailability = 'offline';
          user.studentstatus = 'notverified';
          user.emailverificationstatus = 'false';
          user.referredBy = $scope.user.referredBy;
          user.studentphoto ='https://www.filepicker.io/api/file/zEAoaiVbRRW0HrtJApxM';
          return Auth.createProfile(user);
        }).then(function() {
          var userid = Auth.resolveUser().uid;
                            Search.getStudentIdByEmail(str2).then(function (result4) {
                                var new4 = result4;
                                Auth.saveEntry(new4,userid,$scope.user.email);

                                Auth.viewChanges(userid).then(function (result16) {
                                      if(result16.gender == 'Female'){
                                        var stugender = "her";
                                      }
                                      else{
                                         stugender = "his"; 
                                      }
                                      var dataToPost = {
                                                            to: str2, 
                                                            sname: $scope.oldstudentname.$value,
                                                            fname: result16.studentname,
                                                            fgender: stugender
                                                        };
                                            $http({
                                            url: "/sendacceptinvitemail", 
                                            method: "GET",
                                            params: {   
                                                        to: dataToPost.to,
                                                        sname: dataToPost.sname,
                                                        fname: dataToPost.fname,
                                                        fgender: dataToPost.fgender   
                                                    }
                                            }).success(function(serverResponse) {
                                                console.log(serverResponse);
                                            }).error(function(serverResponse) {
                                                console.log(serverResponse);
                                            });
                                  });

                        });
                                            $scope.modalShown = false;
                                            var str = user.uid;
                                            var urlId = str.split(":");
                                            Auth.createAdminForStudent(user);
                                            var dataToPost = {
                                                                  to: user.email, 
                                                                  pass: $scope.user.password, 
                                                                  sname: $scope.user.studentname,
                                                                  hashkey : user.md5_hash,
                                                                  urlId : urlId[1]
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
                      
                                                  if($scope.checkuid === "user doesnot exists") {
                                                  var dataToPost = {
                                                                          to: str2, 
                                                                          rname: $scope.user.studentname
                                                                          
                                                                    };
                                                          $http({
                                                          url: "/sendcheckrefermail", 
                                                          method: "GET",
                                                          params: {   to: dataToPost.to,
                                                                      rname: dataToPost.rname
                                                                  }
                                                          }).success(function(serverResponse) {
                                                              console.log(serverResponse);
                                                          }).error(function(serverResponse) {
                                                              console.log(serverResponse);
                                                          });
                                                    }
                                                    else {
                                                    }             
                                                    $location.path('/dashboard');
                                                    });
                   
                        }, function(error) {
                          $scope.modalShown = false;
                          $scope.submitbuttondisabled = false;
                          $scope.error = error.message;
                        });
                        $scope.message = "";
                        $scope.error ="";
                      }
                      else if (!check1 && !check)
                        {
                          $scope.modalShown = false;
                          $scope.submitbuttondisabled = false;
                          $scope.message = "Please re-check emails & passwords";
                      }
                      else if (!check)
                        {
                          $scope.modalShown = false;
                          $scope.submitbuttondisabled = false;
                          $scope.message = "Please re-check passwords";
                      }
                      
                        else {
                          $scope.modalShown = false;
                          $scope.submitbuttondisabled = false;
                          $scope.message = "Please re-check emails";
                      }
                    };
}).value('duScrollOffset', 30);