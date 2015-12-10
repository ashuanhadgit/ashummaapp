'use strict';

app.controller('VerifyCtrl', function ($scope, $controller, $http, $location, $document, Verify, Auth, Search) {
	$scope.signedIn = Auth.signedIn;
	$scope.go = function () {
		var str = $location.path();
		var data = str.split("/verify/:");
		if(data[1]) {
			var str2 = data[1];
			var data =  str2.split("SimLog");
			if (data[1]) {
				if(isNaN(data[0])) 
					var UserId = data[0];
				else
					var UserId = "simplelogin:"+data[0];
				$scope.studentdetail = Search.getStudentDetail(UserId);
				$scope.studentdetail.$loaded().then(function() {
					if($scope.studentdetail.emailverificationstatus == 'true') {
						$scope.verStatus = "already verified";
					}
					else {
						var str3 = data[1];
						var data1 = str3.split("mail=");
						if (data1[1]) {
							$scope.MD5 = Verify.getMD5(UserId);
							$scope.MD5.$loaded().then(function() {
								if (data1[0] == $scope.MD5.$value) {
									$scope.email = Search.getStudentEmail(UserId);
									$scope.email.$loaded().then(function() {
										if (data1[1] == $scope.email.$value) {
											Verify.getEmailVerified(UserId);
											$scope.verStatus = "verified";
										}	
										else {
											$scope.verStatus = "not verified";
										}
									})
								}
								else{
									$scope.verStatus = "not verified";
								}
							});
						}
						else {
							$scope.verStatus = "not verified";
						}
					}
				})
			}
			else {
				$scope.verStatus = "not verified";
			};
		}
		else {
			$scope.verStatus = "not verified";
		};
	};

	$scope.toTheTop = function() {
      $document.scrollTopAnimated(0, 2000).then(function() {
      });
  };

	
}).value('duScrollOffset', 30);



 