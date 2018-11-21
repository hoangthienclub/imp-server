(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.getPage = getPage;
        return service;

        function getPage (page, filter) {
            return $http.post('/api/users/pages/' + page, filter);
        }

        function GetCurrent() {
            return $http.get('/api/users/current');
        }

        function GetAll() {
            return $http.get('/api/users');
        }

        function GetById(_id) {
            return $http.get('/api/users/' + _id);
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username);
        }

        function Create(user) {
            return $http.post('/api/users/register', user);
        }

        function Update(user) {
            return $http.post('/api/users/' + user._id, user);
        }

        function Delete(_id) {
            return $http.delete('/api/users/' + _id);
        }
    }

})();