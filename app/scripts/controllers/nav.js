'use strict';

app.controller('NavCtrl', function ($scope, $location, $rootScope, $routeParams, $route, Auth) {

  $scope.signedIn = Auth.signedIn;
	$scope.logout = Auth.logout;
	$scope.user = Auth.user;
  //$scope.userd = AuthMentor.userd;
  $scope.loc = $location.path();
  $scope.$evalAsync();
  
  $scope.$on('$routeChangeSuccess', function(next, current) { 
    $scope.loc = $location.path();
    $scope.$evalAsync();
  });
	
  $scope.regpage = function() {
		if($location.path() == '/college')
			return true;
	};

  $scope.go = function ( path ) {
		$location.path( path );
	};
});
