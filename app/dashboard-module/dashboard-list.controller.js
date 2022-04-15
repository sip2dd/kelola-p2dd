(function () {
  "use strict";

  angular
    .module("dashboard-module")
    .controller("DashboardListController", DashboardListController)
    .filter("trustHtml", function ($sce) {
      return function (html) {
        return $sce.trustAsHtml(html);
      };
    });

  /* @ngInject */
  function DashboardListController(EnvironmentConfig, DashboardFactory, $sce) {
    var vm = this;
    vm.showDashboardImage = EnvironmentConfig.showDashboardImage;
    getData();

    function getData() {
      DashboardFactory.getPengumuman().then(function (res) {
        vm.data = res.data.data;
      });
    }

  }
})();
