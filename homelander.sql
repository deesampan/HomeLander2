--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

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
-- Name: land; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.land (
    land_id integer NOT NULL,
    land_name character varying(50),
    land_price integer
);


ALTER TABLE public.land OWNER TO postgres;

--
-- Name: land_land_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.land_land_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.land_land_id_seq OWNER TO postgres;

--
-- Name: land_land_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.land_land_id_seq OWNED BY public.land.land_id;


--
-- Name: landlord; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.landlord (
    ll_id integer NOT NULL,
    ll_name character varying(50),
    ll_password character varying(50)
);


ALTER TABLE public.landlord OWNER TO postgres;

--
-- Name: landlord_ll_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.landlord_ll_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.landlord_ll_id_seq OWNER TO postgres;

--
-- Name: landlord_ll_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.landlord_ll_id_seq OWNED BY public.landlord.ll_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(50),
    password character varying(50),
    role character varying(50)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: land land_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.land ALTER COLUMN land_id SET DEFAULT nextval('public.land_land_id_seq'::regclass);


--
-- Name: landlord ll_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landlord ALTER COLUMN ll_id SET DEFAULT nextval('public.landlord_ll_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: land; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.land (land_id, land_name, land_price) FROM stdin;
1	Engracia	98303
2	Merrill	29131
3	Ninnetta	71105
4	Cleve	1282
5	Debi	19671
6	Alis	90973
7	Harlie	95944
8	Zara	65131
9	Robin	17274
10	Nevil	50354
\.


--
-- Data for Name: landlord; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.landlord (ll_id, ll_name, ll_password) FROM stdin;
1	Melisent	Bartholin
2	Fannie	Lygo
3	Philippe	Percifull
4	Marwin	McCauley
5	Ronna	Elliott
6	Maury	Alpe
7	Adriaens	Roglieri
8	Halette	Colten
9	Fanni	Hutcheons
10	Baxter	Lago
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, name, password, role) FROM stdin;
1	Butch	Ravenshaw	Construction Worker
2	Denyse	Speares	Estimator
3	Isabelle	Towson	Construction Foreman
4	Noble	Joriot	Subcontractor
5	Florrie	O' Quirk	Engineer
6	Freddie	Britten	Project Manager
7	Alicea	Hanway	Construction Manager
8	Bryan	Caslett	Construction Worker
9	Crin	Warrilow	Project Manager
10	Tansy	Linskey	Construction Foreman
11	123	123	customer
\.


--
-- Name: land_land_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.land_land_id_seq', 1, false);


--
-- Name: landlord_ll_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.landlord_ll_id_seq', 1, false);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 11, true);


--
-- Name: land land_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.land
    ADD CONSTRAINT land_pkey PRIMARY KEY (land_id);


--
-- Name: landlord landlord_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landlord
    ADD CONSTRAINT landlord_pkey PRIMARY KEY (ll_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- PostgreSQL database dump complete
--

