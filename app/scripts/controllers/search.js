'use strict';

app.controller('SearchCtrl', function ($scope, dropdownFactory, $log, $document, $location, $window, $firebase, $firebaseArray, $firebaseObject, Angularytics, FIREBASE_URL, Auth, Search) {
    
    $scope.signedIn = Auth.signedIn;
    $scope.loginErrorModal = false;



    /*++++++++++++++++++++++++++++++++google Event Tracking+++++++++++++++++++++++++++++*/

    $scope.trackEvent = function(catagory,action,label) {
        Angularytics.trackEvent(catagory, action, label);
    };

    /*++++++++++++++++++++++++++++++++google Event Tracking+++++++++++++++++++++++++++++*/




    var ref = new Firebase(FIREBASE_URL + 'profileForCollege' + '/');

    var tempToggle = true;
    $scope.searchToggle = function() {
    	var a = document.getElementById("searchToggleBtn");
    	if(tempToggle) {
    		tempToggle = false;
    		$scope.colltype = "paid";
    		$scope.$evalAsync();
    		a.style.marginLeft = "35px";
    	}
    	else if(!tempToggle){
    		tempToggle = true;
    		$scope.colltype = "college";
    		$scope.$evalAsync();
    		a.style.marginLeft = null;
    	}
	}
	$scope.user = Auth.user;
	$scope.colleges = Search.all;
	$scope.collegetype = Search.allAsArray;
	$scope.colltype = "college";
	$scope.showHeading = false;
	$scope.courseAlreadySelected = false;
	$scope.waitShow = false;
	$scope.backSeachColleges=[];
	$scope.stateCollegeShow = false;
	$scope.currentState = '';
	$scope.stateNotSelected = false;
	$scope.allCollege=false;
    $scope.hideSearch = "";


	$scope.currentCourse = '';
	var tempState = '';
	var stateValue = '';
	$scope.dropdownMessage = 'Retrieving Locations...';
	$scope.states = Search.getAllStateDropdownObjects();


	$scope.states.$loaded().then(function(data) {
		$scope.stateToView=null;
  		$scope.dropdownMessage = 'Where do you want to study?';
	  	var stateValue = dropdownFactory.getStateValue();
	  	dropdownFactory.resetStateValue();
	  	if(stateValue)
	     {          stateValue.$loaded(function(stateValue){
	               	$scope.dropdownMessage = stateValue.$value;	
	           }).then(function(){
                    $scope.stateToView = stateValue.$id;
                 	if($scope.stateToView !== null)
                    $scope.searchCollegeByState();
                  });
	        $scope.stateCollegeShow = false;
	        $scope.collegeNotFound = false;  
		 }
		 else
		 	$scope.stateToView = null;
	});
	
 
///////////////////////////////////////////////////////////////// make forge for searching colleges
  	 $scope.selectCollegeByStateId = function()	{
  	 	Search.getCollegesList($scope.stateToView,$scope.courseToView).then(function (collegeList){
  		})
  	};
	$scope.selectCollegeByCouseId = function()	{
  	 	Search.getCourseCollegesList($scope.courseToView).then(function (collegeList){
  		})
  	};

   $scope.sendStateToView = function() {
   	   Search.setStateToView(stateValue.$value);

   };
   $scope.sendCourseToView = function() {
   			Search.setStateToView($scope.dropdownMessageCourses);
   };
////////////////////////////////////////////////////////////////////////////////	

 	$scope.initializeStateToView = function(stateToView) {
		$scope.stateToView = stateToView;
	};

	$scope.initializeCourseToView = function(courseToView) {
			$scope.courseToView = courseToView;
	};

	$scope.updateSubfilter = function(subfilter) {
		$scope.subfilter = subfilter;
		$scope.$evalAsync();
	};


	$scope.searchCollegeByState = function(){
			if($scope.stateToView === null )
			{

				if($scope.courseToView==null)
				{ 
					$scope.searchColleges=[];
					$scope.searchColleges	= ($firebaseArray(new Firebase(FIREBASE_URL+'profileForCollege' + '/')));
					$scope.currentCourse='';
					$scope.currentState='';
					$scope.allCollege=true;
				}
				else
				{
				$scope.searchCollegeByCourse();
				$scope.currentState='';
				$scope.stateNotSelected = true;
				$scope.allCollege=false;
			    }

			}
			else
			{
				$scope.allCollege=false;
				$scope.stateNotSelected = false;
				Search.getCollegeByState($scope.stateToView).then(function(collegeList){
					$scope.searchColleges = collegeList;
					$scope.currentState = $scope.searchColleges[0].collegestate;
					$scope.trackEvent('Search Page Dropdowns','Searched College By State '+$scope.currentState,'Statewise College Search');
					tempState = $scope.searchColleges[0].collegestate;
					$scope.CollegeShow = true;
					$scope.collegeNotFound = false;
					$scope.backSeachColleges = $scope.searchColleges;
					$scope.dropdownMessage = 'Where do you want to study?';
					if($scope.currentCourse!='' || $scope.courseAlreadySelected === true && $scope.courseToView!==null)
						{	
							$scope.courseAlreadySelected = false;
							$scope.searchCollegeByCourse();
						}
						else
							$scope.dropdownMessageCourses='What do you want to study?';
				})
			}
		};

	$scope.searchCollegeByCourse = function(){
		if ($scope.courseToView == null)
			{
				if($scope.stateToView==null)
				{ 
					$scope.searchColleges=[];
					$scope.searchColleges	= ($firebaseArray(new Firebase(FIREBASE_URL+'profileForCollege' + '/')));
					$scope.currentCourse='';
					$scope.currentState='';
					$scope.allCollege=true;
				}
				else
				{
				$scope.searchCollegeByState();
				$scope.currentCourse='';
				$scope.allCollege=false;
			   }
			}
		else
		{
			$scope.allCollege=false;
		$scope.collegeNotFound = false;
		$scope.CollegeShow = true;
		$scope.tempCollegeList = [];
		$scope.currentCourse = '';
		if(typeof $scope.searchColleges!=='undefined' && $scope.stateNotSelected == false)
			$scope.searchColleges = $scope.backSeachColleges;
			$scope.dropdownMessageCourses='What do you want to study?';
		var courseName = ($firebaseObject(new Firebase(FIREBASE_URL+"courseList/courses/" + $scope.courseToView )));
            courseName.$loaded(function(courseName){
            	var courseInCollege = ($firebaseArray(new Firebase(FIREBASE_URL+"CourseCollegeSearch/" + courseName.$value +'/')));
                  courseInCollege.$loaded(function(courseInCollege){
                  	$scope.currentCourse = courseName.$value;
					$scope.trackEvent('Search Page Dropdowns','Searched College By Course '+$scope.currentCourse,'Coursewise College Search');
                  	if(courseInCollege.length !== 0)
                  	{
                  			if(($scope.stateNotSelected == true) || (typeof $scope.searchColleges === 'undefined') || ($scope.stateToView==null)|| ($scope.courseToView==null))
                  			 {
                  				for(var i=0;i<courseInCollege.length;i++)
                  				{
                  					var collegeref = $firebaseObject(ref.child(courseInCollege[i].$id));
                  					collegeref.$loaded(function(collegeref) {
                         			$scope.tempCollegeList.push(collegeref);
                 				 	}).then(function(){
                 				 		$scope.courseAlreadySelected = true;
                 				 		$scope.collegeNotFound = false;
                    					 $scope.backSeachColleges = $scope.tempCollegeList;
                    					 $scope.searchColleges = $scope.tempCollegeList;
                 				 	});
                				}
                  			  }
                		 	else
                 			{
                 				var courseLenght = courseInCollege.length;
                 				var allCollegeLenght = $scope.searchColleges.length;
        						for(var i=0; i < courseLenght; i++)
 							 	{
 							 		for(var j=0; j < allCollegeLenght; j++)
 							 		{
 							 			if(courseInCollege[i].$id === $scope.searchColleges[j].$id)
 							 			{
 								   			if($scope.searchColleges[j].collegestate == tempState && $scope.searchColleges[j].verifiedcollege === 'verified')
 								   			$scope.tempCollegeList.push($scope.searchColleges[j]);
 										}
 									
 									
 									}
 								 }
 						 	} 
 					} 
                  }).then(function(){
                  	if((courseInCollege.length === 0 ) || ($scope.tempCollegeList.length=== 0) && (typeof $scope.searchColleges !== 'undefined') )
                  	{
                  		$scope.collegeNotFound = true;
 				 	   $scope.CollegeShow = false;
 				 	   $scope.searchColleges=[];
                  	}
                    if($scope.tempCollegeList.length!== 0)
                    {
                    	$scope.searchColleges=[];
                     $scope.searchColleges = $scope.tempCollegeList;
                     $scope.collegeNotFound = false;
                 	$scope.dropdownMessageCourses='What do you want to study?';}
                  });
              })
			}
				
     };

     $scope.searchAllColleges = function(){
     	if((typeof $scope.stateToView === 'undefined') && (typeof $scope.courseToView === 'undefined'))
     	{
     		$scope.searchColleges	= ($firebaseArray(new Firebase(FIREBASE_URL+'profileForCollege' + '/')));
     		$scope.allCollege=true;
     	}

     };
	$scope.copyStateToView = function(stateName) {
		if($scope.dropdownMessage!=='Where do you want to study?')
		{
			Search.getStateIdByName(stateName).then(function(stateId) {
				$scope.stateToView = stateId;
			if(iteration2[0]!=="")
			$scope.stateSelected();

			})
		}
		$scope.waitShow = false;
	};

	$scope.copyCourseToView = function(courseName) {
		if($scope.dropdownMessageCourses!=='What do you want to study?')
		{
		Search.getCourseIdByName(courseName).then(function(courseId) {
			$scope.courseToView = courseId;
			 if(iteration2[1]!=="")
			 $scope.courseSelected();	
			});
		}
		$scope.waitShow = false;

	};

	$scope.dropdownMessageCourses = 'Retrieving Courses...';
	$scope.courses = Search.getAllCourseDropdownObjects();

	$scope.courseSelected = function() {
	    $scope.course = Search.getCourseDropdownObject($scope.courseToView);
	    $scope.waitShow = true;
	    $scope.dropdownMessageCourses!=='What do you want to study?';
  	};

   	$scope.courses.$loaded().then(function(data) {
   		    $scope.courseToView = null;
   		   	$scope.dropdownMessageCourses = 'What do you want to study?';
	  		var courseValue = dropdownFactory.getCourseValue();
	  		dropdownFactory.resetCourseValue();
	               if(courseValue)
	               {
	               courseValue.$loaded(function(courseValue){
	               	$scope.dropdownMessageCourses = courseValue.$value;
	           }).then(function(){
	           		$scope.courseToView = courseValue.$id;
	           		$scope.collegeNotFound = false;
	           		if($scope.courseToView !== null)
                    $scope.searchCollegeByCourse();
                  });
	       }
	  
	 });



	$scope.toTheTop = function() {
      $document.scrollTopAnimated(0, 2000).then(function() {
      });
    };


////////////////////////////////////NIKHIL////////////////////////////////////////////
	$scope.loginError = function(name, affiliation, state, image){
		$scope.collegeName = name;
		$scope.collegeAff = affiliation;
		$scope.collegeState = state;
		$scope.collegeImage = image;
		$scope.loginErrorModal = true;
		$scope.$applyAsync();
	};

	$scope.close = function(){
		$scope.loginErrorModal = false;
		$scope.$applyAsync();
	};

	$scope.storeview = function(collegeId){
     	Search.storeview(collegeId);
    };


}).value('duScrollOffset', 30);
