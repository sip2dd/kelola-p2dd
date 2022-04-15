(function () {
    'use strict';
  
    angular
        .module('pelaporan-module')
        .controller('PelaporanViewController', PelaporanViewController);
  
    /* @ngInject */
    function PelaporanViewController($stateParams, PelaporanFactory, APP_CONFIG, EnvironmentConfig, $http) {
      var vm = this;
      var user = angular.fromJson(localStorage.getItem(APP_CONFIG.localStorageKey));
      var id = $stateParams.id;
  
      vm.kode_daerah = user.kode_daerah ? user.kode_daerah : null;
            
      vm.data = {
        id: id ? id : '',
        instansi_id: user.instansi_id,
        email: user.email
      }

      vm.answers = ['QRIS', 'ATM, EDC, Internet/Mobile/SMS Banking, Agen Bank, UE Reader, E-Commerce', 'Teller/Loket Bank', 'Tunai', 'Tidak dipungut'];
      vm.sistem = ['SIMDA', 'SIMRAL', 'SIPKD', 'SIPD', 'Belum Menggunakan Sistem', 'Other'];
      vm.kerjasama = ['Perijinan', 'Dukcapil', 'OPD Penghasil', 'Kantor BPN', 'KPP Pratama', 'Other'];
      vm.kendala_pelaksanaan = ['Komitmen Pemda', 'Kompetensi SDM Pemda', 'Minat masyarakat dalam bertransaksi nontunai', 'Infrastruktur IT dan jaringan telekomunikasi/internet', 'Infrastruktur/Layanan Perbankan', 'Other'];
      
      vm.isProv = isProv;
      vm.master_kpwdn = [];
      vm.master_provinsi = [];

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

      function stringToData() {
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

    }
  })();