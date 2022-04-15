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
-- Name: master_kpwdn; Type: TABLE; Schema: public; Owner: hakase
--

CREATE TABLE public.master_kpwdn (
    id integer NOT NULL,
    kpwdn text
);


ALTER TABLE public.master_kpwdn OWNER TO hakase;

--
-- Name: master_kpwdn_id_seq; Type: SEQUENCE; Schema: public; Owner: hakase
--

CREATE SEQUENCE public.master_kpwdn_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.master_kpwdn_id_seq OWNER TO hakase;

--
-- Name: master_kpwdn_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hakase
--

ALTER SEQUENCE public.master_kpwdn_id_seq OWNED BY public.master_kpwdn.id;


--
-- Name: master_kpwdn id; Type: DEFAULT; Schema: public; Owner: hakase
--

ALTER TABLE ONLY public.master_kpwdn ALTER COLUMN id SET DEFAULT nextval('public.master_kpwdn_id_seq'::regclass);


--
-- Data for Name: master_kpwdn; Type: TABLE DATA; Schema: public; Owner: hakase
--

INSERT INTO public.master_kpwdn VALUES (1, 'KPwDN Jawa Timur');
INSERT INTO public.master_kpwdn VALUES (2, 'KPwDN Kalimantan Barat');
INSERT INTO public.master_kpwdn VALUES (3, 'KPwDN Kalimantan Tengah');
INSERT INTO public.master_kpwdn VALUES (4, 'KPwDN Kalimantan Timur');
INSERT INTO public.master_kpwdn VALUES (5, 'KPwDN Kalimantan Utara');
INSERT INTO public.master_kpwdn VALUES (6, 'KPwDN Maluku Utara');
INSERT INTO public.master_kpwdn VALUES (7, 'KPwDN Sibolga');
INSERT INTO public.master_kpwdn VALUES (8, 'KPwDN Sulawesi Barat');
INSERT INTO public.master_kpwdn VALUES (9, 'KPwDN Sulawesi Tengah');
INSERT INTO public.master_kpwdn VALUES (10, 'KPwDN Sulawesi Utara');
INSERT INTO public.master_kpwdn VALUES (11, 'KPwDN Jawa Tengah');
INSERT INTO public.master_kpwdn VALUES (12, 'KPwDN Cirebon');
INSERT INTO public.master_kpwdn VALUES (13, 'KPwDN Riau');
INSERT INTO public.master_kpwdn VALUES (14, 'KPwDN Jawa Barat');
INSERT INTO public.master_kpwdn VALUES (15, 'KPwDN Kepulauan Bangka Belitung');
INSERT INTO public.master_kpwdn VALUES (16, 'KPwDN Sumatera Barat');
INSERT INTO public.master_kpwdn VALUES (17, 'KPwDN Solo');
INSERT INTO public.master_kpwdn VALUES (18, 'KPwDN Sumatera Utara');
INSERT INTO public.master_kpwdn VALUES (19, 'KPwDN Tasikmalaya');
INSERT INTO public.master_kpwdn VALUES (20, 'KPwDN Lampung');
INSERT INTO public.master_kpwdn VALUES (21, 'KPwDN Bengkulu');
INSERT INTO public.master_kpwdn VALUES (22, 'KPwDN Jember');
INSERT INTO public.master_kpwdn VALUES (23, 'KPwDN Gorontalo');
INSERT INTO public.master_kpwdn VALUES (24, 'KPwDN Jambi');
INSERT INTO public.master_kpwdn VALUES (25, 'KPwDN Lhokseumawe');
INSERT INTO public.master_kpwdn VALUES (26, 'KPwDN Sulawesi Tenggara');
INSERT INTO public.master_kpwdn VALUES (27, 'KPwDN Balikpapan');
INSERT INTO public.master_kpwdn VALUES (28, 'KPwDN Tegal');
INSERT INTO public.master_kpwdn VALUES (29, 'KPwDN Sulawesi Selatan');
INSERT INTO public.master_kpwdn VALUES (30, 'KPwDN DI Yogyakarta');
INSERT INTO public.master_kpwdn VALUES (31, 'KPwDN Papua');
INSERT INTO public.master_kpwdn VALUES (32, 'KPwDN Aceh');
INSERT INTO public.master_kpwdn VALUES (33, 'KPwDN DKI Jakarta');
INSERT INTO public.master_kpwdn VALUES (34, 'KPwDN Purwokerto');
INSERT INTO public.master_kpwdn VALUES (35, 'KPwDN Pematang Siantar');
INSERT INTO public.master_kpwdn VALUES (36, 'KPwDN Kalimantan Selatan');
INSERT INTO public.master_kpwdn VALUES (37, 'KPwDN Malang');
INSERT INTO public.master_kpwdn VALUES (38, 'KPwDN Banten');
INSERT INTO public.master_kpwdn VALUES (39, 'KPwDN Sumatera Selatan');
INSERT INTO public.master_kpwdn VALUES (40, 'KPwDN Maluku');
INSERT INTO public.master_kpwdn VALUES (41, 'KPwDN Kediri');
INSERT INTO public.master_kpwdn VALUES (42, 'KPwDN Papua Barat');
INSERT INTO public.master_kpwdn VALUES (43, 'KPwDN Kepulauan Riau');
INSERT INTO public.master_kpwdn VALUES (44, 'KPwDN NTB');


--
-- Name: master_kpwdn_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hakase
--

SELECT pg_catalog.setval('public.master_kpwdn_id_seq', 1, false);


--
-- Name: master_kpwdn master_kpwdn_pkey; Type: CONSTRAINT; Schema: public; Owner: hakase
--

ALTER TABLE ONLY public.master_kpwdn
    ADD CONSTRAINT master_kpwdn_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

