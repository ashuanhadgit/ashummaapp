'use strict';

app.controller('AboutCtrl', function ($routeParams, $window, $route, $scope, $log, $document, $location, toaster) {
  
	$scope.$route = $route;

	$scope.setFooterElem=function(toSet){
		$('#about-top-nav').attr('data-target-scroll','#'+toSet+'-content');
		$('#about-top-nav').attr('data-elems','#about-nav:z,#sidebar-'+toSet+':c^m');
		$('#about-top-nav').attr('data-offset-elem','#sidebar-'+toSet);
		//alert('Done: '+$('#about-top-nav').attr('data-offset-elem')+' ');
		$scope.$applyAsync();
	}

	if($location.path() == '/about') {
		if($routeParams.tab) {
			$scope.tab = $routeParams.tab;
			$scope.$applyAsync();
			$scope.setFooterElem($scope.tab);
			$scope.$applyAsync();
		}
	}

	$scope.setTab = function ( tab) {
		$scope.tab = tab;
		$scope.$applyAsync();	
		$window.location.href='#/about?tab='+tab;
		// $scope.setFooterElem($scope.tab);
		// $scope.$applyAsync();
		
	};

	$scope.click_missionSec = function () {

		var winHt = $(window).height();
        $('html,body').animate({
            scrollTop: 0},
            'slow');
        $('#foundersSec').removeClass('current');
        $("#techSec").removeClass('current');
        $("#opsSec").removeClass('current');
        $('#missionSec').addClass('current');
        $scope.$evalAsync();
	};

	$scope.click_foundersSec = function () {

		var winHt = $(window).height();
        var x = $("#missionContent").height();
        x = x+(winHt*0.15);
        $('html,body').animate({
            scrollTop: x},
            'slow');
        $('#missionSec').removeClass('current');
        $("#techSec").removeClass('current');
        $("#opsSec").removeClass('current');
        $('#foundersSec').addClass('current');
        $scope.$evalAsync();
	};

	$scope.click_techSec = function () {

		var winHt = $(window).height();
        var y = $("#missionContent").height();
        var x = $("#founderContent").height();
        x = x+(winHt*0.22)+y;
        $('html,body').animate({
            scrollTop: x},
            'slow');

        $('#foundersSec').removeClass('current');
        $("#missionSec").removeClass('current');
        $("#opsSec").removeClass('current');
        $('#techSec').addClass('current');
        $scope.$evalAsync();
	};

	$scope.click_opsSec = function () {
		var winHt = $(window).height();
        var x = $("#techContent").height();
        var y = $("#missionContent").height();
        var z = $("#founderContent").height();
        x = x+y+z+(winHt*0.28);
        $('html,body').animate({
            scrollTop: x},
            'slow');

        $('#foundersSec').removeClass('current');
        $("#missionSec").removeClass('current');
        $("#techSec").removeClass('current');
        $('#opsSec').addClass('current');
        $scope.$evalAsync();
	};

	$scope.toTheTop = function() {
      $document.scrollTopAnimated(0, 1000).then(function() {
      });
  };


  }).value('duScrollOffset', 30);
