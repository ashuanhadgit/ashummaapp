'use strict';
 
app.factory('VerifyReferNodal',function (FIREBASE_URL, $rootScope ,$firebaseObject , $firebaseArray) {
	var VerifyReferNodal = {

		getMD5 : function (userId) {
			var studentMd5ref = new Firebase(FIREBASE_URL + 'profileForStudents/' + userId + '/md5_hash');
			return $firebaseObject(studentMd5ref);
		},

		getEmailVerified : function (UserId, refferedId,nodalid, ApprovedSessionCount, totalReferredStudents) {
			var emailStatusRef = new Firebase(FIREBASE_URL + 'profileForStudents/' + UserId );
			var emailVerificationStatus = (emailStatusRef);
			emailVerificationStatus.update({ emailverificationstatus: "true" });
			emailVerificationStatus.update({ referredByNodalAdmin: refferedId });
			VerifyReferNodal.saveDataInNodal(nodalid, UserId, ApprovedSessionCount, totalReferredStudents);

		},
		saveDataInNodal : function (nodalid, UserId, ApprovedSessionCount, totalReferredStudents) {
			var nodalref = new Firebase(FIREBASE_URL + 'profileForNodalAdmins/'  + nodalid + '/studentsRegistered/' + UserId  );
			var  nodalrefobj = (nodalref);
			nodalrefobj.update({ numberOfSessionsTillDate: ApprovedSessionCount, allreadyRefferdStudent: totalReferredStudents});
		} 
	}
	return VerifyReferNodal;
});
