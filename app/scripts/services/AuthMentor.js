'use strict';

app.factory('AuthMentor', function ($firebaseAuth, $location, FIREBASE_URL, $rootScope,  $firebaseObject , $firebaseArray , $q) {
  var ref = new Firebase(FIREBASE_URL);
  var authmentor = $firebaseAuth(ref);

  var AuthMentor = {
    
    resolveUser: function() {
      return authmentor.$getAuth();
    },
    
    signedIn: function() {
      return !!AuthMentor.userd.provider;
    },

    logout: function () {
      authmentor.$unauth();
      if(AuthMentor.userd && AuthMentor.userd.profile) {
        AuthMentor.userd.profile.$destroy();
      }
      angular.copy({}, AuthMentor.userd);
    },

    /*----------------------------------- AuthMentor as MentorTask Service --------------------------------------- */  

    getMentorDetails: function($scope) {
     return $firebaseObject(new Firebase(FIREBASE_URL + "/profileForMentors/" + AuthMentor.resolveUser().uid ));
    },

    userd: {}
  };
  return AuthMentor;
});

