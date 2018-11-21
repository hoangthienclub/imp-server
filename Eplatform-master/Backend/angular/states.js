(function () {
    'use strict';
    angular
        .module('app')
        .config(($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) => {

            $stateProvider
                .state("index.menuorders", {
                    url: "/menu-order/:_id",
                    templateUrl: '/angular/menu/order.html',
                    controller: "Menu.OrderController",
                    controllerAs: "vm",
                    ncyBreadcrumb: {
                        label: 'Menu Order',
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    '/angular/menu/order.controller.js'
                                ]
                            });
                        }]
                    }
                })
                .state("index.companyOptionConfig", {
                    url: "/companyOptions/config/:_id",
                    templateUrl: function (stateParams) {
                        return '/api/form/companyOptions/call/getInputConfig/' + stateParams._id;
                    },
                    controller: "CompanyOption.ConfigController",
                    controllerAs: "vm",
                    ncyBreadcrumb: {
                        label: 'Input Config',
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    '/angular/company/option/config.controller.js'
                                ]
                            });
                        }]
                    }
                })
                .state("index.companyOptionLayout", {
                    url: "/companyOptions/layout/:_id",
                    templateUrl: function (stateParams) {
                        return '/api/form/companyOptions/call/getInputLayout/' + stateParams._id;
                    },
                    controller: "CompanyOption.LayoutController",
                    controllerAs: "vm",
                    ncyBreadcrumb: {
                        label: 'Input Layout',
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    '/angular/company/option/layout.controller.js'
                                ]
                            });
                        }]
                    }
                })
                .state("index.siteDocumentLayout", {
                    statisticsPage: "index.siteDocuments",
                    url: "/siteDocument/view/:_id",
                    templateUrl: function (stateParams) {
                        return '/api/form/siteDocuments/call/getDocumentLayout/' + stateParams._id;
                    },
                    controller: "Menu.OrderController",
                    controllerAs: "vm",
                    ncyBreadcrumb: {
                        label: 'Menu Order',
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    '/angular/menu/order.controller.js'
                                ]
                            });
                        }]
                    }
                })
                // Insert state here
                ;
        })
})();