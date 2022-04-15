(function() {
    'use strict';

    angular
        .module('pengguna-module')
        .controller('PenggunaListController', PenggunaListController);

    /* @ngInject */
    function PenggunaListController($http, $state, EnvironmentConfig, ElementConfig, $scope, $timeout, $q, $mdDialog, PenggunaFactory, APP_CONFIG) {
        var vm = this;

        vm.showFormAdd = function() {
            $state.go('triangular.admin-default.pengguna-add');
        };

        vm.showFormEdit = function(id) {
            $state.go('triangular.admin-default.pengguna-edit', { 'id': id });
        };

        vm.showFormView = function(id) {
            $state.go('triangular.admin-default.pengguna-view', { 'id': id });
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
                PenggunaFactory.deletePengguna(id).then(function() {
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
            var user = angular.fromJson(localStorage.getItem(APP_CONFIG.localStorageKey));
            PenggunaFactory.getPagedPengguna(vm.query).then(function(res) {
                vm.data = res.data.data;
                var items = res.data.data.items
                var id = user.unit_id ? user.unit_id : user.instansi_id
                if (id) {
                    var filteredResults = items.filter(function(item) {
                        return item.unit.some(e => e.id === id);
                    });
                    var no = 1;
                    filteredResults.forEach(el => {
                        el.no = no;
                        no++;
                    })
                    vm.data.items = filteredResults
                    vm.data.total_items = filteredResults.length
                }
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
