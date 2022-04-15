(function() {
  'use strict';

  angular
      .module('juknis-module')
      .config(moduleConfig);

  /* @ngInject */
  function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
      $translatePartialLoaderProvider.addPart('app/juknis-module');

      $stateProvider
      .state('triangular.admin-default.juknis', {
          url: '/petunjuk-teknis',
          templateUrl: 'app/juknis-module/juknis.tmpl.html',
          controller: 'JuknisController',
          controllerAs: 'vm'
      });
  }
})();
