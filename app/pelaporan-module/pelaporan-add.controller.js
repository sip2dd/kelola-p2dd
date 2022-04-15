(function () {
  'use strict';

  angular
      .module('pelaporan-module')
      .controller('PelaporanAddController', PelaporanAddController)
      .directive('numericOnly', function() {
        return {
          require: 'ngModel',
          link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {
              var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g, '') : null;
    
              if (transformedInput != inputValue) {
                modelCtrl.$setViewValue(transformedInput);
                modelCtrl.$render();
              }
    
              return transformedInput;
            });
          }
        };
      });
  /* @ngInject */
  function PelaporanAddController($stateParams, $http, $state, $mdDialog, $log, EnvironmentConfig, AppFactory, PelaporanFactory, APP_CONFIG, MenuService) {
    var vm = this;
    var user = angular.fromJson(localStorage.getItem(APP_CONFIG.localStorageKey));
    var id = $stateParams.id;
    var instansi_id = user.instansi_id ? user.instansi_id : null;

    // console.log(instansi_id);
    vm.kode_daerah = user.kode_daerah ? user.kode_daerah : null;
    vm.isProv = isProv;
    vm.simpan = simpan;
    vm.toggleSelection = toggleSelection;
    vm.disableSave = disableSave;
    vm.disableSaveBtn = true;
    vm.master_kpwdn = [];
    vm.master_provinsi = [];
    vm.periode = {};
    vm.data = {
        id: id ? id : '',
        instansi_id: instansi_id,
        email: user.email,
        kendaraan_bermotor: [],
        bea_balik_nama_kendaraan_bermotor: [],
        bahan_bakar_kendaraan_bermotor: [],
        air_permukaan: [],
        rokok: [],
        hotel: [],
        restoran: [],
        hiburan: [],
        reklame: [],
        penerangan_jalan: [],
        mineral_bukan_logam: [],
        parkir: [],
        air_tanah: [],
        sarang_burung_walet: [],
        pbb_desa_kota: [],
        bea_hak_tanah_bangunan: [],
        pelayanan_kesehatan: [],
        pelayanan_kebersihan: [],
        pelayanan_pemakaman: [],
        parkir_jalan_umum: [],
        pelayanan_pasar: [],
        pengujian_kendaraan_bermotor: [],
        pemeriksaan_alat_pemadam: [],
        penggantian_biaya_cetak_peta: [],
        penyedotan_kakus: [],
        pengolahan_limbah_cair: [],
        pelayanan_tera: [],
        pelayanan_pendidikan: [],
        pengendalian_menara_telekomunikasi: [],
        pengendalian_lalu_lintas: [],
        pemakaian_kekayaan_daerah: [],
        pasar_grosir: [],
        tempat_pelelangan: [],
        terminal: [],
        tempat_khusus_parkir: [],
        tempat_penginapan: [],
        rumah_potong_hewan: [],
        pelayanan_pelabuhan: [],
        tempat_rekreasi: [],
        penyebrangan_diair: [],
        penjualan_produksi_usaha: [],
        izin_persetujuan_bangunan: [],
        izin_tempat_penjualan_minuman: [],
        izin_trayek: [],
        izin_usaha_perikanan: [],
        perpanjangan_imta: [],
        sistem_informasi_pendapatan_daerah: [],
        sistem_informasi_belanja_daerah: [],
        kerjasama_pemungutan_pajak: [],
        kendala_pelaksanaan_etpd: [],
    }
    
    vm.answers = ['QRIS', 'ATM, EDC, Internet/Mobile/SMS Banking, Agen Bank, UE Reader, E-Commerce', 'Teller/Loket Bank', 'Tunai', 'Tidak dipungut'];
    vm.sistem = ['SIMDA', 'SIMRAL', 'SIPKD', 'SIPD', 'Belum Menggunakan Sistem', 'Other'];
    vm.kerjasama = ['Perijinan', 'Dukcapil', 'OPD Penghasil', 'Kantor BPN', 'KPP Pratama', 'Other'];
    vm.kendala_pelaksanaan = ['Komitmen Pemda', 'Kompetensi SDM Pemda', 'Minat masyarakat dalam bertransaksi nontunai', 'Infrastruktur IT dan jaringan telekomunikasi/internet', 'Infrastruktur/Layanan Perbankan', 'Other'];
    
    getPeriodeAktif();
    getMasterKpwdn();
    getMasterProvinsi();
    
    if (id) {
      PelaporanFactory.getPelaporan(id).then(function(res) {
        angular.copy(res.data.data, vm.data)
        stringToData();
        delete vm.data.tgl_dibuat;
        delete vm.data.tgl_diubah;
      })
    }

    function isProv() {
      if (vm.kode_daerah) {
        if (vm.kode_daerah.length === 2) {
          return true
        }
        return false
      }
    }

    function dataToString() {
      vm.data.kendaraan_bermotor = vm.data.kendaraan_bermotor.join(';')
      vm.data.bea_balik_nama_kendaraan_bermotor = vm.data.bea_balik_nama_kendaraan_bermotor.join(';')
      vm.data.bahan_bakar_kendaraan_bermotor = vm.data.bahan_bakar_kendaraan_bermotor.join(';')
      vm.data.air_permukaan = vm.data.air_permukaan.join(';')
      vm.data.rokok = vm.data.rokok.join(';')
      vm.data.hotel = vm.data.hotel.join(';')
      vm.data.restoran = vm.data.restoran.join(';')
      vm.data.hiburan = vm.data.hiburan.join(';')
      vm.data.reklame = vm.data.reklame.join(';')
      vm.data.penerangan_jalan = vm.data.penerangan_jalan.join(';')
      vm.data.mineral_bukan_logam = vm.data.mineral_bukan_logam.join(';')
      vm.data.parkir = vm.data.parkir.join(';')
      vm.data.air_tanah = vm.data.air_tanah.join(';')
      vm.data.sarang_burung_walet = vm.data.sarang_burung_walet.join(';')
      vm.data.pbb_desa_kota = vm.data.pbb_desa_kota.join(';')
      vm.data.bea_hak_tanah_bangunan = vm.data.bea_hak_tanah_bangunan.join(';')
      vm.data.pelayanan_kesehatan = vm.data.pelayanan_kesehatan.join(';')
      vm.data.pelayanan_kebersihan = vm.data.pelayanan_kebersihan.join(';')
      vm.data.pelayanan_pemakaman = vm.data.pelayanan_pemakaman.join(';')
      vm.data.parkir_jalan_umum = vm.data.parkir_jalan_umum.join(';')
      vm.data.pelayanan_pasar = vm.data.pelayanan_pasar.join(';')
      vm.data.pengujian_kendaraan_bermotor = vm.data.pengujian_kendaraan_bermotor.join(';')
      vm.data.pemeriksaan_alat_pemadam = vm.data.pemeriksaan_alat_pemadam.join(';')
      vm.data.penggantian_biaya_cetak_peta = vm.data.penggantian_biaya_cetak_peta.join(';')
      vm.data.penyedotan_kakus = vm.data.penyedotan_kakus.join(';')
      vm.data.pengolahan_limbah_cair = vm.data.pengolahan_limbah_cair.join(';')
      vm.data.pelayanan_tera = vm.data.pelayanan_tera.join(';')
      vm.data.pelayanan_pendidikan = vm.data.pelayanan_pendidikan.join(';')
      vm.data.pengendalian_menara_telekomunikasi = vm.data.pengendalian_menara_telekomunikasi.join(';')
      vm.data.pengendalian_lalu_lintas = vm.data.pengendalian_lalu_lintas.join(';')
      vm.data.pemakaian_kekayaan_daerah = vm.data.pemakaian_kekayaan_daerah.join(';')
      vm.data.pasar_grosir = vm.data.pasar_grosir.join(';')
      vm.data.tempat_pelelangan = vm.data.tempat_pelelangan.join(';')
      vm.data.terminal = vm.data.terminal.join(';')
      vm.data.tempat_khusus_parkir = vm.data.tempat_khusus_parkir.join(';')
      vm.data.tempat_penginapan = vm.data.tempat_penginapan.join(';')
      vm.data.rumah_potong_hewan = vm.data.rumah_potong_hewan.join(';')
      vm.data.pelayanan_pelabuhan = vm.data.pelayanan_pelabuhan.join(';')
      vm.data.tempat_rekreasi = vm.data.tempat_rekreasi.join(';')
      vm.data.penyebrangan_diair = vm.data.penyebrangan_diair.join(';')
      vm.data.penjualan_produksi_usaha = vm.data.penjualan_produksi_usaha.join(';')
      vm.data.izin_persetujuan_bangunan = vm.data.izin_persetujuan_bangunan.join(';')
      vm.data.izin_tempat_penjualan_minuman = vm.data.izin_tempat_penjualan_minuman.join(';')
      vm.data.izin_trayek = vm.data.izin_trayek.join(';')
      vm.data.izin_usaha_perikanan = vm.data.izin_usaha_perikanan.join(';')
      vm.data.perpanjangan_imta = vm.data.perpanjangan_imta.join(';')
      vm.data.sistem_informasi_pendapatan_daerah = vm.data.sistem_informasi_pendapatan_daerah.join(';')
      vm.data.sistem_informasi_belanja_daerah = vm.data.sistem_informasi_belanja_daerah.join(';')
      vm.data.kerjasama_pemungutan_pajak = vm.data.kerjasama_pemungutan_pajak.join(';')
      vm.data.kendala_pelaksanaan_etpd = vm.data.kendala_pelaksanaan_etpd.join(';')
    }

    function stringToData() {
      // vm.data.nip = Number(vm.data.nip)
      // vm.data.nomor_kontak = Number(vm.data.nomor_kontak)
      vm.data.total_target_pendapatan_asli_daerah = Number(vm.data.total_target_pendapatan_asli_daerah)
      vm.data.total_realisasi_pendapatan_asli_daerah = Number(vm.data.total_realisasi_pendapatan_asli_daerah)
      vm.data.total_target_pajak_daerah = Number(vm.data.total_target_pajak_daerah)
      vm.data.total_realisasi_pajak_daerah = Number(vm.data.total_realisasi_pajak_daerah)
      vm.data.total_target_retribusi_daerah = Number(vm.data.total_target_retribusi_daerah)
      vm.data.total_realisasi_retribusi_daerah = Number(vm.data.total_realisasi_retribusi_daerah)
      vm.data.total_pagu_belanja_daerah = Number(vm.data.total_pagu_belanja_daerah)
      vm.data.total_realisasi_belanja_daerah = Number(vm.data.total_realisasi_belanja_daerah)
      vm.data.total_pagu_belanja_operasi = Number(vm.data.total_pagu_belanja_operasi)
      vm.data.total_realisasi_belanja_operasi = Number(vm.data.total_realisasi_belanja_operasi)
      vm.data.total_pagu_belanja_modal = Number(vm.data.total_pagu_belanja_modal)
      vm.data.total_realisasi_belanja_modal = Number(vm.data.total_realisasi_belanja_modal)
      vm.data.total_pagu_belanja_tidak_terduga = Number(vm.data.total_pagu_belanja_tidak_terduga)
      vm.data.total_realisasi_belanja_tidak_terduga = Number(vm.data.total_realisasi_belanja_tidak_terduga)
      vm.data.total_pagu_belanja_transfer = Number(vm.data.total_pagu_belanja_transfer)
      vm.data.total_realisasi_belanja_transfer = Number(vm.data.total_realisasi_belanja_transfer)
      vm.data.total_pajak_daerah_dari_qris = Number(vm.data.total_pajak_daerah_dari_qris)
      vm.data.total_retribusi_daerah_dari_qris = Number(vm.data.total_retribusi_daerah_dari_qris)
      vm.data.total_pajak_daerah_dari_non_digital = Number(vm.data.total_pajak_daerah_dari_non_digital)
      vm.data.total_retribusi_daerah_dari_non_digital = Number(vm.data.total_retribusi_daerah_dari_non_digital)
      vm.data.total_pajak_daerah_dari_atm = Number(vm.data.total_pajak_daerah_dari_atm)
      vm.data.total_pajak_daerah_dari_edc = Number(vm.data.total_pajak_daerah_dari_edc)
      vm.data.total_pajak_daerah_dari_internet = Number(vm.data.total_pajak_daerah_dari_internet)
      vm.data.total_pajak_daerah_dari_agen_bank = Number(vm.data.total_pajak_daerah_dari_agen_bank)
      vm.data.total_pajak_daerah_dari_uereader = Number(vm.data.total_pajak_daerah_dari_uereader)
      vm.data.total_pajak_daerah_dari_ecommerce = Number(vm.data.total_pajak_daerah_dari_ecommerce)
      vm.data.total_retribusi_daerah_dari_atm = Number(vm.data.total_retribusi_daerah_dari_atm)
      vm.data.total_retribusi_daerah_dari_edc = Number(vm.data.total_retribusi_daerah_dari_edc)
      vm.data.total_retribusi_daerah_dari_internet = Number(vm.data.total_retribusi_daerah_dari_internet)
      vm.data.total_retribusi_daerah_dari_agen_bank = Number(vm.data.total_retribusi_daerah_dari_agen_bank)
      vm.data.total_retribusi_daerah_dari_uereader = Number(vm.data.total_retribusi_daerah_dari_uereader)
      vm.data.total_retribusi_daerah_dari_ecommerce = Number(vm.data.total_retribusi_daerah_dari_ecommerce)
      vm.data.kendaraan_bermotor = vm.data.kendaraan_bermotor.split(';')
      vm.data.bea_balik_nama_kendaraan_bermotor = vm.data.bea_balik_nama_kendaraan_bermotor.split(';')
      vm.data.bahan_bakar_kendaraan_bermotor = vm.data.bahan_bakar_kendaraan_bermotor.split(';')
      vm.data.air_permukaan = vm.data.air_permukaan.split(';')
      vm.data.rokok = vm.data.rokok.split(';')
      vm.data.hotel = vm.data.hotel.split(';')
      vm.data.restoran = vm.data.restoran.split(';')
      vm.data.hiburan = vm.data.hiburan.split(';')
      vm.data.reklame = vm.data.reklame.split(';')
      vm.data.penerangan_jalan = vm.data.penerangan_jalan.split(';')
      vm.data.mineral_bukan_logam = vm.data.mineral_bukan_logam.split(';')
      vm.data.parkir = vm.data.parkir.split(';')
      vm.data.air_tanah = vm.data.air_tanah.split(';')
      vm.data.sarang_burung_walet = vm.data.sarang_burung_walet.split(';')
      vm.data.pbb_desa_kota = vm.data.pbb_desa_kota.split(';')
      vm.data.bea_hak_tanah_bangunan = vm.data.bea_hak_tanah_bangunan.split(';')
      vm.data.pelayanan_kesehatan = vm.data.pelayanan_kesehatan.split(';')
      vm.data.pelayanan_kebersihan = vm.data.pelayanan_kebersihan.split(';')
      vm.data.pelayanan_pemakaman = vm.data.pelayanan_pemakaman.split(';')
      vm.data.parkir_jalan_umum = vm.data.parkir_jalan_umum.split(';')
      vm.data.pelayanan_pasar = vm.data.pelayanan_pasar.split(';')
      vm.data.pengujian_kendaraan_bermotor = vm.data.pengujian_kendaraan_bermotor.split(';')
      vm.data.pemeriksaan_alat_pemadam = vm.data.pemeriksaan_alat_pemadam.split(';')
      vm.data.penggantian_biaya_cetak_peta = vm.data.penggantian_biaya_cetak_peta.split(';')
      vm.data.penyedotan_kakus = vm.data.penyedotan_kakus.split(';')
      vm.data.pengolahan_limbah_cair = vm.data.pengolahan_limbah_cair.split(';')
      vm.data.pelayanan_tera = vm.data.pelayanan_tera.split(';')
      vm.data.pelayanan_pendidikan = vm.data.pelayanan_pendidikan.split(';')
      vm.data.pengendalian_menara_telekomunikasi = vm.data.pengendalian_menara_telekomunikasi.split(';')
      vm.data.pengendalian_lalu_lintas = vm.data.pengendalian_lalu_lintas.split(';')
      vm.data.pemakaian_kekayaan_daerah = vm.data.pemakaian_kekayaan_daerah.split(';')
      vm.data.pasar_grosir = vm.data.pasar_grosir.split(';')
      vm.data.tempat_pelelangan = vm.data.tempat_pelelangan.split(';')
      vm.data.terminal = vm.data.terminal.split(';')
      vm.data.tempat_khusus_parkir = vm.data.tempat_khusus_parkir.split(';')
      vm.data.tempat_penginapan = vm.data.tempat_penginapan.split(';')
      vm.data.rumah_potong_hewan = vm.data.rumah_potong_hewan.split(';')
      vm.data.pelayanan_pelabuhan = vm.data.pelayanan_pelabuhan.split(';')
      vm.data.tempat_rekreasi = vm.data.tempat_rekreasi.split(';')
      vm.data.penyebrangan_diair = vm.data.penyebrangan_diair.split(';')
      vm.data.penjualan_produksi_usaha = vm.data.penjualan_produksi_usaha.split(';')
      vm.data.izin_persetujuan_bangunan = vm.data.izin_persetujuan_bangunan.split(';')
      vm.data.izin_tempat_penjualan_minuman = vm.data.izin_tempat_penjualan_minuman.split(';')
      vm.data.izin_trayek = vm.data.izin_trayek.split(';')
      vm.data.izin_usaha_perikanan = vm.data.izin_usaha_perikanan.split(';')
      vm.data.perpanjangan_imta = vm.data.perpanjangan_imta.split(';')
      vm.data.sistem_informasi_pendapatan_daerah = vm.data.sistem_informasi_pendapatan_daerah.split(';')
      vm.data.sistem_informasi_belanja_daerah = vm.data.sistem_informasi_belanja_daerah.split(';')
      vm.data.kerjasama_pemungutan_pajak = vm.data.kerjasama_pemungutan_pajak.split(';')
      vm.data.kendala_pelaksanaan_etpd = vm.data.kendala_pelaksanaan_etpd.split(';')
    }

    function simpan() {
      dataToString();
      var reqData = vm.data;
      console.log(vm.data);
      // return;
      
      var req = {
        method: 'POST',
        url: EnvironmentConfig.api + 'index_etpd',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        data: reqData
      };
      
      $http(req)
      .success(function (res) {
        var dialog = {
          title: 'Sukses',
          content: res.message,
          ok: 'Ok'
        };
        
        $mdDialog.show(
          $mdDialog.alert()
          .title(dialog.title)
          .textContent(dialog.content)
          .ok(dialog.ok)
          ).then(function () {
            window.history.back()
          });
        })
        .error(function (err) {
          AppFactory.showToast(err.message, 'error', err.errors);
        });
    }

    function getPeriodeAktif() {
      var getDataReq = {
        method: 'GET',
        url: EnvironmentConfig.api + 'TemplateData/keluaran/1620.json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      };
      $http(getDataReq)
        .success(function(res) {
          var { items } = res.data;
          vm.periode = items ? items[0] : null;
          vm.data.periode_id = items ? items[0].id : null;
          $log.log(vm.periode);
        })
        .error(function(err) {
            $log.error(err);
        });
    }

    function getMasterKpwdn() {
      var getDataReq = {
        method: 'GET',
        url: EnvironmentConfig.api + 'TemplateData/keluaran/1630.json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      };
      $http(getDataReq)
        .success(function(res) {
          var { master_kpwdn } = res.data
          vm.master_kpwdn = master_kpwdn;
        })
        .error(function(err) {
            $log.error(err);
        });
    }

    function getMasterProvinsi() {
      var getDataReq = {
        method: 'GET',
        url: EnvironmentConfig.api + 'TemplateData/keluaran/1632.json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      };
      $http(getDataReq)
        .success(function(res) {
          var { items } = res.data
          vm.master_provinsi = items;
        })
        .error(function(err) {
            $log.error(err);
        });
    }

    function toggleSelection(field, answer) {
        switch (field) {
            case 'kendaraan':
                var idx = vm.data.kendaraan_bermotor.indexOf(answer);
                if (idx > -1) {
                  vm.data.kendaraan_bermotor.splice(idx, 1);
                } else {
                  vm.data.kendaraan_bermotor.push(answer);
                }
                break;
            case 'bea_balik_nama_kendaraan_bermotor':
                var idx = vm.data.bea_balik_nama_kendaraan_bermotor.indexOf(answer);
                if (idx > -1) {
                  vm.data.bea_balik_nama_kendaraan_bermotor.splice(idx, 1);
                } else {
                  vm.data.bea_balik_nama_kendaraan_bermotor.push(answer);
                }
                break;
            case 'bahan_bakar_kendaraan_bermotor':
                var idx = vm.data.bahan_bakar_kendaraan_bermotor.indexOf(answer);
                if (idx > -1) {
                  vm.data.bahan_bakar_kendaraan_bermotor.splice(idx, 1);
                } else {
                  vm.data.bahan_bakar_kendaraan_bermotor.push(answer);
                }
                break;
            case 'air_permukaan':
                var idx = vm.data.air_permukaan.indexOf(answer);
                if (idx > -1) {
                  vm.data.air_permukaan.splice(idx, 1);
                } else {
                  vm.data.air_permukaan.push(answer);
                }
                break;
            case 'rokok':
                var idx = vm.data.rokok.indexOf(answer);
                if (idx > -1) {
                  vm.data.rokok.splice(idx, 1);
                } else {
                  vm.data.rokok.push(answer);
                }
                break;
            case 'hotel':
                var idx = vm.data.hotel.indexOf(answer);
                if (idx > -1) {
                  vm.data.hotel.splice(idx, 1);
                } else {
                  vm.data.hotel.push(answer);
                }
                break;
            case 'restoran':
                var idx = vm.data.restoran.indexOf(answer);
                if (idx > -1) {
                  vm.data.restoran.splice(idx, 1);
                } else {
                  vm.data.restoran.push(answer);
                }
                break;
            case 'hiburan':
                var idx = vm.data.hiburan.indexOf(answer);
                if (idx > -1) {
                  vm.data.hiburan.splice(idx, 1);
                } else {
                  vm.data.hiburan.push(answer);
                }
                break;
            case 'reklame':
                var idx = vm.data.reklame.indexOf(answer);
                if (idx > -1) {
                  vm.data.reklame.splice(idx, 1);
                } else {
                  vm.data.reklame.push(answer);
                }
                break;
            case 'penerangan_jalan':
                var idx = vm.data.penerangan_jalan.indexOf(answer);
                if (idx > -1) {
                  vm.data.penerangan_jalan.splice(idx, 1);
                } else {
                  vm.data.penerangan_jalan.push(answer);
                }
                break;
            case 'mineral_bukan_logam':
                var idx = vm.data.mineral_bukan_logam.indexOf(answer);
                if (idx > -1) {
                  vm.data.mineral_bukan_logam.splice(idx, 1);
                } else {
                  vm.data.mineral_bukan_logam.push(answer);
                }
                break;
            case 'parkir':
                var idx = vm.data.parkir.indexOf(answer);
                if (idx > -1) {
                  vm.data.parkir.splice(idx, 1);
                } else {
                  vm.data.parkir.push(answer);
                }
                break;
            case 'air_tanah':
                var idx = vm.data.air_tanah.indexOf(answer);
                if (idx > -1) {
                  vm.data.air_tanah.splice(idx, 1);
                } else {
                  vm.data.air_tanah.push(answer);
                }
                break;
            case 'sarang_burung_walet':
                var idx = vm.data.sarang_burung_walet.indexOf(answer);
                if (idx > -1) {
                  vm.data.sarang_burung_walet.splice(idx, 1);
                } else {
                  vm.data.sarang_burung_walet.push(answer);
                }
                break;
            case 'pbb_desa_kota':
                var idx = vm.data.pbb_desa_kota.indexOf(answer);
                if (idx > -1) {
                  vm.data.pbb_desa_kota.splice(idx, 1);
                } else {
                  vm.data.pbb_desa_kota.push(answer);
                }
                break;
            case 'bea_hak_tanah_bangunan':
                var idx = vm.data.bea_hak_tanah_bangunan.indexOf(answer);
                if (idx > -1) {
                  vm.data.bea_hak_tanah_bangunan.splice(idx, 1);
                } else {
                  vm.data.bea_hak_tanah_bangunan.push(answer);
                }
                break;
            case 'pelayanan_kesehatan':
                var idx = vm.data.pelayanan_kesehatan.indexOf(answer);
                if (idx > -1) {
                  vm.data.pelayanan_kesehatan.splice(idx, 1);
                } else {
                  vm.data.pelayanan_kesehatan.push(answer);
                }
                break;
            case 'pelayanan_kebersihan':
                var idx = vm.data.pelayanan_kebersihan.indexOf(answer);
                if (idx > -1) {
                  vm.data.pelayanan_kebersihan.splice(idx, 1);
                } else {
                  vm.data.pelayanan_kebersihan.push(answer);
                }
                break;
            case 'pelayanan_pemakaman':
                var idx = vm.data.pelayanan_pemakaman.indexOf(answer);
                if (idx > -1) {
                  vm.data.pelayanan_pemakaman.splice(idx, 1);
                } else {
                  vm.data.pelayanan_pemakaman.push(answer);
                }
                break;
            case 'parkir_jalan_umum':
                var idx = vm.data.parkir_jalan_umum.indexOf(answer);
                if (idx > -1) {
                  vm.data.parkir_jalan_umum.splice(idx, 1);
                } else {
                  vm.data.parkir_jalan_umum.push(answer);
                }
                break;
            case 'pelayanan_pasar':
                var idx = vm.data.pelayanan_pasar.indexOf(answer);
                if (idx > -1) {
                  vm.data.pelayanan_pasar.splice(idx, 1);
                } else {
                  vm.data.pelayanan_pasar.push(answer);
                }
                break;
            case 'pengujian_kendaraan_bermotor':
                var idx = vm.data.pengujian_kendaraan_bermotor.indexOf(answer);
                if (idx > -1) {
                  vm.data.pengujian_kendaraan_bermotor.splice(idx, 1);
                } else {
                  vm.data.pengujian_kendaraan_bermotor.push(answer);
                }
                break;
            case 'pemeriksaan_alat_pemadam':
                var idx = vm.data.pemeriksaan_alat_pemadam.indexOf(answer);
                if (idx > -1) {
                  vm.data.pemeriksaan_alat_pemadam.splice(idx, 1);
                } else {
                  vm.data.pemeriksaan_alat_pemadam.push(answer);
                }
                break;
            case 'biaya_cetak_peta':
                var idx = vm.data.penggantian_biaya_cetak_peta.indexOf(answer);
                if (idx > -1) {
                  vm.data.penggantian_biaya_cetak_peta.splice(idx, 1);
                } else {
                  vm.data.penggantian_biaya_cetak_peta.push(answer);
                }
                break;
            case 'penyedotan_kakus':
                var idx = vm.data.penyedotan_kakus.indexOf(answer);
                if (idx > -1) {
                  vm.data.penyedotan_kakus.splice(idx, 1);
                } else {
                  vm.data.penyedotan_kakus.push(answer);
                }
                break;
            case 'pengolahan_limbah_cair':
                var idx = vm.data.pengolahan_limbah_cair.indexOf(answer);
                if (idx > -1) {
                  vm.data.pengolahan_limbah_cair.splice(idx, 1);
                } else {
                  vm.data.pengolahan_limbah_cair.push(answer);
                }
                break;
            case 'pelayanan_tera':
                var idx = vm.data.pelayanan_tera.indexOf(answer);
                if (idx > -1) {
                  vm.data.pelayanan_tera.splice(idx, 1);
                } else {
                  vm.data.pelayanan_tera.push(answer);
                }
                break;
            case 'pelayanan_pendidikan':
                var idx = vm.data.pelayanan_pendidikan.indexOf(answer);
                if (idx > -1) {
                  vm.data.pelayanan_pendidikan.splice(idx, 1);
                } else {
                  vm.data.pelayanan_pendidikan.push(answer);
                }
                break;
            case 'pengendalian_menara_telekomunikasi':
                var idx = vm.data.pengendalian_menara_telekomunikasi.indexOf(answer);
                if (idx > -1) {
                  vm.data.pengendalian_menara_telekomunikasi.splice(idx, 1);
                } else {
                  vm.data.pengendalian_menara_telekomunikasi.push(answer);
                }
                break;
            case 'pengendalian_lalu_lintas':
                var idx = vm.data.pengendalian_lalu_lintas.indexOf(answer);
                if (idx > -1) {
                  vm.data.pengendalian_lalu_lintas.splice(idx, 1);
                } else {
                  vm.data.pengendalian_lalu_lintas.push(answer);
                }
                break;
            case 'pemakaian_kekayaan_daerah':
                var idx = vm.data.pemakaian_kekayaan_daerah.indexOf(answer);
                if (idx > -1) {
                  vm.data.pemakaian_kekayaan_daerah.splice(idx, 1);
                } else {
                  vm.data.pemakaian_kekayaan_daerah.push(answer);
                }
                break;
            case 'pasar_grosir':
                var idx = vm.data.pasar_grosir.indexOf(answer);
                if (idx > -1) {
                  vm.data.pasar_grosir.splice(idx, 1);
                } else {
                  vm.data.pasar_grosir.push(answer);
                }
                break;
            case 'tempat_pelelangan':
                var idx = vm.data.tempat_pelelangan.indexOf(answer);
                if (idx > -1) {
                  vm.data.tempat_pelelangan.splice(idx, 1);
                } else {
                  vm.data.tempat_pelelangan.push(answer);
                }
                break;
            case 'terminal':
                var idx = vm.data.terminal.indexOf(answer);
                if (idx > -1) {
                  vm.data.terminal.splice(idx, 1);
                } else {
                  vm.data.terminal.push(answer);
                }
                break;
            case 'tempat_khusus_parkir':
                var idx = vm.data.tempat_khusus_parkir.indexOf(answer);
                if (idx > -1) {
                  vm.data.tempat_khusus_parkir.splice(idx, 1);
                } else {
                  vm.data.tempat_khusus_parkir.push(answer);
                }
                break;
            case 'tempat_penginapan':
                var idx = vm.data.tempat_penginapan.indexOf(answer);
                if (idx > -1) {
                  vm.data.tempat_penginapan.splice(idx, 1);
                } else {
                  vm.data.tempat_penginapan.push(answer);
                }
                break;
            case 'rumah_potong_hewan':
                var idx = vm.data.rumah_potong_hewan.indexOf(answer);
                if (idx > -1) {
                  vm.data.rumah_potong_hewan.splice(idx, 1);
                } else {
                  vm.data.rumah_potong_hewan.push(answer);
                }
                break;
            case 'pelayanan_pelabuhan':
                var idx = vm.data.pelayanan_pelabuhan.indexOf(answer);
                if (idx > -1) {
                  vm.data.pelayanan_pelabuhan.splice(idx, 1);
                } else {
                  vm.data.pelayanan_pelabuhan.push(answer);
                }
                break;
            case 'tempat_rekreasi':
                var idx = vm.data.tempat_rekreasi.indexOf(answer);
                if (idx > -1) {
                  vm.data.tempat_rekreasi.splice(idx, 1);
                } else {
                  vm.data.tempat_rekreasi.push(answer);
                }
                break;
            case 'penyebrangan_diair':
                var idx = vm.data.penyebrangan_diair.indexOf(answer);
                if (idx > -1) {
                  vm.data.penyebrangan_diair.splice(idx, 1);
                } else {
                  vm.data.penyebrangan_diair.push(answer);
                }
                break;
            case 'penjualan_produksi_usaha':
                var idx = vm.data.penjualan_produksi_usaha.indexOf(answer);
                if (idx > -1) {
                  vm.data.penjualan_produksi_usaha.splice(idx, 1);
                } else {
                  vm.data.penjualan_produksi_usaha.push(answer);
                }
                break;
            case 'izin_persetujuan_bangunan':
                var idx = vm.data.izin_persetujuan_bangunan.indexOf(answer);
                if (idx > -1) {
                  vm.data.izin_persetujuan_bangunan.splice(idx, 1);
                } else {
                  vm.data.izin_persetujuan_bangunan.push(answer);
                }
                break;
            case 'izin_tempat_penjualan_minuman':
                var idx = vm.data.izin_tempat_penjualan_minuman.indexOf(answer);
                if (idx > -1) {
                  vm.data.izin_tempat_penjualan_minuman.splice(idx, 1);
                } else {
                  vm.data.izin_tempat_penjualan_minuman.push(answer);
                }
                break;
            case 'izin_trayek':
                var idx = vm.data.izin_trayek.indexOf(answer);
                if (idx > -1) {
                  vm.data.izin_trayek.splice(idx, 1);
                } else {
                  vm.data.izin_trayek.push(answer);
                }
                break;
            case 'izin_usaha_perikanan':
                var idx = vm.data.izin_usaha_perikanan.indexOf(answer);
                if (idx > -1) {
                  vm.data.izin_usaha_perikanan.splice(idx, 1);
                } else {
                  vm.data.izin_usaha_perikanan.push(answer);
                }
                break;
            case 'perpanjangan_imta':
                var idx = vm.data.perpanjangan_imta.indexOf(answer);
                if (idx > -1) {
                  vm.data.perpanjangan_imta.splice(idx, 1);
                } else {
                  vm.data.perpanjangan_imta.push(answer);
                }
                break;
            case 'sistem_informasi_pendapatan_daerah':
                var idx = vm.data.sistem_informasi_pendapatan_daerah.indexOf(answer);
                if (idx > -1) {
                  vm.data.sistem_informasi_pendapatan_daerah.splice(idx, 1);
                } else {
                  vm.data.sistem_informasi_pendapatan_daerah.push(answer);
                }
                break;
            case 'sistem_informasi_belanja_daerah':
                var idx = vm.data.sistem_informasi_belanja_daerah.indexOf(answer);
                if (idx > -1) {
                  vm.data.sistem_informasi_belanja_daerah.splice(idx, 1);
                } else {
                  vm.data.sistem_informasi_belanja_daerah.push(answer);
                }
                break;
            case 'kerjasama_pemungutan_pajak':
                var idx = vm.data.kerjasama_pemungutan_pajak.indexOf(answer);
                if (idx > -1) {
                  vm.data.kerjasama_pemungutan_pajak.splice(idx, 1);
                } else {
                  vm.data.kerjasama_pemungutan_pajak.push(answer);
                }
                break;
            case 'kendala_pelaksanaan_etpd':
                var idx = vm.data.kendala_pelaksanaan_etpd.indexOf(answer);
                if (idx > -1) {
                  vm.data.kendala_pelaksanaan_etpd.splice(idx, 1);
                } else {
                  vm.data.kendala_pelaksanaan_etpd.push(answer);
                }
                break;
            default:
                console.log("no option");
                break;
        }
      };
    
      function disableSave() {
        if (vm.periode.mandatori) {
          if (
            vm.data.email &&
            vm.data.tingkat_pemerintah_daerah &&
            vm.data.nama_daerah &&
            vm.data.kpwdn &&
            vm.data.nama_petugas &&
            vm.data.nip &&
            vm.data.nomor_kontak &&
            vm.data.total_target_pendapatan_asli_daerah &&
            vm.data.total_realisasi_pendapatan_asli_daerah &&
            vm.data.total_pagu_belanja_daerah &&
            vm.data.total_realisasi_belanja_daerah &&
            vm.data.belanja_pegawai_langsung &&
            vm.data.belanja_barang_dan_jasa_langsung &&
            vm.data.belanja_modal_langsung &&
            vm.data.belanja_pegawai_tidak_langsung &&
            vm.data.belanja_bunga_tidak_langsung &&
            vm.data.belanja_subsidi_tidak_langsung &&
            vm.data.belanja_hibah_tidak_langsung &&
            vm.data.belanja_bantuan_sosial_tidak_langsung &&
            vm.data.belanja_bagi_hasil_tidak_langsung &&
            vm.data.belanja_bantuan_keuangan_tidak_langsung &&
            vm.data.belanja_tidak_terduga_tidak_langsung &&
            vm.data.pelayanan_kesehatan.length > 0 &&
            vm.data.pelayanan_kebersihan.length > 0 &&
            vm.data.pelayanan_pemakaman.length > 0 &&
            vm.data.parkir_jalan_umum.length > 0 &&
            vm.data.pelayanan_pasar.length > 0 &&
            vm.data.pengujian_kendaraan_bermotor.length > 0 &&
            vm.data.pemeriksaan_alat_pemadam.length > 0 &&
            vm.data.penggantian_biaya_cetak_peta.length > 0 &&
            vm.data.penyedotan_kakus.length > 0 &&
            vm.data.pengolahan_limbah_cair.length > 0 &&
            vm.data.pelayanan_tera.length > 0 &&
            vm.data.pelayanan_pendidikan.length > 0 &&
            vm.data.pengendalian_menara_telekomunikasi.length > 0 &&
            vm.data.pengendalian_lalu_lintas.length > 0 &&
            vm.data.pemakaian_kekayaan_daerah.length > 0 &&
            vm.data.pasar_grosir.length > 0 &&
            vm.data.tempat_pelelangan.length > 0 &&
            vm.data.terminal.length > 0 &&
            vm.data.tempat_khusus_parkir.length > 0 &&
            vm.data.tempat_penginapan.length > 0 &&
            vm.data.rumah_potong_hewan.length > 0 &&
            vm.data.pelayanan_pelabuhan.length > 0 &&
            vm.data.tempat_rekreasi.length > 0 &&
            vm.data.penyebrangan_diair.length > 0 &&
            vm.data.penjualan_produksi_usaha.length > 0 &&
            vm.data.izin_persetujuan_bangunan.length > 0 &&
            vm.data.izin_tempat_penjualan_minuman.length > 0 &&
            vm.data.izin_trayek.length > 0 &&
            vm.data.izin_usaha_perikanan.length > 0 &&
            vm.data.perpanjangan_imta.length > 0 &&
            vm.data.teller_loket_bank &&
            vm.data.agen_bank &&
            vm.data.atm &&
            vm.data.edc &&
            vm.data.uereader &&
            vm.data.internet_mobile_sms_banking &&
            vm.data.qris &&
            vm.data.ecommerce &&
            vm.data.nama_bank_rkud &&
            vm.data.sistem_informasi_pendapatan_daerah.length > 0 &&
            vm.data.sistem_informasi_belanja_daerah.length > 0 &&
            vm.data.sp2d_online &&
            vm.data.integrasi_cms &&
            vm.data.integrasi_cms_dengan_pemda &&
            vm.data.regulasi_elektronifikasi &&
            vm.data.sosialisasi_pembayaran_nontunai &&
            vm.data.rencana_pengembangan_etpd &&
            vm.data.blankspot &&
            vm.data.jaringan_2g &&
            vm.data.jaringan_3g &&
            vm.data.jaringan_4g &&
            vm.data.kerjasama_pemungutan_pajak.length > 0 &&
            vm.data.kendala_pelaksanaan_etpd.length > 0 &&
            vm.data.telah_membentuk_tp2dd &&
            vm.data.dibantu_oleh_bank
          ) {
            if (isProv()) {
              if (
                vm.data.kendaraan_bermotor.length > 0 &&
                vm.data.bea_balik_nama_kendaraan_bermotor.length > 0 &&
                vm.data.bahan_bakar_kendaraan_bermotor.length > 0 &&
                vm.data.air_permukaan.length > 0 &&
                vm.data.rokok.length > 0
              ) {
                return false;
              } else {
                return true;
              }
            } else {
              if (
                vm.data.hotel.length > 0 &&
                vm.data.restoran.length > 0 &&
                vm.data.hiburan.length > 0 &&
                vm.data.reklame.length > 0 &&
                vm.data.penerangan_jalan.length > 0 &&
                vm.data.mineral_bukan_logam.length > 0 &&
                vm.data.parkir.length > 0 &&
                vm.data.air_tanah.length > 0 &&
                vm.data.sarang_burung_walet.length > 0 &&
                vm.data.pbb_desa_kota.length > 0 &&
                vm.data.bea_hak_tanah_bangunan.length > 0
              ) {
                return false;
              } else {
                return true;
              }
            }
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      }
  }
})();