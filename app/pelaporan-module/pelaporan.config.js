(function() {
  'use strict';

  angular
      .module('pelaporan-module')
      .config(moduleConfig);

  /* @ngInject */
  function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
      $translatePartialLoaderProvider.addPart('app/pelaporan-module');

      $stateProvider
      .state('triangular.admin-default.pelaporan', {
          url: '/pelaporan',
          templateUrl: 'app/pelaporan-module/pelaporan-list.tmpl.html',
          controller: 'PelaporanListController',
          controllerAs: 'vm'
      })
      .state('triangular.admin-default.pelaporan-add', {
          url: '/pelaporan/add',
          templateUrl: 'app/pelaporan-module/pelaporan-add.tmpl.html',
          controller: 'PelaporanAddController',
          controllerAs: 'vm'
      })
      .state('triangular.admin-default.pelaporan-edit', {
          url: '/pelaporan/edit/:id',
          templateUrl: 'app/pelaporan-module/pelaporan-add.tmpl.html',
          controller: 'PelaporanAddController',
          controllerAs: 'vm'
      })
      .state('triangular.admin-default.pelaporan-view', {
          url: '/pelaporan/view/:id',
          templateUrl: 'app/pelaporan-module/pelaporan-view.tmpl.html',
          controller: 'PelaporanViewController',
          controllerAs: 'vm'
      });
  }
})();
