'use strict';
app.controller('ContactCtrl', function ($window,$document, $route, $scope, $http,toaster) {
  
  
	$scope.toTheTop = function() {
      $document.scrollTopAnimated(0, 2000).then(function() {
      });
  };


  $scope.sendContactMessage = function() {
  	$scope.sendMessageSuccessfull = '';
  	var dataToPost = {
                                to: "angad@anhadedutrain.com", 
                                cc: "support@mymissionadmission.com",
                                name: $scope.contact.name, 
                                email: $scope.contact.email,
                                number: $scope.contact.number,
                                message: $scope.contact.message
                            };
                $http({
                url: "/sendcontactusemail", 
                method: "GET",
                params: {       
                				to: dataToPost.to,
                				cc: dataToPost.cc,
                                name: dataToPost.name, 
                                email: dataToPost.email,
                                number: dataToPost.number,
                                message: dataToPost.message
                        }
                }).success(function(serverResponse) {
                	$scope.contact.name=null;
                	$scope.contact.email=null;
                	$scope.contact.number=null;
                	$scope.contact.message=null;
                	$scope.sendMessageSuccessfull = 'Done';
                    console.log(serverResponse);
                }).error(function(serverResponse) {
                	$scope.sendMessageSuccessfull = 'Not Done';
                    console.log(serverResponse);
                });

                
  };

  }).value('duScrollOffset', 30);
