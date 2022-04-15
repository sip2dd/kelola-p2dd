(function() {
    'use strict';

    angular
        .module('faq-setting-module')
        .controller('FaqSettingListController', FaqSettingListController);

    /* @ngInject */
    function FaqSettingListController($http, $state, EnvironmentConfig, ElementConfig, $scope, $timeout, $q, $mdDialog, FaqSettingFactory) {
        var vm = this;

        vm.showFormAdd = function() {
            $state.go('triangular.admin-default.faq-setting-add');
        };

        vm.showFormEdit = function(id) {
            $state.go('triangular.admin-default.faq-setting-edit', { 'id': id });
        };

        vm.showFormView = function(id) {
            $state.go('triangular.admin-default.faq-setting-view', { 'id': id });
        };

        vm.confirmDelete = function(id) {
            var dialog = {
                title: 'Apakah anda yakin?',
                content: 'Data yang sudah dihapus tidak dapat dikembalikan!',
                ok: 'Ya',
                cancel: 'Tidak'
            };

            $mdDialog.show(
                $mdDialog.confirm()
                .title(dialog.title)
                .textContent(dialog.content)
                .ok(dialog.ok)
                .cancel(dialog.cancel)
            ).then(function() {
                FaqSettingFactory.deleteFaq(id).then(function() {
                    getData();
                });
            });
        };

        /*** BEGIN - Advance Table ***/
        vm.query = {
            filter: '',
            limit: ElementConfig.gridRow,
            order: '-id',
            page: 1
        };
        vm.filter = {
            options: {
                debounce: 500
            }
        };
        vm.getData = getData;
        vm.removeFilter = removeFilter;
        activate();

        ///////////
        function activate() {
            var bookmark;
            $scope.$watch('vm.query.filter', function(newValue, oldValue) {
                if (!oldValue) {
                    bookmark = vm.query.page;
                }

                if (!newValue) {
                    vm.query.page = bookmark;
                }

                if (newValue !== oldValue) {
                    vm.getData();
                }
            });
        }

        function getData() {
            FaqSettingFactory.getPagedFaq(vm.query).then(function(res) {
                vm.data = res.data.data;
            });
        }

        function removeFilter() {
            vm.filter.show = false;
            vm.query.filter = '';

            if (vm.filter.form.$dirty) {
                vm.filter.form.$setPristine();
            }
        }
        /*** END - Advance Table ***/
    }
})();