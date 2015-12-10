'use strict';

app.factory('AuthSchool', function ($firebaseAuth, $location, FIREBASE_URL, $rootScope,  $firebaseObject , $firebaseArray , $q) {
  var ref = new Firebase(FIREBASE_URL);
  var authschool = $firebaseAuth(ref);

  var AuthSchool = {

    resolveUser: function() {
      return authschool.$getAuth();
    },
    
    signedIn: function() {
      return !!AuthSchool.users.provider;
    },
    logout: function () {
      authschool.$unauth();
      if(AuthSchool.users && AuthSchool.users.profile) {
        AuthSchool.users.profile.$destroy();
      }
      angular.copy({}, AuthSchool.users);
    },
    users: {}
  };
  return AuthSchool;
});

