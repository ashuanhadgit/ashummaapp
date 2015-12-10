'use strict';

app.controller('VerifyReferNodalCtrl', function ($scope, $controller, $http, $location, VerifyReferNodal, NodalTask, Auth, Search) {
	$scope.signedIn = Auth.signedIn;
	
	$scope.go = function () {
		var str = $location.path();
		var data = str.split("/ReferNodalVerify/:");
		var ref  = str.split("/ReferNodalVerify/:");
		if(data[1]) {
			var str2 = data[1];
			var data =  str2.split("SimLog");
			
			if (data[1]) {
				if(isNaN(data[0])) {
					var UserId = data[0];
				}
				else {
					var UserId = "simplelogin:"+data[0];
				}
				var str4 = data[1];
				
				var data2 = str4.split("NSL=");
				var refferid = data2[1];
				
				if(isNaN(data2[1])) {
					var nodalid = data2[1];
				}
				else {
					var nodalid = "simplelogin:"+data2[1];
				}
				
				Search.getNodalAdminDetail(nodalid).then (function (nodal) {
					$scope.nodaldetail = nodal;
				});


				Search.getNodalIdById(nodalid).then ( function ( result ) {
		          $scope.nodal1Uid = result;
		          if($scope.nodal1Uid !== "user doesnot exists") {
		            $scope.student1IdFlag = "Done";
		            
		            //  $scope.submitdisabled = false;
		            }
		          else{
		            $scope.student1IdFlag = "Not Done";
		            
		          }
		        }, function(error){
		            $scope.student1IdFlag = "Not Done";
		            
		        });

				$scope.studentdetail = Search.getStudentDetail(UserId);

				$scope.studentdetail.$loaded().then(function() {
			        var ApprovedSessionCount = 0;
				    var counter = 0;
				    var totalReferredStudents = 0;
				    NodalTask.getTotalStudentReferralLength(UserId).then( function (result) {
				    	totalReferredStudents = result.length;
					    NodalTask.getStudentSessionDetail(UserId).then( function(value) {
						    
						    var sessions = value;
						    
						    var sessionArrayLength = sessions.length;
						    if(sessionArrayLength == 0) {
						    	
						      	ApprovedSessionCount=0;
						      	if($scope.studentdetail.emailverificationstatus == 'true' && $scope.student1IdFlag == "Done"  && (typeof $scope.studentdetail.referredByNodalAdmin == 'undefined')) {
										$scope.verStatus = "verified";
										VerifyReferNodal.getEmailVerified(UserId,refferid, nodalid, ApprovedSessionCount, totalReferredStudents);
								}
								else {
									
									var str3 = data[1];
									var data1 = str3.split("mail=");
									var str5 = data1[1];
									var data5 = str5.split("NSL=");
									if (data1[1]) {
										$scope.MD5 = VerifyReferNodal.getMD5(UserId);
										$scope.MD5.$loaded().then(function() {
										

											if (data1[0] === $scope.MD5.$value) {
												
												$scope.email = Search.getStudentEmail(UserId);
												$scope.email.$loaded().then(function() {				
													if (data5[0] == $scope.email.$value && $scope.student1IdFlag == "Done" && (typeof $scope.studentdetail.referredByNodalAdmin == 'undefined')) {
														VerifyReferNodal.getEmailVerified(UserId,refferid, nodalid, ApprovedSessionCount, totalReferredStudents); 
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
					        }
					        else if(sessionArrayLength !== 0) { 
						      	angular.forEach(sessions, function(value,key) {
							      	
							        counter = counter + 1;
							       
							        if(typeof value.incentiveAmountPerSession !== 'undefined') {
							          ApprovedSessionCount = ApprovedSessionCount+1;
							          
							        }							   
							        if(counter === sessionArrayLength) {							        	
							          	if($scope.studentdetail.emailverificationstatus == 'true' && $scope.student1IdFlag == "Done"  && (typeof $scope.studentdetail.referredByNodalAdmin == 'undefined')) {
											$scope.verStatus = "verified";
											VerifyReferNodal.getEmailVerified(UserId,refferid, nodalid, ApprovedSessionCount, totalReferredStudents);
										}
										else {
											var str3 = data[1];
											var data1 = str3.split("mail=");
											var str5 = data1[1];
											var data5 = str5.split("NSL=");
											if (data1[1]) {
												$scope.MD5 = VerifyReferNodal.getMD5(UserId);
												$scope.MD5.$loaded().then(function() {
													if (data1[0] === $scope.MD5.$value) {
														$scope.email = Search.getStudentEmail(UserId);
														$scope.email.$loaded().then(function() {
															
															if (data5[0] == $scope.email.$value && $scope.student1IdFlag == "Done" && (typeof $scope.studentdetail.referredByNodalAdmin == 'undefined')) {
																VerifyReferNodal.getEmailVerified(UserId,refferid, nodalid, ApprovedSessionCount, totalReferredStudents); 
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
							        }
						        });
						    }					      
					    });
					});
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
});



 