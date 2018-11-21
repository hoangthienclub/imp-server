(function() {
    'use strict';

    angular
        .module('app')
        .controller('Term.FormController', function($rootScope, $http, Toastr, $scope, $state, $stateParams, FormService) {
            var vm = this;
            var collection = "terms";
            vm.edit = true;
            vm.termData = {};
            

            FormService.getOne(collection)
                .then(function (res) {
                    if (res.status == 200) {
                        if (res.data._id) {
                            vm.edit = true;
                            vm.termData = res.data;
                        }
                    }
                
                    if (vm.termData._id) {
                        vm.Save = () => {
                            FormService.update(collection, vm.termData._id, vm.termData)
                                .then(function(data) {
                                    Toastr.success("Update completed!")
                                })
                                .catch(function(err) {
                                    Toastr.error(err);
                                })
                        }
                    } else {
                        vm.edit = false;
                        vm.Save = () => {
                            FormService.call(collection, "save", vm.termData)
                                .then(function(data) {
                                    Toastr.success("Add new completed!");
                                    $state.go("index.terms");
                                })
                                .catch(function(err) {
                                    Toastr.error(err);
                                })
                        }
                    }
                })
                .catch(function (err) {

                })
        });
})();