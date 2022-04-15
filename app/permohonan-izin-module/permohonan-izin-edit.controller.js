(function () {
    'use strict';

    angular
        .module('permohonan-izin-module')
        .controller('PermohonanIzinEditController', PermohonanIzinEditController);

    /* @ngInject */
    function PermohonanIzinEditController(
        $http, $state, $log, $mdDialog, $scope, $mdMedia, $stateParams, $document, EnvironmentConfig, APP_CONFIG,
        AppFactory, PermohonanIzinFactory, PemohonFactory, PerusahaanFactory, JenisDokumenFactory,
        UnitFactory, _
    ) {
        var vm = this;
        var id = $stateParams.permohonan_id;

        /*** BEGIN - Main Form ***/
        vm.permohonan_izin = {
            id: id,
            keterangan: '',
            jenis_izin_id: null,
            no_permohonan: '',
            unit_id: null
        };

        vm.permohonan_izin.persyaratan = [];
        vm.permohonan_izin.pemohon = {};
        vm.permohonan_izin.pemohon.desa = {};
        vm.permohonan_izin.pemohon.kecamatan = {};
        vm.permohonan_izin.pemohon.kabupaten = {};
        vm.permohonan_izin.pemohon.provinsi = {};
        vm.searchTextJenisIzin = '';
        vm.searchTextUnit = '';
        vm.searchTextDesa = '';
        vm.searchTextKecamatan = '';
        vm.searchTextKabupaten = '';
        vm.searchTextProvinsi = '';
        resetPerusahaan();

        vm.enable_perusahaan = false;
        vm.maxBirthDate = AppFactory.getMaxBirthDate();
        vm.downloadDokumen = PermohonanIzinFactory.downloadDokumenPemohon;
        vm.uploadDokumen = PermohonanIzinFactory.uploadDokumenPemohon;

        PermohonanIzinFactory.getPermohonanIzin(id).then(function (res) {
            res.data.data.pemohon.tgl_lahir = moment(res.data.data.pemohon.tgl_lahir, APP_CONFIG.datepickerFormat).toDate();
            angular.copy(res.data.data, vm.permohonan_izin);

            vm.searchTextJenisIzin = vm.permohonan_izin.jenis_izin ? vm.permohonan_izin.jenis_izin.jenis_izin : null;
            vm.searchTextDesa = vm.permohonan_izin.pemohon.desa ? vm.permohonan_izin.pemohon.desa.nama_daerah : null;
            vm.searchTextKecamatan = vm.permohonan_izin.pemohon.kecamatan ? vm.permohonan_izin.pemohon.kecamatan.nama_daerah : null;
            vm.searchTextKabupaten = vm.permohonan_izin.pemohon.kabupaten ? vm.permohonan_izin.pemohon.kabupaten.nama_daerah : null;
            vm.searchTextProvinsi = vm.permohonan_izin.pemohon.provinsi ? vm.permohonan_izin.pemohon.provinsi.nama_daerah : null;
            vm.searchTextUnit = vm.permohonan_izin.unit ? vm.permohonan_izin.unit.nama : null;
            vm.searchTextInstansi = vm.permohonan_izin.instansi ? vm.permohonan_izin.instansi.nama : null;

            if (vm.permohonan_izin.tipe_pemohon === 'PERUSAHAAN') {
                vm.searchTextDesaPerusahaan = vm.permohonan_izin.perusahaan.desa ? vm.permohonan_izin.perusahaan.desa.nama_daerah : null;
                vm.searchTextKecamatanPerusahaan = vm.permohonan_izin.perusahaan.kecamatan ? vm.permohonan_izin.perusahaan.kecamatan.nama_daerah : null;
                vm.searchTextKabupatenPerusahaan = vm.permohonan_izin.perusahaan.kabupaten ? vm.permohonan_izin.perusahaan.kabupaten.nama_daerah : null;
                vm.searchTextProvinsiPerusahaan = vm.permohonan_izin.perusahaan.provinsi ? vm.permohonan_izin.perusahaan.provinsi.nama_daerah : null;
                vm.enable_perusahaan = true;

                // Format selected Bidang Usaha
                vm.permohonan_izin.perusahaan.bidang_usaha.map(function (val, key) {
                    vm.permohonan_izin.perusahaan.bidang_usaha[key].name = val.kode + '-' + val.keterangan;
                    vm.permohonan_izin.perusahaan.bidang_usaha[key]._joinData = undefined; // unset _joinData key
                });

                // Format selected Jenis Usaha
                vm.permohonan_izin.perusahaan.jenis_usaha.map(function (val, key) {
                    vm.permohonan_izin.perusahaan.jenis_usaha[key].name = val.kode + '-' + val.keterangan;
                    vm.permohonan_izin.perusahaan.jenis_usaha[key]._joinData = undefined; // unset _joinData key
                });
            }

            for (var i = 0; i < vm.permohonan_izin.persyaratan.length; i++) {
                if (!_.isNull(vm.permohonan_izin.persyaratan[i].awal_berlaku)) {
                    vm.permohonan_izin.persyaratan[i].awal_berlaku = moment(vm.permohonan_izin.persyaratan[i].awal_berlaku, APP_CONFIG.datepickerFormat).toDate();
                }

                if (!_.isNull(vm.permohonan_izin.persyaratan[i].akhir_berlaku)) {
                    vm.permohonan_izin.persyaratan[i].akhir_berlaku = moment(vm.permohonan_izin.persyaratan[i].akhir_berlaku, APP_CONFIG.datepickerFormat).toDate();
                }
            }

            checkTipePemohon();
            initJenisDokumenAutocomplete();
        }, function (err) {
            AppFactory.showToast(err.message, 'error', err.errors);
            $state.go('triangular.admin-default.permohonan-izin');
        });

        PermohonanIzinFactory.getJenisPermohonanList().then(function (res) {
            vm.jenisPermohonanList = res.data.data.items;
            return PermohonanIzinFactory.getGenderList();
        }).then(function (res) {
            vm.genderList = res.data.data.items;
            return PermohonanIzinFactory.getJenisIdentitasList();
        }).then(function (res) {
            vm.jenisIdentitasList = res.data.data.items;
            return PermohonanIzinFactory.getTipePemohonList();
        }).then(function (res) {
            vm.tipePemohonList = res.data.data.items;
            return PermohonanIzinFactory.getJenisProyekList();
        }).then(function (res) {
            vm.jenisProyekList = res.data.data.items;
        });

        vm.updateAction = updateAction;
        vm.updateAndNextAction = updateAndNextAction;
        vm.cancelAction = PermohonanIzinFactory.cancelAction;
        vm.checkTipePemohon = checkTipePemohon;

        function resetPerusahaan() {
            vm.permohonan_izin.perusahaan_id = null;
            vm.permohonan_izin.perusahaan = {};
            vm.permohonan_izin.perusahaan.desa = {};
            vm.permohonan_izin.perusahaan.kecamatan = {};
            vm.permohonan_izin.perusahaan.kabupaten = {};
            vm.permohonan_izin.perusahaan.provinsi = {};
            vm.permohonan_izin.perusahaan.jenis_usaha = [];
            vm.permohonan_izin.perusahaan.bidang_usaha = [];
            vm.searchTextDesaPerusahaan = '';
            vm.searchTextKecamatanPerusahaan = '';
            vm.searchTextKabupatenPerusahaan = '';
            vm.searchTextProvinsiPerusahaan = '';
        }

        function checkTipePemohon() {
          vm.enable_perusahaan = vm.permohonan_izin.tipe_pemohon === 'PERUSAHAAN';
        }

        function updateAction() {
            var reqData = PermohonanIzinFactory.sanitizeData(AppFactory.clone(vm.permohonan_izin));

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'permohonan_izin/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.permohonan-izin');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function updateAndNextAction() {
            var reqData = PermohonanIzinFactory.sanitizeData(AppFactory.clone(vm.permohonan_izin));

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'permohonan_izin/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    PermohonanIzinFactory.getNextStep(res.data.id, vm.permohonan_izin.proses_permohonan_id);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        vm.querySearchJenisIzin = PermohonanIzinFactory.querySearchJenisIzin;
        vm.selectedItemChangeJenisIzin = selectedItemChangeJenisIzin;

        function selectedItemChangeJenisIzin(item) {
            if (angular.isDefined(item)) {
                vm.permohonan_izin.jenis_izin_id = item.id;
                vm.permohonan_izin.jenis_izin_id_display = item.jenis_izin;
            }
        }

        /*** END - End Form ***/


        /*** BEGIN - Autocomplete for Instansi ***/
        vm.selectedItemInstansi       = null;
        vm.searchTextInstansi         = null;
        vm.querySearchInstansi        = UnitFactory.querySearchInstansi;
        vm.isDisabledInstansi         = false;
        vm.noCacheInstansi            = true;
        vm.selectedItemChangeInstansi = selectedItemChangeInstansi;

        function selectedItemChangeInstansi(item) {
            if (angular.isDefined(item)) {
                vm.permohonan_izin.instansi_id = item.id;
            } else {
                vm.permohonan_izin.instansi_id = null;
                vm.searchTextInstansi = null;
            }
            vm.permohonan_izin.unit_id = null;
            vm.permohonan_izin.jenis_izin_id = null;
            vm.searchTextUnit = null;
            vm.searchTextJenisIzin = null;
        }
        /*** END - Autocomplete for Instansi ***/


        /*** BEGIN - Autocomplete for Unit ***/
        vm.selectedItemUnit       = null;
        vm.searchTextUnit         = null;
        vm.querySearchUnit        = UnitFactory.querySearchUnit;
        vm.isDisabledUnit         = false;
        vm.noCacheUnit            = true;
        vm.selectedItemChangeUnit = selectedItemChangeUnit;

        function selectedItemChangeUnit(item) {
            if (angular.isDefined(item)) {
                vm.permohonan_izin.unit_id = item.id;
            } else {
                vm.permohonan_izin.unit_id = null;
            }
        }
        /*** END - Autocomplete for Unit ***/


        /*** BEGIN - Tab Pemohon ***/
        vm.querySearchDesa = PermohonanIzinFactory.querySearchDesa;
        vm.selectedItemChangeDesa = selectedItemChangeDesa;
        vm.querySearchKecamatan = PermohonanIzinFactory.querySearchKecamatan;
        vm.selectedItemChangeKecamatan = selectedItemChangeKecamatan;
        vm.querySearchKabupaten = PermohonanIzinFactory.querySearchKabupaten;
        vm.selectedItemChangeKabupaten = selectedItemChangeKabupaten;
        vm.querySearchProvinsi = PermohonanIzinFactory.querySearchProvinsi;
        vm.selectedItemChangeProvinsi = selectedItemChangeProvinsi;
        vm.openPemohonDialog = openPemohonDialog;

        function selectedItemChangeProvinsi(item) {
            if (angular.isDefined(item)) {
                vm.permohonan_izin.pemohon.provinsi_id = item.id;
                vm.searchTextProvinsi = item.nama_daerah;
            } else {
                vm.permohonan_izin.pemohon.provinsi_id = null;
                vm.searchTextProvinsi = null;
            }
        }

        function selectedItemChangeKabupaten(item) {
            if (angular.isDefined(item)) {
                vm.permohonan_izin.pemohon.kabupaten_id = item.id;
                vm.searchTextKabupaten = item.nama_daerah;
            } else {
                vm.permohonan_izin.pemohon.kabupaten_id = null;
                vm.searchTextKabupaten = null;
            }
        }

        function selectedItemChangeKecamatan(item) {
            if (angular.isDefined(item)) {
                vm.permohonan_izin.pemohon.kecamatan_id = item.id;
                vm.searchTextKecamatan = item.nama_daerah;
            } else {
                vm.permohonan_izin.pemohon.kecamatan_id = null;
                vm.searchTextKecamatan = null;
            }
        }

        function selectedItemChangeDesa(item) {
            if (angular.isDefined(item)) {
                vm.permohonan_izin.pemohon.desa_id = item.id;
                vm.searchTextDesa = item.nama_daerah;
            } else {
                vm.permohonan_izin.pemohon.desa_id = null;
                vm.searchTextDesa = null;
            }
        }

        function openPemohonDialog() {
            $log.info('Opening Pemohon Dialog');
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                controller: ListPemohonDialogController,
                templateUrl: 'app/permohonan-izin-module/pemohon-dialog.tmpl.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {}
            })
                .then(function (pemohonId) {
                    // Get Pemohon Data
                    if (pemohonId) {
                        PemohonFactory.getPemohon(pemohonId).then(function (res) {

                            var dataPemohon = res.data.data;
                            dataPemohon.tgl_lahir = moment(dataPemohon.tgl_lahir, APP_CONFIG.datepickerFormat).toDate();

                            vm.permohonan_izin.pemohon = dataPemohon;
                            vm.permohonan_izin.pemohon_id = dataPemohon.id;

                            if (dataPemohon.desa) {
                                vm.searchTextDesa = dataPemohon.desa.nama_daerah;
                            }

                            if (dataPemohon.kecamatan) {
                                vm.searchTextKecamatan = dataPemohon.kecamatan.nama_daerah;
                            }

                            if (dataPemohon.kabupaten) {
                                vm.searchTextKabupaten = dataPemohon.kabupaten.nama_daerah;
                            }

                            if (dataPemohon.provinsi) {
                                vm.searchTextProvinsi = dataPemohon.provinsi.nama_daerah;
                            }

                            PemohonFactory.compareDokumenPemohon(vm.permohonan_izin.pemohon_id, vm.permohonan_izin.persyaratan);

                            // Reset Perusahaan Data
                            resetPerusahaan();

                        }, function () {
                            AppFactory.showToast('Tidak dapat mengambil data pemohon', 'error');
                        });
                    }
            }, function () {});

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        /*** END - Tab Pemohon ***/


        /*** BEGIN - Tab Perusahaan ***/
        vm.querySearchDesaPerusahaan = PermohonanIzinFactory.querySearchDesa;
        vm.selectedItemChangeDesaPerusahaan = selectedItemChangeDesaPerusahaan;
        vm.querySearchKecamatanPerusahaan = PermohonanIzinFactory.querySearchKecamatan;
        vm.selectedItemChangeKecamatanPerusahaan = selectedItemChangeKecamatanPerusahaan;
        vm.querySearchKabupatenPerusahaan = PermohonanIzinFactory.querySearchKabupaten;
        vm.selectedItemChangeKabupatenPerusahaan = selectedItemChangeKabupatenPerusahaan;
        vm.querySearchProvinsiPerusahaan = PermohonanIzinFactory.querySearchProvinsi;
        vm.selectedItemChangeProvinsiPerusahaan = selectedItemChangeProvinsiPerusahaan;
        vm.openPerusahaanDialog = openPerusahaanDialog;

        function selectedItemChangeProvinsiPerusahaan(item) {
            if (angular.isDefined(item)) {
                vm.permohonan_izin.perusahaan.provinsi_id = item.id;
                vm.searchTextProvinsiPerusahaan = item.nama_daerah;
            } else {
                vm.permohonan_izin.perusahaan.provinsi_id = null;
                vm.searchTextProvinsiPerusahaan = null;
            }
        }

        function selectedItemChangeKabupatenPerusahaan(item) {
            if (angular.isDefined(item)) {
                vm.permohonan_izin.perusahaan.kabupaten_id = item.id;
                vm.searchTextKabupatenPerusahaan = item.nama_daerah;
            } else {
                vm.permohonan_izin.perusahaan.kabupaten_id = null;
                vm.searchTextKabupatenPerusahaan = null;
            }
        }

        function selectedItemChangeKecamatanPerusahaan(item) {
            if (angular.isDefined(item)) {
                vm.permohonan_izin.perusahaan.kecamatan_id = item.id;
                vm.searchTextKecamatanPerusahaan = item.nama_daerah;
            } else {
                vm.permohonan_izin.perusahaan.kecamatan_id = null;
                vm.searchTextKecamatanPerusahaan = null;
            }
        }

        function selectedItemChangeDesaPerusahaan(item) {
            if (angular.isDefined(item)) {
                vm.permohonan_izin.perusahaan.desa_id = item.id;
                vm.searchTextDesaPerusahaan = item.nama_daerah;
            } else {
                vm.permohonan_izin.perusahaan.desa_id = null;
                vm.searchTextDesaPerusahaan = null;
            }
        }

        function openPerusahaanDialog() {
            $log.info('Opening Perusahaan Dialog');
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                controller: ListPerusahaanDialogController,
                templateUrl: 'app/permohonan-izin-module/perusahaan-dialog.tmpl.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    pemohonId: vm.permohonan_izin.pemohon_id
                }
            })
                .then(function (perusahaanId) {
                    // Get Perusahaan Data
                    if (perusahaanId) {
                        PerusahaanFactory.getPerusahaan(perusahaanId).then(function (res) {
                            var dataPerusahaan = res.data.data;
                            vm.permohonan_izin.perusahaan = dataPerusahaan;
                            vm.permohonan_izin.perusahaan_id = dataPerusahaan.id;

                            if (dataPerusahaan.desa) {
                                vm.searchTextDesaPerusahaan = dataPerusahaan.desa.nama_daerah;
                            }

                            if (dataPerusahaan.kecamatan) {
                                vm.searchTextKecamatanPerusahaan = dataPerusahaan.kecamatan.nama_daerah;
                            }

                            if (dataPerusahaan.kabupaten) {
                                vm.searchTextKabupatenPerusahaan = dataPerusahaan.kabupaten.nama_daerah;
                            }

                            if (dataPerusahaan.provinsi) {
                                vm.searchTextProvinsiPerusahaan = dataPerusahaan.provinsi.nama_daerah;
                            }

                        }, function () {
                            AppFactory.showToast('Tidak dapat mengambil data pemohon', 'error');
                        });
                    }
            }, function () {});

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        /*** END - Tab Perusahaan ***/

        /*** BEGIN - Tab Persyaratan ***/
        vm.addNewPersyaratan = function () {
            vm.permohonan_izin.persyaratan.push({
                'no_dokumen': '',
                'keterangan': '',
                'awal_berlaku': null,
                'akhir_berlaku': null,
                'terpenuhi': 0
            });
        };

        vm.removePersyaratan = function (index) {
            if (angular.isDefined(vm.permohonan_izin.persyaratan[index].id)) {
                var persyaratanId = vm.permohonan_izin.persyaratan[index].id;
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
                    PermohonanIzinFactory.deletePersyaratan(persyaratanId).then(function () {
                        vm.permohonan_izin.persyaratan.splice(index, 1);
                    });
                });

            } else {
                vm.permohonan_izin.persyaratan.splice(index, 1);
            }
        };

        vm.searchTextJenisDokumen = [];
        vm.querySearchJenisDokumen = JenisDokumenFactory.querySearchJenisDokumen;
        vm.selectedItemChangeJenisDokumen = selectedItemChangeJenisDokumen;
        vm.viewDokumen = viewDokumen;

        function selectedItemChangeJenisDokumen(item, index) {
            if (angular.isDefined(item)) {
                vm.permohonan_izin.persyaratan[index].jenis_dokumen_id = item.id;
                vm.permohonan_izin.persyaratan[index].jenis_dokumen_label = item.deskripsi;
            }
        }

        function initJenisDokumenAutocomplete() {
            vm.permohonan_izin.persyaratan.forEach(function (dokumen, index) {
                if (angular.isDefined(dokumen.jenis_dokuman)) {
                    vm.searchTextJenisDokumen[index] = dokumen.jenis_dokuman.deskripsi;
                } else {
                    vm.searchTextJenisDokumen[index] = dokumen.jenis_dokuman_label;
                }
            });
        }

        function viewDokumen(lokasi) {
            $log.info('Opening Dokumen Dialog');
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                controller: PermohonanIzinDialogController,
                templateUrl: 'app/permohonan-izin-module/dokumen-dialog.tmpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                fullscreen: useFullScreen,
                locals: { dokumen: lokasi }
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        vm.sendNotif = function(){
            var reqData = {
                permohonan_izin_id : vm.permohonan_izin.id,
                no_permohonan : vm.permohonan_izin.no_permohonan,
                pemohon_hp : vm.permohonan_izin.pemohon.no_hp,
                instansi_id : vm.permohonan_izin.instansi_id
            }

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'permohonan_izin/notifSyarat',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** END - Tab Persyaratan ***/


        /*** BEGIN - Chip Bidang Usaha ***/
        vm.querySearchBidangUsaha = PermohonanIzinFactory.querySearchBidangUsaha;
        /*** END - Chip Bidang Usaha ***/


        /*** BEGIN - Chip Jenis Usaha ***/
        vm.querySearchJenisUsaha = PermohonanIzinFactory.querySearchJenisUsaha;
        /*** END - Chip Jenis Usaha ***/
    }
})();

function PermohonanIzinDialogController(
    $state, $scope, $mdDialog, $http, EnvironmentConfig, dokumen, PermohonanIzinFactory
) {
    var type = dokumen.substr(-4);
    var filename = dokumen;

    $scope.tipe = type;
    $scope.url = EnvironmentConfig.api.replace('api/', '') + 'webroot/files/dokumen_pemohon/' +filename;

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}
