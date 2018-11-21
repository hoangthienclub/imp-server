(function() {
    'use strict';

    angular
        .module('app')
        .controller('Setting.FormController', function($rootScope, $http, Toastr, $scope, $state, $stateParams, FormService) {
            var vm = this;
            var collection = "settings";
            vm.edit = true;
            vm.settingData = {};
            

            FormService.getOne(collection)
                .then(function (res) {
                    if (res.status == 200) {
                        if (res.data._id) {
                            vm.edit = true;
                            vm.settingData = res.data;
                        }
                    }
                
                    if (vm.settingData._id) {
                        vm.Save = () => {
                            FormService.update(collection, vm.settingData._id, vm.settingData)
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
                            FormService.save(collection, vm.settingData)
                                .then(function(data) {
                                    Toastr.success("Add new completed!");
                                    $state.go("index.settings");
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