'use strict';
 
app.factory('Verify',function (FIREBASE_URL, $rootScope , $firebaseObject, $firebaseArray) {
	var Verify = {

		getMD5 : function (userId) {
			var studentMd5ref = new Firebase(FIREBASE_URL + 'profileForStudents/' + userId + '/md5_hash');
			return $firebaseObject(studentMd5ref);
		},

		getEmailVerified : function (UserId) {
			var emailStatusRef = new Firebase(FIREBASE_URL + 'profileForStudents/' + UserId );
			var emailVerificationStatus = (emailStatusRef);
			emailVerificationStatus.update({ emailverificationstatus: "true" });
		} 
	}
	return Verify;
});
