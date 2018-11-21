(function() {
    'use strict';

    angular
        .module('app')
        .controller('SiteDocument.ViewController', function($rootScope, $http, Toastr, $scope, $state, $stateParams, FormService) {
            var vm = this;
            var collection = "siteDocuments";
            vm.edit = false;
            vm.siteDocumentData = {};
            vm.productCodes = [];
            
            if ($stateParams._id) {
                vm.edit = true;
                FormService.getById(collection, $stateParams._id)
                    .then(function(res) {
                        if (res && res.status == 200) {
                            vm.siteDocumentData = res.data;
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    });

                vm.Save = () => {
                    FormService.update(collection, vm.siteDocumentData._id, vm.siteDocumentData)
                        .then(function(data) {
                            console.log(data);
                            Toastr.success("Update completed!")
                        })
                        .catch(function(err) {
                            Toastr.error(err);
                        })
                }
            } else {
                vm.Save = () => {
                    FormService.save(collection, vm.siteDocumentData)
                        .then(function(data) {
                            Toastr.success("Add new completed!");
                            $state.go("index." + collection);
                        })
                        .catch(function(err) {
                            Toastr.error(err);
                        })
                }
            }
        });
})();