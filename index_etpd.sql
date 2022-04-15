--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: index_etpd; Type: TABLE; Schema: public; Owner: hakase
--

CREATE TABLE public.index_etpd (
    id bigint NOT NULL,
    instansi_id bigint NOT NULL,
    periode_id bigint,
    status character varying(20) DEFAULT 'draft'::character varying,
    email text,
    nama_petugas text,
    nip text,
    nomor_kontak text,
    total_target_pendapatan_asli_daerah text,
    total_realisasi_pendapatan_asli_daerah text,
    total_target_pajak_daerah text,
    total_realisasi_pajak_daerah text,
    total_target_retribusi_daerah text,
    total_realisasi_retribusi_daerah text,
    total_pagu_belanja_daerah text,
    total_realisasi_belanja_daerah text,
    total_pagu_belanja_operasi text,
    total_realisasi_belanja_operasi text,
    total_pagu_belanja_modal text,
    total_realisasi_belanja_modal text,
    total_pagu_belanja_tidak_terduga text,
    total_realisasi_belanja_tidak_terduga text,
    total_pagu_belanja_transfer text,
    belanja_pegawai_langsung text,
    belanja_barang_dan_jasa_langsung text,
    belanja_modal_langsung text,
    belanja_pegawai_tidak_langsung text,
    belanja_bunga_tidak_langsung text,
    belanja_subsidi_tidak_langsung text,
    belanja_hibah_tidak_langsung text,
    belanja_bantuan_sosial_tidak_langsung text,
    belanja_bagi_hasil_tidak_langsung text,
    belanja_bantuan_keuangan_tidak_langsung text,
    belanja_tidak_terduga_tidak_langsung text,
    kendaraan_bermotor text,
    bea_balik_nama_kendaraan_bermotor text,
    bahan_bakar_kendaraan_bermotor text,
    air_permukaan text,
    rokok text,
    hotel text,
    restoran text,
    hiburan text,
    reklame text,
    penerangan_jalan text,
    mineral_bukan_logam text,
    parkir text,
    air_tanah text,
    sarang_burung_walet text,
    pbb_desa_kota text,
    bea_hak_tanah_bangunan text,
    pelayanan_kesehatan text,
    pelayanan_kebersihan text,
    pelayanan_pemakaman text,
    parkir_jalan_umum text,
    pelayanan_pasar text,
    pengujian_kendaraan_bermotor text,
    pemeriksaan_alat_pemadam text,
    penggantian_biaya_cetak_peta text,
    penyedotan_kakus text,
    pengolahan_limbah_cair text,
    pelayanan_tera text,
    pelayanan_pendidikan text,
    pengendalian_menara_telekomunikasi text,
    pengendalian_lalu_lintas text,
    pemakaian_kekayaan_daerah text,
    pasar_grosir text,
    tempat_pelelangan text,
    terminal text,
    tempat_khusus_parkir text,
    tempat_penginapan text,
    rumah_potong_hewan text,
    pelayanan_pelabuhan text,
    tempat_rekreasi text,
    penyebrangan_diair text,
    penjualan_produksi_usaha text,
    izin_persetujuan_bangunan text,
    izin_tempat_penjualan_minuman text,
    izin_trayek text,
    izin_usaha_perikanan text,
    perpanjangan_imta text,
    teller_loket_bank text,
    agen_bank text,
    atm text,
    edc text,
    uereader text,
    internet_mobile_sms_banking text,
    qris text,
    ecommerce text,
    nama_bank_rkud text,
    total_pajak_daerah_dari_qris text,
    total_pajak_daerah_dari_non_digital text,
    total_pajak_daerah_dari_atm text,
    total_pajak_daerah_dari_edc text,
    total_pajak_daerah_dari_internet text,
    total_pajak_daerah_dari_agen_bank text,
    total_pajak_daerah_dari_uereader text,
    total_pajak_daerah_dari_ecommerce text,
    total_retribusi_daerah_dari_qris text,
    total_retribusi_daerah_dari_non_digital text,
    total_retribusi_daerah_dari_atm text,
    total_retribusi_daerah_dari_edc text,
    total_retribusi_daerah_dari_internet text,
    total_retribusi_daerah_dari_agen_bank text,
    total_retribusi_daerah_dari_uereader text,
    total_retribusi_daerah_dari_ecommerce text,
    sistem_informasi_pendapatan_daerah text,
    sistem_informasi_belanja_daerah text,
    integrasi_sipd text,
    sp2d_online text,
    integrasi_cms text,
    integrasi_cms_dengan_pemda text,
    regulasi_elektronifikasi text,
    regulasi_yang_dimiliki text,
    sosialisasi_pembayaran_nontunai text,
    rencana_pengembangan_etpd text,
    blankspot text,
    wilayah_blankspot text,
    jaringan_2g text,
    jaringan_3g text,
    jaringan_4g text,
    kerjasama_pemungutan_pajak text,
    kendala_pelaksanaan_etpd text,
    telah_membentuk_tp2dd text,
    landasan_hukum_pembentukan_tp2dd text,
    dibantu_oleh_bank text,
    dibuat_oleh character varying(25),
    tgl_dibuat date,
    diubah_oleh character varying(25),
    tgl_diubah date,
    total_realisasi_belanja_transfer text,
    sistem_informasi_pendapatan_daerah_other text,
    sistem_informasi_belanja_daerah_other text,
    kendala_pelaksanaan_etpd_other text,
    kerjasama_pemungutan_pajak_other text
);


ALTER TABLE public.index_etpd OWNER TO hakase;

--
-- Name: COLUMN index_etpd.status; Type: COMMENT; Schema: public; Owner: hakase
--

COMMENT ON COLUMN public.index_etpd.status IS 'draft | proses | selesai';


--
-- Name: index_etpd_id_seq; Type: SEQUENCE; Schema: public; Owner: hakase
--

CREATE SEQUENCE public.index_etpd_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.index_etpd_id_seq OWNER TO hakase;

--
-- Name: index_etpd_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hakase
--

ALTER SEQUENCE public.index_etpd_id_seq OWNED BY public.index_etpd.id;


--
-- Name: index_etpd id; Type: DEFAULT; Schema: public; Owner: hakase
--

ALTER TABLE ONLY public.index_etpd ALTER COLUMN id SET DEFAULT nextval('public.index_etpd_id_seq'::regclass);


--
-- Name: index_etpd index_etpd_pkey; Type: CONSTRAINT; Schema: public; Owner: hakase
--

ALTER TABLE ONLY public.index_etpd
    ADD CONSTRAINT index_etpd_pkey PRIMARY KEY (id);


--
-- Name: index_etpd_dibuat_oleh; Type: INDEX; Schema: public; Owner: hakase
--

CREATE INDEX index_etpd_dibuat_oleh ON public.index_etpd USING btree (dibuat_oleh);


--
-- Name: index_etpd_diubah_oleh; Type: INDEX; Schema: public; Owner: hakase
--

CREATE INDEX index_etpd_diubah_oleh ON public.index_etpd USING btree (diubah_oleh);


--
-- Name: index_etpd_instansi_id; Type: INDEX; Schema: public; Owner: hakase
--

CREATE INDEX index_etpd_instansi_id ON public.index_etpd USING btree (instansi_id);


--
-- Name: index_etpd_periode_id; Type: INDEX; Schema: public; Owner: hakase
--

CREATE INDEX index_etpd_periode_id ON public.index_etpd USING btree (periode_id);


--
-- Name: index_etpd_status; Type: INDEX; Schema: public; Owner: hakase
--

CREATE INDEX index_etpd_status ON public.index_etpd USING btree (status);


--
-- Name: index_etpd_tgl_dibuat; Type: INDEX; Schema: public; Owner: hakase
--

CREATE INDEX index_etpd_tgl_dibuat ON public.index_etpd USING btree (tgl_dibuat);


--
-- Name: index_etpd_tgl_diubah; Type: INDEX; Schema: public; Owner: hakase
--

CREATE INDEX index_etpd_tgl_diubah ON public.index_etpd USING btree (tgl_diubah);


--
-- PostgreSQL database dump complete
--

