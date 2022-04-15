(function() {
    'use strict';

    angular
        .module('pengguna-rest-module', [])

    .factory('PenggunaRestFactory', PenggunaRestFactory)

    .filter('username', function() {
        return function(input) {
            if (input) {
                var string = input.replace(/\s+/g, '_'); // Replace space with '_'
                string = string.replace(/-+/g, '_'); // Replace '-' with '_'
                string = string.toLowerCase(); // Set all character to lowerCase
                return string;
            }
        };
    });

    function PenggunaRestFactory($http, $log, $state, AppFactory, EnvironmentConfig) {
        return {
            getPagedPengguna: getPagedPengguna,
            getPengguna: getPengguna,
            deletePengguna: deletePengguna,
            cancelAction: cancelAction
        };

        function getPagedPengguna(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'rest_users?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function getPengguna(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'rest_users/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.pengguna-rest');
                });
        }

        function deletePengguna(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'rest_users/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.pengguna-rest');
        }
    }
})();
