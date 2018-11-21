(function() {
    'use strict';

    angular
        .module('app')
        .controller('Partner.FormController', function($rootScope, $http, Toastr, $scope, $state, $stateParams, FormService) {
            var vm = this;
            var collection = "partners";
            vm.edit = true;
            vm.partnerData = {};
            vm.companies = [];
            vm.addModal = {};

            vm.initSelection = (element, callback) => {
                callback([]);
            }
            
            vm.refreshLookup =  (lookupCollection) => {
                FormService.lookup(lookupCollection)
                    .then(function (res) {
                        vm[lookupCollection] = res.data;
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            }
            
            vm.companiesQuery = (query) => {
                FormService.lookup("companies", { name: query.term })
                    .then(function (res) {
                        let arr = res.data.map((e) => {
                            return {
                                text: e.name,
                                id: e._id
                            }
                        })
                        query.callback({results: arr});
                    })
                    .catch(function (err) {
                        query.callback({results: []});
                    })
            }    

            vm.refreshLookup("companies");            

            vm.addElementToLookupTable = function (lookupCollection) {
                vm.addModal.url = $state.href("index." + lookupCollection, {}, {absolute: true}) + "?layout=empty";
                vm.addModal.active = true;
                angular.element("#addModal").modal("show")
            }

            FormService.getOne(collection)
                .then(function (res) {
                    if (res.status == 200) {
                        if (res.data._id) {
                            vm.edit = true;
                            vm.partnerData = res.data;
                        }
                    }
                
                    if (vm.partnerData._id) {
                        vm.Save = () => {
                            FormService.update(collection, vm.partnerData._id, vm.partnerData)
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
                            FormService.call(collection, "save", vm.partnerData)
                                .then(function(data) {
                                    Toastr.success("Add new completed!");
                                    $state.go("index.partners");
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