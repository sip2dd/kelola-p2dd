(function() {
  'use strict';

  angular
      .module('pelaporan-module', [])

  .factory('PelaporanFactory', PelaporanFactory)

  function PelaporanFactory($http, EnvironmentConfig, $state, $log, AppFactory) {
      return {
        getPelaporan: getPelaporan
      }
      function getPelaporan(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'index_etpd/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.pengguna');
                });
        }
  }
})();