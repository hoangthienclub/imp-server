(function() {
    'use strict';

    angular
        .module('app', [
            'angular-loading-bar',
            'oc.lazyLoad',
            'ncy-angular-breadcrumb',
            'ui.router',
            'toastr',
            'ui.utils.masks',
            'ckeditor',
            'google.places',
            'ui.select2',
            'ui.utils.masks',
            '720kb.tooltips',
            'ng-nestable',
            'ngTagsInput',
            'chart.js'
        ])
        .factory("SiteData", function () {
            this.data = {
                isDevelopment: false
            };
            return this.data;
        })
        .filter('bytes', function() {
            return function(bytes, precision) {
                if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
                if (typeof precision === 'undefined') precision = 1;
                var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                    number = Math.floor(Math.log(bytes) / Math.log(1024));
                return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
            }
        })
        .filter('stateLabel', function() {
            return function(name, index, last) {
                if (index == 0 || (index > 1 && last))
                    return name;
                return name.split(/(?=[A-Z])/).join(" ");
            }
        })
        .filter('unsafe', function($sce) { 
            return $sce.trustAsHtml; 
        })
        .filter('trusted', ['$sce', function ($sce) {
            return $sce.trustAsResourceUrl;
        }])
        .directive('selectFile', function ($timeout) {
            return {
                scope: {
                    multiple: "@"
                },
                require: "ngModel",
                restrict: 'A',
                link: function(scope, elem, attrs, ctrl){
                    $(elem).on('click', function(e) {
                        var multiple = scope.multiple == "true";
                        window.fileSelected = function (data) {
                            scope.$apply(function(){
                                if (Array.isArray(data)) {
                                    if (multiple) {
                                        ctrl.$setViewValue(data);
                                    } else {
                                        ctrl.$setViewValue(data[0]);
                                    }
                                } else {
                                    ctrl.$setValidity('required', false);
                                }
                            });
                        }
                        window.open('/app#/file/browser', "Select", "center:1;status:1;menubar:0;toolbar:0;dialogWidth:875px;dialogHeight:650px");
                    });
                }
            };
        })
        .directive('updateFeature', function ($timeout) {
            return {
                scope: {
                    multiple: "@"
                },
                require: "ngModel",
                restrict: 'A',
                link: function(scope, elem, attrs, ctrl){
                    $(elem).on('click', function(e) {
                        window.fileSelected = function (data) {
                            scope.$apply(function(){
                                if (Array.isArray(data)) {
                                    ctrl.$setViewValue(data[0]);
                                }
                            });
                        }
                        window.open('/app#/file/browser', "Select", "center:1;status:1;menubar:0;toolbar:0;dialogWidth:875px;dialogHeight:650px");
                    });
                }
            };
        })
        .directive('dateInput', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, ngModelController) {

                    ngModelController.$formatters.push(function(data) {
                        if (!data) {
                            return null;
                        }
                        var d = new Date(data);
                        return d;
                    });
                }
            }
        })
        .directive('timeInput', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, ngModelController) {

                    ngModelController.$formatters.push(function(data) {
                        if (!data) {
                            return null;
                        }
                        var d = new Date(data);
                        return d;
                    });
                }
            }
        })
        .directive('icheck', ['$timeout', '$parse', function($timeout, $parse) {
            return {
                require: 'ngModel',
                link: function($scope, element, $attrs, ngModel) {
                    return $timeout(function() {
                        var value;
                        value = $attrs['value'];

                        $scope.$watch($attrs['ngModel'], function(newValue) {
                            $(element).iCheck('update');
                        });

                        $scope.$watch($attrs['ngDisabled'], function(newValue) {
                            $(element).iCheck(newValue ? 'disable' : 'enable');
                            $(element).iCheck('update');
                        })

                        return $(element).iCheck({
                            checkboxClass: 'icheckbox_square-green',
                            radioClass: 'iradio_square-green'

                        }).on('ifChanged', function(event) {
                            if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                                $scope.$apply(function() {
                                    return ngModel.$setViewValue(event.target.checked);
                                })
                            }
                        }).on('ifClicked', function(event) {
                            if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                                return $scope.$apply(function() {
                                    //set up for radio buttons to be de-selectable
                                    if (ngModel.$viewValue != value)
                                        return ngModel.$setViewValue(value);
                                    else
                                        ngModel.$setViewValue(null);
                                    ngModel.$render();
                                    return
                                });
                            }
                        });
                    });
                }
            }
        }])
        .directive('myFile', function() {
            return {
                template: `
                <div class="row">
                    <div class="col-sm-8 cut-text">
                        <a ng-if="!isImage(file.url)" ng-href="{{ file.url }}" download="{{ file.name }}" target="_blank"> &nbsp;&nbsp; {{ file.url }}</a>
                        <img ng-if="isImage(file.url)" ng-src="{{ file.url }}" style="max-height: 100px">
                    </div>
                    <div class="col-sm-4">
                        <a class="btn btn-info pull-right" ng-href="{{ file.url }}" download="{{ file.name }}" target="_blank"><i class="fa fa-download"></i></a>
                        <a class="btn btn-info pull-right href="#" ng-click="show=!show"><i class="fa fa-edit"></i></a>
                    </div>
                    <div class="col-sm-12" ng-show="show">
                        <div class="form-group row">
                            <div class="col-sm-2 label-right">
                                <label for="form-form-control-label control-label">Link</label>
                            </div>
                            <div class="col-sm-8">
                                <input class="form-control" ng-model="file.url"/>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-sm-2 label-right">
                                <label for="form-form-control-label control-label">File Name</label>
                            </div>
                            <div class="col-sm-8">
                                <input class="form-control" ng-model="file.name"/>
                            </div>
                        </div>
                    </div>
                </div>
                `,
                controller: function ($scope) {
                    $scope.isImage = function (url) {
                        if (!url)
                            return false;
                        return(url.toLowerCase().match(/\.(jpeg|jpg|gif|png)/) != null);
                    }
                    $scope.fileBrowserUrl = fileBrowserUrl;
                },
                scope: {
                    file: "="
                }
            }
        })
        .directive('myMap', function() {
            return {
                template: function () {
                    return `
                    <input type="text" class="map-controls" id="{{ myId }}Input"/>
                    <div id="{{ myId }}" style="width: 100%; height: 300px; background-color: red; margin-bottom: 10px">
                    </div>
                    <div class="col-sm-12">
                        <div class="row even" style="min-height: 57px">
                            <div class="col-sm-2 label-right">
                                <label class="form-form-control-label control-label" for="countryId"> Country (<span class="required">*</span>)</label>
                            </div>
                            <div class="col-sm-10">
                                <div class="row" style=" margin: 0; ">
                                    <div class="col-sm-4">
                                        <select class="form-control" ui-select2 ng-model="ngData.countryId" ng-change="countryIdChange()" name="countryId" id="countryId" ng-required="true" data-placeholder="Select country">
                                            <option value=""></option>
                                            <option ng-repeat="(idx, elem) in countries" value="{{ elem._id }}" ng-bind-html="elem.name | unsafe"></option>
                                        </select>
                                    </div>
                                    <div class="col-sm-4" ng-if="ngData.countryId">
                                        <select class="form-control" ui-select2 ng-model="$parent.ngData.provinceId" ng-change="provinceIdChange()" name="provinceId" id="provinceId" ng-required="true" data-placeholder="Select province">
                                            <option value=""></option>
                                            <option ng-repeat="(idx, elem) in provinces" value="{{ elem._id }}" ng-bind-html="elem.name | unsafe"></option>
                                        </select>
                                    </div>
                                    <div class="col-sm-4" ng-if="ngData.provinceId">
                                        <select class="form-control" ui-select2 ng-model="$parent.ngData.districtId" name="districtId" id="districtId" ng-required="true" data-placeholder="Select district">
                                            <option value=""></option>
                                            <option ng-repeat="(idx, elem) in districts" value="{{ elem._id }}" ng-bind-html="elem.name | unsafe"></option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `; 
                },
                controller: function ($scope, $timeout, FormService) {
                    $timeout(function(){
                        if (typeof $scope.ngData != typeof {}) {
                            $scope.ngData = {};
                        }
                        initMap($scope.ngData);
                        
                        if ($scope.ngData.countryId) {
                            $scope.countryIdChange();
                        }
                        if ($scope.ngData.provinceId) {
                            $scope.provinceIdChange();
                        }
                    }, 5000)

                    function initMap(address) {
                        if (!document.getElementById($scope.myId)) return;
                        var myLatLng = {
                            lat: 10.940542,
                            lng: 106.728244
                        };
                        if (address && address.latLng) {
                            myLatLng = address.latLng;
                        }
                        var map = new google.maps.Map(document.getElementById($scope.myId), {
                            zoom: 15,
                            center: myLatLng
                        });

                        var marker = new google.maps.Marker({
                            map: map,
                            position: myLatLng,
                            draggable: true
                        });

                        google.maps.event.addListener(marker, 'dragend', function(event) {
                            geocoder.geocode({ 'location': event.latLng }, function(results, status) {
                                if (status === 'OK') {
                                    if (results[0]) {
                                        var location = results[0].geometry.location;
                                        if (!$scope.ngData) $scope.ngData = {};
                                        $scope.ngData.latLng = {
                                            lat: location.lat(),
                                            lng: location.lng()
                                        }
                                    } else {
                                        window.alert('Geocoder failed due to: ' + status);
                                    }
                                }
                            });
                        });

                        var geocoder = new google.maps.Geocoder;
                        var input = document.getElementById($scope.myId + 'Input');
                        var searchBox = new google.maps.places.SearchBox(input);

                        map.addListener('bounds_changed', function() {
                            searchBox.setBounds(map.getBounds());
                        });
                        searchBox.addListener('places_changed', function() {
                            var places = searchBox.getPlaces();

                            if (places.length == 0) {
                                return;
                            }

                            // For each place, get the icon, name and location.
                            var bounds = new google.maps.LatLngBounds();
                            var place = places[0];
                            
                            if (!place.geometry) {
                                console.log("Returned place contains no geometry");
                                return;
                            }

                            marker.setPosition(place.geometry.location);

                            var location = place.geometry.location;
                            if (!$scope.ngData) $scope.ngData = {};
                            $scope.ngData.latLng = {
                                lat: location.lat(),
                                lng: location.lng()
                            }
                            if (place.geometry.viewport) {
                                bounds.union(place.geometry.viewport);
                            } else {
                                bounds.extend(place.geometry.location);
                            }
                            
                            map.fitBounds(bounds);
                        }); 
                    }

                    function countryIdChange () {
                        FormService.lookup("system_mapProvinces", { parentId: $scope.ngData.countryId })
                            .then(function (res) {
                                $scope.provinces = res.data;
                            })
                            .catch(function (err) {
                                console.log(err);
                            })
                    }
                    $scope.countryIdChange = countryIdChange;
                    
                    function provinceIdChange () {
                        FormService.lookup("system_mapDistricts", { parentId: $scope.ngData.provinceId })
                            .then(function (res) {
                                $scope.districts = res.data;
                            })
                            .catch(function (err) {
                                console.log(err);
                            })
                    }
                    $scope.provinceIdChange = provinceIdChange;
                    FormService.lookup("system_mapCountries")
                        .then(function (res) {
                            $scope.countries = res.data;
                        })
                        .catch(function (err) {
                            console.log(err);
                        })
                },
                scope: {
                    myId: "@",
                    ngData: "=ngData"
                }
            }
        })
        .directive('myTag', function($http) {
            return {
                template: function () {
                    return `
                    <input type="hidden" ui-select2="tagOptions" ng-model="ngData" data-placeholder="Select option">
                    `; 
                },
                controller: function ($scope, $timeout, FormService) {
                    $scope.arr = [];
                    $timeout(function () {
                        let tempArr = [].concat($scope.ngData);
                        FormService.lookup("tags", {collection: $scope.ngCollection})
                            .then(function (res) {
                                    res.data.forEach((e) => {
                                        $scope.arr.push({ id: e._id, name: e.name });
                                        let idx = tempArr.indexOf(e._id);
                                        if (idx >= 0) {
                                            $scope.ngData[idx] = { id: e._id, name: e.name };
                                        }
                                    })
                            })
                            .catch(function (res) {
    
                            })
                    });

                    $scope.tagOptions = {
                        multiple: true,
                        formatResult: function(item) {
                            return item.name;
                        },
                        formatSelection: function(item) {
                            return item.name;
                        },
                        createSearchChoice: function(term) {
                            return {
                                name: term,
                                id: term
                            }
                        },
                        query: function(query) {
                            var data = { results: [] };
                            $scope.arr.forEach(function(e) {
                                if (e.name.match(new RegExp(query.term, "gui"))) {
                                    data.results.push(e);
                                }
                            })
                            query.callback(data);
                        }
                    }
                },
                scope: {
                    myId: "@",
                    ngCollection: "@",
                    ngData: "=ngData"
                }
            }
        })
        .directive("nestableData", function () {
            return {
                scope: {
                    nestableData: "=nestableData",
                    nestableDefault: "=nestableDefault",
                    nestableModel: "=nestableModel"
                },
                link: function(scope, element, attrs, ngModelController) {
                    $(element).click(function () {
                        if (Array.isArray(scope.nestableData)) {
                            scope.$apply(function () {
                                scope.nestableModel = scope.nestableDefault.filter(function (e) {
                                    return scope.nestableData.indexOf(e._id) >= 0;
                                }).map(function (e) {
                                    return {
                                        item: e,
                                        children: []
                                    }
                                });
                            })
                        }
                    })
                }
            }
        })
        .directive('slug', function (FormService) {
            return {
                scope: {
                    slug: "@",
                    ngUrl: "=ngUrl"
                },
                require: "ngModel",
                link: function(scope, element, attrs, ngModelController) {
                    let lang = scope.slug;
                    $(element).on("change", function() {
                        let val = $(this).val();
                        scope.$watch(function () {
                            scope.ngUrl = FormService.toSlug(val);
                        })
                    })
                }
            }
        })
        .directive('jsonText', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attr, ngModel) {            
                    function into(input) {
                        return JSON.parse(input);
                    }
                    function out(data) {
                        return JSON.stringify(data);
                    }
                    ngModel.$parsers.push(into);
                    ngModel.$formatters.push(out);
                }
            };
        })
        .config(function($provide) {
            $provide.decorator("uiSelect2Directive", function($delegate) {
                var directive;
                directive = $delegate[0];
                directive.priority = 100000;
                return $delegate;
            });
        })
        .config(function (ChartJsProvider) {
            ChartJsProvider.setOptions({
                colors: ['#97BBCD', '#DCDCDC', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
            });
        })
        .config(($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) => {
            // default route
            $urlRouterProvider.otherwise("/home");

            $ocLazyLoadProvider.config({
                // Set to true if you want to see what and when is dynamically loaded
                // debug: true
            });

            $breadcrumbProvider.setOptions({
                prefixStateName: 'index.home',
                includeAbstract: true,
                template: `
                <li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last">
                    <a ng-switch-when="false" ui-sref="{{ $index == 0 ? step.ncyBreadcrumbStateRef : step.statisticsPage }}">{{step.ncyBreadcrumbLabel | stateLabel: $index:$last }}</a>
                    <span ng-switch-when="true">{{ step.ncyBreadcrumbLabel | stateLabel: $index:$last }}</span>
                </li>`
            });
            
            $stateProvider
                .state('file', {
                    templateUrl: '/angular/layouts/file.html',
                    ncyBreadcrumb: {
                        label: 'Root',
                        skip: true
                    },
                    resolve: {
                        loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                serie: true,
                                name: 'Font Awesome',
                                files: ['/public/css/font-awesome.min.css']
                            }, {
                                serie: true,
                                name: 'Simple Line Icons',
                                files: ['/public/css/simple-line-icons.css']
                            }]);
                        }]
                    }
                })
                .state('file.browser', {
                    url: '/file/browser',
                    templateUrl: '/angular/file/index.html',
                    controller: "File.IndexController",
                    controllerAs: "vm",
                    ncyBreadcrumb: {
                        label: 'File browser',
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    '/angular/file/index.controller.js'
                                ]
                            });
                        }]
                    }
                })
                .state('index', {
                    abstract: true,
                    templateUrl: function (location) {
                        var match = window.location.href.match(/layout=([a-z]+)/)
                        if(match) {
                            return '/angular/layouts/' + match[1] + '.html';
                        } else {
                            return '/angular/layouts/full.html';
                        }
                    },
                    //page title goes here
                    ncyBreadcrumb: {
                        label: 'Root',
                        skip: true
                    },
                    resolve: {
                        loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
                            // you can lazy load CSS files
                            return $ocLazyLoad.load([{
                                serie: true,
                                name: 'Font Awesome',
                                files: ['/public/css/font-awesome.min.css']
                            }, {
                                serie: true,
                                name: 'Simple Line Icons',
                                files: ['/public/css/simple-line-icons.css']
                            }]);
                        }]
                    }
                })
                // .state('index.settings', {
                //     url: '/settings',
                //     templateUrl: '/gencode/form/setting',
                //     //page title goes here
                //     controller: "Setting.FormController",
                //     controllerAs: "vm",
                //     ncyBreadcrumb: {
                //         label: 'Setting',
                //     },
                //     resolve: {
                //         loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                //             return $ocLazyLoad.load({
                //                 files: [
                //                     '/angular/setting/form.controller.js'
                //                 ]
                //             });
                //         }]
                //     }
                // })
                .state('index.home', {
                    url: '/home',
                    templateUrl: '/angular/home/index.html',
                    //page title goes here
                    controller: "Home.IndexController",
                    controllerAs: "vm",
                    ncyBreadcrumb: {
                        label: 'Dashboard',
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: ['/angular/home/index.controller.js']
                            });
                        }]
                    }
                })
                .state('companyForm', {
                    abstract: true,
                    url: '/company-form/:companyId',
                    templateUrl: '/angular/layouts/company.html',
                    //page title goes here
                    ncyBreadcrumb: {
                        label: 'Root',
                        skip: true
                    },
                    resolve: {
                    }
                })
                .state('companyForm.info', {
                    url: '/info',
                    template: '<h1> Company </h1>',
                    //page title goes here
                    ncyBreadcrumb: {
                        label: 'Root',
                        skip: true
                    },
                    resolve: {
                    }
                })
                // .state('index.terms', {
                //     url: '/terms',
                //     templateUrl: '/gencode/form/term',
                //     //page title goes here
                //     controller: "Term.FormController",
                //     controllerAs: "vm",
                //     ncyBreadcrumb: {
                //         label: 'Term',
                //     },
                //     resolve: {
                //         loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                //             return $ocLazyLoad.load({
                //                 files: [
                //                     '/angular/term/form.controller.js'
                //                 ]
                //             });
                //         }]
                //     }
                // })
                // .state('index.partners', {
                //     url: '/partners',
                //     templateUrl: '/gencode/form/partner',
                //     //page title goes here
                //     controller: "Partner.FormController",
                //     controllerAs: "vm",
                //     ncyBreadcrumb: {
                //         label: 'Partner',
                //     },
                //     resolve: {
                //         loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                //             return $ocLazyLoad.load({
                //                 files: [
                //                     '/angular/partner/form.controller.js'
                //                 ]
                //             });
                //         }]
                //     }
                // })
                ;
        })
        .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = true;
            cfpLoadingBarProvider.latencyThreshold = 1;
        }])
        .factory('socket', function($rootScope) {
            var socket = io.connect();
            return {
                on: function(eventName, callback) {
                    socket.on(eventName, function() {
                        var args = arguments;
                        $rootScope.$apply(function() {
                            callback.apply(socket, args);
                        });
                    });
                },
                emit: function(eventName, data, callback) {
                    socket.emit(eventName, data, function() {
                        var args = arguments;
                        $rootScope.$apply(function() {
                            if (callback) {
                                callback.apply(socket, args);
                            }
                        });
                    })
                }
            };
        })
        .factory('Toastr', function($rootScope, toastr) {
            return {
                success: function(content) {
                    toastr.success(content, "Success");
                },
                info: function(content) {
                    toastr.info(content, "Info");
                },
                warning: function(content) {
                    toastr.warning(content, "Warning");
                },
                error: function(content) {
                    toastr.error(content, "Error");
                },
            }
        })
        .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
            $rootScope.$on('$stateChangeSuccess', function() {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            });
            $rootScope.$state = $state;
            return $rootScope.$stateParams = $stateParams;
        }])
        .run(($http, $rootScope, $window) => {
            // add JWT token as default auth header
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

            // update active tab on state change
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                $rootScope.activeTab = toState.data.activeTab;
            });
        })
        ;

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function() {
        // get JWT token from server
        $.get('/app/token', function(token) {
            window.jwtToken = token;
            angular.bootstrap(document, ['app']);
        });
    });
})();