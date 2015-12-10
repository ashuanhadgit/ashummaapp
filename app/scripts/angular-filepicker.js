angular.module('angularFilepicker', [])
.service('angularFilepicker', function($window){
    return $window.filepicker;
})
.directive("fpInput", function(angularFilepicker){
    return {
        scope: {
        },
        transclude: true,
        restrict: "E",
        replace: true,
        require: "ngModel",
        template: "<button type='button' ng-click='pickFiles()'>{{buttonText}}</button>",
        link: function(scope, element, attrs, ngModel) {
            scope.pickFiles = pickFiles;

            var pickerOptions = {},
                storeOptions = {},
                pickFiles;

            scope.buttonText = attrs['fpButtonText'] || 'Pick file';

            angularFilepicker.setKey(attrs['fpApikey']);

            setAttrIfExists("multiple", pickerOptions, "fpMultiple");
            setAttrIfExists("mimetype", pickerOptions, "fpMimetype");
            setAttrIfExists("mimetypes", pickerOptions, "fpMimetypes");
            setAttrIfExists("service", pickerOptions, "fpService");
            setAttrIfExists("services", pickerOptions, "fpServices");
            setAttrIfExists("extension", pickerOptions, "fpExtension");
            setAttrIfExists("extensions", pickerOptions, "fpExtensions");
            setAttrIfExists("container", pickerOptions, "fpContainer");
            setAttrIfExists("maxSize", pickerOptions, "fpMaxSize");
            setAttrIfExists("maxFiles", pickerOptions, "fpMaxFiles");
            setAttrIfExists("openTo", pickerOptions, "fpOpenTo");
            setAttrIfExists("debug", pickerOptions, "fpDebug");
            setAttrIfExists("signature", pickerOptions, "fpSignature");
            setAttrIfExists("policy", pickerOptions, "fpPolicy");
            setAttrIfExists("storeLocation", storeOptions, "fpStoreLocation");
            setAttrIfExists("storePath", storeOptions, "fpStorePath");
            setAttrIfExists("storeContainer", storeOptions, "fpStoreContainer");
            setAttrIfExists("storeAccess", storeOptions, "fpStoreAccess");
            setAttrIfExists("language", pickerOptions, "fpLanguage");


            if (pickerOptions.services) {
                var services = pickerOptions.services.split(",");
                for (var j=0; j<services.length; j++) {
                    services[j] = services[j].replace(" ","");
                }
                pickerOptions['services'] = services;
            }
            if (pickerOptions.service) {
                pickerOptions['service'] = pickerOptions['service'].replace(" ","");
            }

            if (pickerOptions['mimetypes']) {
                pickerOptions['mimetypes'] = pickerOptions['mimetypes'].split(",");
            }
            if (pickerOptions['extensions']) {
                pickerOptions['extensions'] = pickerOptions['extensions'].split(",");
            }

            function setAttrIfExists(key, options, attrname) {
                var val = attrs[attrname];
                if (val) {
                    options[key] = val;
                }
            }
            function successCallback(response){
                ngModel.$setViewValue(response);
                scope.$apply();
            }

            function errorCallback(error){
                // TODO
            }

            ngModel.$viewChangeListeners.push(function() {
                scope.$eval(attrs.ngChange);
            });
            
            if (storeOptions.storeLocation === undefined && pickerOptions.multiple !== "true") {
                pickFiles = function(){
                    angularFilepicker.pick(
                        pickerOptions,
                        successCallback,
                        errorCallback
                    );
                };
            } else if (storeOptions.storeLocation === undefined && pickerOptions.multiple === "true") {
                pickFiles = function(){
                    angularFilepicker.pickMultiple(
                        pickerOptions,
                        successCallback,
                        errorCallback
                    );
                };
            } else {
                pickFiles = function(){
                    angularFilepicker.pickAndStore(
                        pickerOptions,
                        storeOptions,
                        successCallback,
                        errorCallback
                    );
                };
            }
            scope.pickFiles = pickFiles;

        }
    };
});