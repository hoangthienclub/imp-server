(function() {
    'use strict';

    angular
        .module('app')
        .controller('Contact.IndexController', function($rootScope, Toastr, $scope, $state, $stateParams, FormService) {
            var vm = this;
            var collection = "contacts";
            vm.rows = [];
            vm.currentPage = 0;
            vm.pageNums = [];

            vm.loadPage = (i) => {
                FormService.call(collection, "getPage", {page: i, filterData: vm.ft})
                    .then(function(res) {
                        if (res && res.status == 200) {
                            vm.rows = res.data.rows;
                            vm.numRowPerPage = res.data.numRowPerPage;
                            vm.pageNums = [...Array(Math.ceil(res.data.count / vm.numRowPerPage)).keys()];
                            vm.currentPage = i;
                        } else
                            Toastr.error("Something error");
                    });
            }


            vm.filter = () => {
                vm.loadPage(0);
            }

            vm.loadPage(0);

            vm.delete = (_id) => {
                if (confirm("Detete this contact?")) {
                    FormService.delete(collection, _id)
                        .then(function() {
                            Toastr.success("Delete completed");
                            vm.loadPage(vm.currentPage);
                        })
                        .catch(function() {
                            Toastr.error("Error, try again later!");
                        })
                } else {
                    Toastr.info("Cancle")
                }
            }
        });
})();