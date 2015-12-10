'use strict';

app.factory('NodalTask', function ($firebaseAuth,  $filter, FIREBASE_URL, $rootScope, $q , $firebaseObject , $firebaseArray,Search) {
  var ref = new Firebase(FIREBASE_URL);
  var nodaltask = $firebaseAuth(ref);
  var NodalTask = {
    resolveUser: function() {
      return nodaltask.$getAuth();
    },
    
    signedIn: function() {
      return !!NodalTask.user.provider;
    },
    user: {}
  };
  return NodalTask;
});
