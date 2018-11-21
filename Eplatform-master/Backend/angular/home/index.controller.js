(function() {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', function($q, $rootScope, $location, $http, $scope, $state, $stateParams, Toastr, FormService, LocalStorageService) {
            var vm = this;
            vm.countData = {};

            FormService.report("ep_companies", {})
                .then(function (res) {
                    vm.labels = res.data.map(function (e) { return e.name; });
                    vm.data = res.data.map(function (e) { return e.total; });
                })
                .catch(function (err) {
                    console.log(err);
                })

            
            var promises = [];
            vm.collections = [{
                collection:"ep_companies",
                label: "Companies",
                fontAwesome: "fa-info"
            }, {
                collection:"ep_companyProducts",
                label: "Company Products",
                fontAwesome: "fa-product-hunt"
            }, {
                collection:"ep_industrialParks",
                label: "Industrial Parks",
                fontAwesome: "fa-industry"
            }, {
                collection:"ep_provinceCities",
                label: "Province Cities",
                fontAwesome: "fa-building-o"
            }];
            for (var e of vm.collections) {
                promises.push(FormService.count(e.collection, {}))
            }

            $q.all(promises)
                .then(function (arr) {
                    for (var e in vm.collections) {
                        vm.countData[vm.collections[e].collection] = arr[e].data.total;
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
            
            vm.options = { legend: { display: false } };
        });
})();