(function() {
    'use strict';

    angular
        .module('app')
        .controller('Navbar', function ($timeout, UserService, FormService, SiteData) {
            var vm = this;
            vm.currentUser = {};
            vm.fileBrowserUrl = fileBrowserUrl;
            UserService.GetCurrent()
                .then(function (data) {
                    if (data && data.status == 200)
                        vm.currentUser = data.data;
                })
                .catch(function(err) {
                    console.log(err);
                })

            FormService.getOne("ep_settings")
                .then(function (res) {
                    if (res.status == 200) {
                        if (res.data._id) {
                            vm.siteData = res.data;
                        }
                    }
                })
                .catch(function (err) {

                })
            
        })
})();