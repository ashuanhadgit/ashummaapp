'use strict';

app.factory('AuthCollege', function ($firebaseAuth, FIREBASE_URL, $rootScope, $firebaseObject, $firebaseArray, Session,Auth ,$q) {
  var ref = new Firebase(FIREBASE_URL);
  var authcollege = $firebaseAuth(ref);

  var AuthCollege = {
    
    resolveUser: function() {
      var getAuth = authcollege.$getAuth();
      return getAuth;
    },
    
    signedIn: function() {
      return !!AuthCollege.userc.provider;
    },

    logout: function () {
      if(AuthCollege.userc && AuthCollege.userc.profile) {
          AuthCollege.userc.profile.$destroy();
          angular.copy({}, AuthCollege.userc);
      }

      authcollege.$unauth();
    },
    userc: {}
  };
  return AuthCollege;
});