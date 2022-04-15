(function () {
    'use strict';

    angular
        .module('form-module')
        .controller('FormListController', FormListController);

    /* @ngInject */
    function FormListController(
        $http, $stateParams, $log, APP_CONFIG, DYNAMIC, EnvironmentConfig, ElementConfig, $window,
        $scope, $mdDialog, $timeout, FormFactory, AppFactory, MenuService, Upload, _
    ) {
        var vm = this;
        var formId = $stateParams.form_id;
        var canvasId = null;

        vm.gridData = [];
        vm.openLink = MenuService.openLink;
        vm.isIndexEtpdExistInCurrentPeriode = false;

        $scope.forms = null;
        $scope.formId = formId;
        $scope.keyId = null;
        $scope.clickButton = clickButton;
        $scope.showGridNo = ElementConfig.showGridNo;
        $scope.DYNAMIC = DYNAMIC;

        if (formId == 3016) {
            var user = angular.fromJson(localStorage.getItem(APP_CONFIG.localStorageKey));
            var instansi_id = user.instansi_id ? user.instansi_id : null;    
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'TemplateData/keluaran/1631.json?instansi_id=' + instansi_id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };
            $http(getDataReq)
                .success(function(res) {
                    var { items } = res.data
                    if (items[0].count > 0) {
                        vm.isIndexEtpdExistInCurrentPeriode = true;
                    } else {
                        vm.isIndexEtpdExistInCurrentPeriode = false;
                    }
                })
                .error(function(err) {
                    $log.error(err);
                    vm.isIndexEtpdExistInCurrentPeriode = false;
                });
        }

        FormFactory.getForm(formId, null, true).then(function (res) {
            var templateFormData = res.data.data;
            $scope.nama_form = templateFormData.nama_form;
            $scope.has_filter = templateFormData.has_filter;
            $scope.has_tabel_grid = templateFormData.has_tabel_grid;
            $scope.forms = templateFormData.canvas;

            for (var key in templateFormData.canvas) {
                if (templateFormData.canvas.hasOwnProperty(key)) {
                    var canvas = templateFormData.canvas[key].fields;
                    var formType = templateFormData.canvas[key].ftype;

                    if (formType !== 'action') {
                        canvasId = templateFormData.canvas[key].id;
                    }

                    for (var key2 in canvas) {

                        if (canvas.hasOwnProperty(key2)) {
                            var fields = canvas[key2].field;

                            for (var key3 in fields) {
                                if (fields.hasOwnProperty(key3)) {

                                    var field = fields[key3];
                                    switch (field.type) {
                                        case 'date':
                                            if (!_.isNull(field.data)) {
                                                field.data = moment(field.data, APP_CONFIG.datepickerFormat).toDate();
                                            } else {
                                                field.data = new Date();
                                            }
                                            break;
                                        case 'select-ws':
                                            if (field.options) {
                                                field.options = angular.fromJson(field.options);
                                            }
                                            break;
                                    }

                                    // Initialize the model for filter
                                    if (formType === 'filter') {
                                        vm.query[field.variable_name] = field.data;
                                    }
                                }
                            }

                        }

                    }

                }
            }

            // Request to get grid data
            $timeout(function () {
                activate();
            });
        });


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

        ///////////
        function activate() {
            var bookmark;

            for (var filterKey in vm.query) {
                if (vm.query.hasOwnProperty(filterKey)) {
                    var filterValue = vm.query[filterKey];
                    $scope.$watch('vm.query.' + filterKey, function (newValue, oldValue) {
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
            }

            vm.getData();
        }

        function getData() {
            FormFactory.getGridData(canvasId, vm.query).then(function (res) {
                vm.gridData = angular.copy(res.data.data);
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

        function clickButton(formId, datatabelId, keyId, tautan, actionType) {
            switch (actionType) {
                case 'downloadhasil':
                    console.log(keyId);
                    if (keyId) {
                        var dialog = {
                            title: 'Download Hasil',
                            content: 'Download Hasil',
                            ok: 'Ya',
                            cancel: 'Tidak'
                        };
    
                        $mdDialog.show(
                            $mdDialog.confirm()
                            .title(dialog.title)
                            .textContent(dialog.content)
                            .ok(dialog.ok)
                            .cancel(dialog.cancel)
                        ).then(function () {
                            var url = "https://kelola.p2dd.go.id/p2dd/webroot/files/upload/" + keyId;
                            window.open(url, '_blank');
                            console.log("Report Downloaded")
                        });
                    } else {
                        var dialog = {
                            title: 'Alert',
                            content: 'Laporan Hasil Belum di Upload',
                            ok: 'Ya'
                        };
    
                        $mdDialog.show(
                            $mdDialog.alert()
                            .title(dialog.title)
                            .textContent(dialog.content)
                            .ok(dialog.ok)
                        )
                    }
                    break;
                case 'downloadreport':
                    // var today = new Date();
                    // var dd = today.getDate();
                    // var mm = today.getMonth() + 1;
                    // var yyyy = today.getFullYear();
                    // if (dd < 10) {
                    //     dd = '0' + dd;
                    // }
                    // if (mm < 10) {
                    //     mm = '0' + mm;
                    // }
                    // var today = dd + '-' + mm + '-' + yyyy;
                    // console.log(tautan);
                    // console.log(today);
                    // break;
                    var dialog = {
                        title: 'Download Report',
                        content: 'Download Report',
                        ok: 'Ya',
                        cancel: 'Tidak'
                    };

                    $mdDialog.show(
                        $mdDialog.confirm()
                        .title(dialog.title)
                        .textContent(dialog.content)
                        .ok(dialog.ok)
                        .cancel(dialog.cancel)
                    ).then(function () {
                        var url = "https://kelola.p2dd.go.id/p2dd/pelaporan/export/" + keyId;
                        window.open(url, '_blank');
                        console.log("Report Downloaded")
                    });
                    break;
                case 'delete':
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
                    ).then(function () {
                        if (formId == 3038) {
                            var req = {
                                method: 'DELETE',
                                url: EnvironmentConfig.api + 'index_etpd/' + keyId,
                                headers: {
                                  'Content-Type': 'application/json; charset=UTF-8'
                                }
                              };
                              
                              $http(req)
                              .success(function (res) {
                                    AppFactory.showToast(res.message);
                                    $timeout(getData, 1000);
                                })
                                .error(function (err) {
                                  AppFactory.showToast(err.message, 'error', err.errors);
                                });
                        } else {
                            FormFactory.deleteData(formId, datatabelId, keyId).then(
                                $timeout(getData, 1000)
                                );
                        }
                    });
                    break;
                case 'save':
                    FormFactory.saveData(formId, keyId, $scope.nama_form, $scope.forms, tautan);
                    break;
                case 'edit':
                    if (formId == 3016) {
                        // var filteredItem = vm.gridData.items.filter(i => i.id == keyId)
                        // console.log(filteredItem[0]);
                        // if (filteredItem[0].status_pelaporan == "Proses") {
                        //     var dialog = {
                        //         title: 'Periode Berakhir',
                        //         content: 'Periode pelaporan telah berahkir',
                        //         ok: 'OK'
                        //     };
        
                        //     $mdDialog.show(
                        //         $mdDialog.alert()
                        //         .title(dialog.title)
                        //         .textContent(dialog.content)
                        //         .ok(dialog.ok)
                        //     );
                        //     break;
                        // }

                        var getDataReq = {
                            method: 'GET',
                            url: EnvironmentConfig.api + 'TemplateData/keluaran/1620.json',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            }
                        };
                        $http(getDataReq)
                        .success(function(res) {
                            var { items } = res.data
                            console.log(items);
                            if (items.length = 0) {
                                var dialog = {
                                    title: 'Periode Berakhir',
                                    content: 'Periode pelaporan telah berahkir',
                                    ok: 'OK'
                                };
                                
                                $mdDialog.show(
                                    $mdDialog.alert()
                                    .title(dialog.title)
                                    .textContent(dialog.content)
                                    .ok(dialog.ok)
                                    );
                                }
                                // break;
                            })
                            .error(function(err) {
                                $log.error(err);
                            });
                    }
                case 'view':
                    if (typeof (keyId) === 'undefined') {
                        AppFactory.showToast('Key ID not Provided');
                    } else {
                        MenuService.openLink(tautan, formId, keyId);
                    }
                    break;
                case 'add':
                    if (formId == 3016) {
                        var getDataReq = {
                            method: 'GET',
                            url: EnvironmentConfig.api + 'TemplateData/keluaran/1620.json',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            }
                        };
                        $http(getDataReq)
                        .success(function(res) {
                            var { items } = res.data
                            console.log(items);
                            if (items.length > 0) {
                                // TODO: Check if instansi has add index ETPD in current period
                                MenuService.openLink(tautan, formId, null);
                            } else {
                                var dialog = {
                                    title: 'Periode Berakhir',
                                    content: 'Periode pelaporan telah berahkir',
                                    ok: 'OK'
                                };
                                
                                $mdDialog.show(
                                    $mdDialog.alert()
                                    .title(dialog.title)
                                    .textContent(dialog.content)
                                    .ok(dialog.ok)
                                    );
                                }
                            })
                            .error(function(err) {
                                $log.error(err);
                            });
                        
                    } else {
                        MenuService.openLink(tautan, formId, null);
                    }
                    break;
                case 'cancel':
                    MenuService.openLink(tautan, formId, null);
                    break;
                case 'report':
                    FormFactory.downloadReport(tautan, keyId, null);
                    break;
                default:
                    MenuService.openLink(tautan, formId, keyId);
                    break;
            }
        }

        /** BEGIN - Multiple File Upload Field **/
        var fileList = [];
        $scope.uploadFile = uploadFile;
        $scope.downloadFile = downloadFile;

        function uploadFile($files, data) {
            if (!_.isNull($files) && $files.length > 0) {
                fileList = $files;

                uploadStarted(data);

                // $timeout(uploadComplete, 4000);

                Upload.upload({
                    url: EnvironmentConfig.api + 'Form/uploadFile',
                    data: {
                        file: fileList
                    }
                }).then(function (resp) {
                    $log.info('Success ' + resp.data.data.file_name + ' uploaded. Response: ' + resp.data.message);
                    data.data = resp.data.data.file_name;
                    data.file_url = resp.data.data.file_url;
                    uploadComplete(data);
                }, function (resp) {
                    $log.info('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $log.info('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        }

        function uploadStarted(data) {
            data.upload_status = 'uploading';
        }

        function uploadComplete(data) {
            data.upload_status = 'complete';
            var message = 'Berhasil upload ';

            for (var file in fileList) {
                message += fileList[file].name + ' ';
            }

            AppFactory.showToast(message);
            $timeout(uploadReset(data), 3000);

            fileList = null;
        }

        function uploadReset(data) {
            data.upload_status = 'idle';
        }

        function downloadFile(filename) {
            $window.open(EnvironmentConfig.api + 'Form/downloadFile?filename=' + filename, '_blank');
        }
        /** END - Multiple File Upload Field **/

        // function cekPeriodePelaporan() {}
    }
})();
