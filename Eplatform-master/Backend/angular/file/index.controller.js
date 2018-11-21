(function() {
    'use strict';
    angular
        .module('app')
        .controller('File.IndexController', function($http, $rootScope, $sce, Toastr, $scope, $state, $stateParams, FormService) {
            var vm = this;
            vm.fileBrowserUrl = $sce.trustAsResourceUrl(fileBrowserUrl);
        });
})();