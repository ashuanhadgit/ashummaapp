'use strict';

app.factory('AdminAuth', function ($firebaseAuth, FIREBASE_URL, $rootScope, $firebaseObject, $firebaseArray,$q) {
  var ref = new Firebase(FIREBASE_URL);
  var adminauth = $firebaseAuth(ref);

  var AdminAuth = {


    logout: function () {
      if(AdminAuth.usera && AdminAuth.usera.profile) {
          AdminAuth.usera.profile.$destroy();
      }
      angular.copy({}, AdminAuth.usera);
      adminauth.$unauth();
    },

    resolveUser: function() {
      var getAuth = adminauth.$getAuth();
      return getAuth;
    },

    signedIn: function() {
      return !!AdminAuth.usera.provider;
    },
    usera: {}
  };
 
  return AdminAuth;
});