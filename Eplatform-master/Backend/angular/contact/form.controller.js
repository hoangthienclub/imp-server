(function() {
    'use strict';

    angular
        .module('app')
        .controller('Contact.FormController', function($rootScope, $http, Toastr, $scope, $state, $stateParams, FormService) {
            var vm = this;
            var collection = "contacts";
            var customerCollection = "customers";
            vm.edit = false;
            vm.contactData = {};
            vm.customers = [];
            vm.properties = [];

            FormService.lookup(customerCollection)
                .then(function(res) {
                    vm.customers = res.data;
                })
                .catch(function(err) {
                    console.log(err);
                });

            if ($stateParams._id) {
                vm.edit = true;
                FormService.getById(collection, $stateParams._id)
                    .then(function(res) {
                        if (res && res.status == 200) {
                            vm.contactData = res.data;
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    });

                vm.Save = () => {
                    FormService.update(collection, vm.contactData._id, vm.contactData)
                        .then(function(data) {
                            Toastr.success("Update completed!")
                        })
                        .catch(function(err) {
                            Toastr.error(err);
                        });
                }
            } else {
                vm.Save = () => {
                    console.log(vm.contactData);
                    FormService.save(collection, vm.contactData)
                        .then(function(data) {
                            Toastr.success("Add new completed!");
                            $state.go("index.contacts");
                        })
                        .catch(function(err) {
                            Toastr.error(err);
                        })
                }
            }
        });
})();