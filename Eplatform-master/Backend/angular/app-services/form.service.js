(function() {
    'use strict';

    angular
        .module('app')
        .factory('FormService', Service);

    function Service($http, $q) {
        var service = {};

        service.getOne = getOne;
        service.lookup = lookup;
        service.getById = getById;
        service.save = save;
        service.getPage = getPage;
        service.update = update;
        service.updateQuickCheck = updateQuickCheck;
        service.updateFeatureImage = updateFeatureImage;
        service.report = report;
        service.count = count;
        service.delete = _delete;
        service.toSlug = toSlug;
        service.call = call;
        service.translate = translate;
        return service;

        function translate(text) {
            return $http.get('/api/form/translate/' + text);
        }

        function getOne(_module) {
            return $http.get('/api/form/' + _module + '/one/');
        }

        function getPage(_module, page, filter) {
            return $http.post('/api/form/' + _module + '/pages/' + page, filter);
        }

        function lookup(_module, data={}) {
            return $http.post('/api/form/' + _module + '/lookup/', data);
        }

        function getById(_module, _id) {
            return $http.get('/api/form/' + _module + '/' + _id);
        }

        function save(_module, data) {
            return $http.post('/api/form/' + _module + '', data);
        }

        function update(_module, _id, data) {
            return $http.post('/api/form/' + _module + '/' + _id, data);
        }

        function updateQuickCheck(_module, _id, data) {
            return $http.post('/api/form/' + _module + '/quickCheck/' + _id, data);
        }

        function updateFeatureImage(_module, _id, data) {
            return $http.post('/api/form/' + _module + '/featureImage/' + _id, data);
        }

        function report(_module, condition) {
            return $http.post('/api/form/' + _module + "/report", condition);
        }

        function count(_module, condition) {
            return $http.post('/api/form/' + _module + "/count", condition);
        }

        function _delete(_module, _id) {
            return $http.delete('/api/form/' + _module + '/' + _id);
        }

        function call(_module, fn, data) {
            return $http.post('/api/form/' + _module + '/call/' + fn, data);
        }

        function toSlug(text) {
            var str = text.toLowerCase();
             
            // xóa dấu
            str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
            str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
            str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
            str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
            str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
            str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
            str = str.replace(/(đ)/g, 'd');
        
            // Xóa ký tự đặc biệt
            str = str.replace(/([^0-9a-z-\s])/g, '');
        
            // Xóa khoảng trắng thay bằng ký tự -
            str = str.replace(/(\s+)/g, '-');
        
            // xóa phần dự - ở đầu
            str = str.replace(/^-+/g, '');
        
            // xóa phần dư - ở cuối
            str = str.replace(/-+$/g, '');
        
            // return
            return str;
        }
    }
})();