-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 17 Agu 2022 pada 12.16
-- Versi server: 10.4.22-MariaDB
-- Versi PHP: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mecha`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `menu`
--

CREATE TABLE `menu` (
  `menu_id` int(10) UNSIGNED NOT NULL,
  `module_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `required` varchar(100) DEFAULT NULL,
  `modulePath` varchar(100) DEFAULT NULL,
  `featureStatus` varchar(50) DEFAULT NULL,
  `triggerMsg` varchar(100) DEFAULT NULL,
  `responseJSON` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `menu`
--

INSERT INTO `menu` (`menu_id`, `module_id`, `name`, `description`, `required`, `modulePath`, `featureStatus`, `triggerMsg`, `responseJSON`) VALUES
(1, 1, 'Menu', 'Show all menu items in Mechabot', '[\"\"]', '1.menu.ts', 'active', 'menu', '{\"module_id\":1,\"name\":\"Menu\",\"description\":\"Show all menu items in Mechabot\",\"required\":\"[\\\"\\\"]\",\"modulePath\":\"1.menu.ts\",\"featureStatus\":\"active\",\"triggerMsg\":\"menu\"}'),
(2, 2, 'Evaluate', 'Execute script code', '[\"link yt\"]', '2.eval.ts', 'maintenance', '>>> ', '{\"module_id\":2,\"name\":\"Evaluate\",\"description\":\"Execute script code\",\"required\":\"[\\\"link yt\\\"]\",\"modulePath\":\"2.eval.ts\",\"featureStatus\":\"maintenance\",\"triggerMsg\":\">>> \"}'),
(3, 3, 'Instagram Downloader', 'All instagram downloader, post, reels, and story, etc.', '[\"link insta\"]', '3.instagram.ts', 'maintenance', 'instagram|ig|insta|igstory|reels|tst', '{\"module_id\":3,\"name\":\"Instagram Downloader\",\"description\":\"All instagram downloader, post, reels, and story, etc.\",\"required\":\"[\\\"link insta\\\"]\",\"modulePath\":\"3.instagram.ts\",\"featureStatus\":\"maintenance\",\"triggerMsg\":\"instagram|ig|insta|igstory|reels|tst\"}'),
(4, 4, 'Youtube Search', 'Youtube video/audio Search', '[\"\"]', '4.youtubeSearch.ts', 'active', 'ytsearch', '{\"module_id\":4,\"name\":\"Youtube Search\",\"description\":\"Youtube video/audio Search\",\"required\":\"[\\\"\\\"]\",\"modulePath\":\"4.youtubeSearch.ts\",\"featureStatus\":\"active\",\"triggerMsg\":\"ytsearch\"}'),
(5, 5, 'Youtube Downloader', 'Youtube video/audio and story download', '[\"link yt\"]', '5.youtubeDownload.ts', 'active', 'ytdownload|yta|ytv|ytdl', '{\"module_id\":5,\"name\":\"Youtube Downloader\",\"description\":\"Youtube video/audio and story download\",\"required\":\"[\\\"link yt\\\"]\",\"modulePath\":\"5.youtubeDownload.ts\",\"featureStatus\":\"active\",\"triggerMsg\":\"ytdownload|yta|ytv|ytdl\"}'),
(6, 6, 'Youtube Play', 'Play Music from YouTube', '[\"query\"]', '6.youtubePlay.ts', 'active', 'ytplay|play', '{\"module_id\":6,\"name\":\"Youtube Play\",\"description\":\"Play Music from YouTube\",\"required\":\"[\\\"query\\\"]\",\"modulePath\":\"6.youtubePlay.ts\",\"featureStatus\":\"active\",\"triggerMsg\":\"ytplay|play\"}');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_input`
--

CREATE TABLE `user_input` (
  `id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `jid` varchar(255) DEFAULT NULL,
  `feature` varchar(255) DEFAULT NULL,
  `input_type` varchar(255) DEFAULT NULL,
  `is_input` varchar(255) DEFAULT NULL,
  `value` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `user_input`
--

INSERT INTO `user_input` (`id`, `created_at`, `jid`, `feature`, `input_type`, `is_input`, `value`) VALUES
(8, '2022-08-17 04:00:00', '120363042299104259@g.us', '4.youtubeSearch.ts#10323', 'keyword', 'T', 'new divide'),
(9, '2022-08-17 04:46:16', '120363042299104259@g.us', '4.youtubeSearch.ts#08563', 'keyword', 'T', 'mundur lalaunan'),
(10, '2022-08-17 04:50:56', '120363042299104259@g.us', '4.youtubeSearch.ts#57567', 'keyword', 'T', '.ytsearch'),
(11, '2022-08-17 04:54:21', '120363042299104259@g.us', '4.youtubeSearch.ts#62142', 'keyword', 'T', '.ytsearch'),
(12, '2022-08-17 04:56:37', '120363042299104259@g.us', '4.youtubeSearch.ts#10484', 'keyword', 'T', 'entah apa yang merasukimu'),
(13, '2022-08-17 04:57:18', '120363042299104259@g.us', '4.youtubeSearch.ts#38080', 'keyword', 'T', '.ytsearch n3x7p4g3 2 {\"nextPageToken\":\"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8\",\"nextPageContext\":{\"context\":{\"client\":{\"hl\":\"id\",\"gl\":\"ID\",\"remoteHost\":\"2001:448a:3024:32be:25de:aaf2:d8a5:bb4c\",\"deviceMake\":\"\",\"deviceModel\":\"\",\"visitorData\":\"Cgt6eGNieEVqclNqMCiS6vGXBg%3D%3D\",\"userAgent\":\"axios/0.26.1,gzip(gfe)\",\"clientName\":\"WEB\",\"clientVersion\":\"2.20220816.00.00\",\"osName\":\"\",\"osVersion\":\"\",\"originalUrl\":\"https://www.youtube.com/results?search_query=entah+apa+yang+merasukimu\",\"platform\":\"DESKTOP\",\"clientFormFactor\":\"UNKNOWN_FORM_FACTOR\",\"configInfo\":{\"appInstallData\":\"CJLq8ZcGEMuirgUQ4bmuBRDVsa4FEK-zrgUQk6-uBRD8uq4FELfLrQUQuIuuBRDUg64FEMvs_RIQjcr9EhDC_P0SENi-rQUQkfj8Eg%3D%3D\"}},\"user\":{\"lockedSafetyMode\":false},\"request\":{\"useSsl\":true},\"clickTracking\":{\"clickTrackingParams\":\"IhMIza+Xi4vN+QIVOc2gAh37HQ+Q\"}},\"continuation\":\"EqgDEhllbnRhaCBhcGEgeWFuZyBtZXJhc3VraW11GooDU0JTQ0FRdDFORmREUTBrMFNtMVdkNElCQ3kwemJVVnBPVWx0UkZaSmdnRUxWSG96ZFV0aGVDMURXVVdDQVF0VVVuZHVaRkJmZVZvM05JSUJDMGgyUm1GM2FVOWlRMnhaZ2dFTFpFRkhXbVpTVm1Nd1FrV0NBUXRFU0daMFYyWk1TVXRCYzRJQkMxUXdNbFpYYVc1ZmVUVnJnZ0VMVDAxNE9FOURiMHhQV2xXQ0FRdFJNR1ZtYVVOR01uVkxkNElCQzNwZk0zQTJiRk5HUzB4cmdnRUxObmxJUjBSZk0zcG1kbXVDQVF0U04yUnVjMFJ2UzBFNVdZSUJDMkpOTFRoTmFFazJiRkJSZ2dFTGFGUkdVMkoxWHpaeFNHLUNBUTFTUkhVMFYwTkRTVFJLYlZaM2dnRUxRbUZNVERSSVUzSkJVRUdDQVF0T2FHVjFObEV3VUhoSmQ0SUJDMEpPWkZkdFpqa3pOVzlOZ2dFTE5uYzNjMHRGVkhOVU9WbXlBUVlLQkFnVkVBSSUzRBiB4OgYIgtzZWFyY2gtZmVlZA%3D%3D\"}}'),
(14, '2022-08-17 05:01:04', '120363042299104259@g.us', '4.youtubeSearch.ts#65381', 'keyword', 'T', '.ytsearch n3x7p4g3 2 {\"nextPageToken\":\"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8\",\"nextPageContext\":{\"context\":{\"client\":{\"hl\":\"id\",\"gl\":\"ID\",\"remoteHost\":\"2001:448a:3024:32be:25de:aaf2:d8a5:bb4c\",\"deviceMake\":\"\",\"deviceModel\":\"\",\"visitorData\":\"Cgt6eGNieEVqclNqMCiS6vGXBg%3D%3D\",\"userAgent\":\"axios/0.26.1,gzip(gfe)\",\"clientName\":\"WEB\",\"clientVersion\":\"2.20220816.00.00\",\"osName\":\"\",\"osVersion\":\"\",\"originalUrl\":\"https://www.youtube.com/results?search_query=entah+apa+yang+merasukimu\",\"platform\":\"DESKTOP\",\"clientFormFactor\":\"UNKNOWN_FORM_FACTOR\",\"configInfo\":{\"appInstallData\":\"CJLq8ZcGEMuirgUQ4bmuBRDVsa4FEK-zrgUQk6-uBRD8uq4FELfLrQUQuIuuBRDUg64FEMvs_RIQjcr9EhDC_P0SENi-rQUQkfj8Eg%3D%3D\"}},\"user\":{\"lockedSafetyMode\":false},\"request\":{\"useSsl\":true},\"clickTracking\":{\"clickTrackingParams\":\"IhMIza+Xi4vN+QIVOc2gAh37HQ+Q\"}},\"continuation\":\"EqgDEhllbnRhaCBhcGEgeWFuZyBtZXJhc3VraW11GooDU0JTQ0FRdDFORmREUTBrMFNtMVdkNElCQ3kwemJVVnBPVWx0UkZaSmdnRUxWSG96ZFV0aGVDMURXVVdDQVF0VVVuZHVaRkJmZVZvM05JSUJDMGgyUm1GM2FVOWlRMnhaZ2dFTFpFRkhXbVpTVm1Nd1FrV0NBUXRFU0daMFYyWk1TVXRCYzRJQkMxUXdNbFpYYVc1ZmVUVnJnZ0VMVDAxNE9FOURiMHhQV2xXQ0FRdFJNR1ZtYVVOR01uVkxkNElCQzNwZk0zQTJiRk5HUzB4cmdnRUxObmxJUjBSZk0zcG1kbXVDQVF0U04yUnVjMFJ2UzBFNVdZSUJDMkpOTFRoTmFFazJiRkJSZ2dFTGFGUkdVMkoxWHpaeFNHLUNBUTFTUkhVMFYwTkRTVFJLYlZaM2dnRUxRbUZNVERSSVUzSkJVRUdDQVF0T2FHVjFObEV3VUhoSmQ0SUJDMEpPWkZkdFpqa3pOVzlOZ2dFTE5uYzNjMHRGVkhOVU9WbXlBUVlLQkFnVkVBSSUzRBiB4OgYIgtzZWFyY2gtZmVlZA%3D%3D\"}}'),
(15, '2022-08-17 05:08:10', '120363042299104259@g.us', '4.youtubeSearch.ts#05207', 'keyword', 'T', 'duka'),
(16, '2022-08-17 06:04:49', '120363042299104259@g.us', '4.youtubeSearch.ts#94962', 'keyword', 'T', 'new divide'),
(17, '2022-08-17 07:24:19', '120363042299104259@g.us', '4.youtubeSearch.ts#73583', 'keyword', 'T', 'cinta terlarang cover'),
(18, '2022-08-17 07:31:23', '120363042299104259@g.us', '4.youtubeSearch.ts#93095', 'keyword', 'T', 'numb'),
(19, '2022-08-17 07:34:28', '120363042299104259@g.us', '4.youtubeSearch.ts#73695', 'keyword', 'T', 'numb'),
(20, '2022-08-17 07:46:39', '120363042299104259@g.us', '4.youtubeSearch.ts#03845', 'keyword', 'T', 'numb'),
(21, '2022-08-17 08:42:47', '120363042299104259@g.us', '6.youtubePlay.ts#05185', 'keyword', 'T', 'ketika mimpimu'),
(23, '2022-08-17 09:08:50', '120363042299104259@g.us', '6.youtubePlay.ts#32154', 'keyword', 'T', '.play'),
(27, '2022-08-17 09:25:20', '120363042299104259@g.us_6285559038021', '6.youtubePlay.ts#25031', 'keyword', 'T', 'ketika mimpimuuu'),
(28, '2022-08-17 09:30:58', '120363042299104259@g.us_6285559038021', '6.youtubePlay.ts#63157', 'keyword', 'T', 'ckc'),
(29, '2022-08-17 09:50:04', '120363042299104259@g.us_6285559038021', '4.youtubeSearch.ts#18886', 'keyword', 'T', 'sejujurnya kutak bisa'),
(30, '2022-08-17 09:57:04', '6285559038021-1613222785@g.us_201556875939', '4.youtubeSearch.ts#42213', 'keyword', 'T', 'Youtube الديبو'),
(31, '2022-08-17 10:02:38', '6285559038021-1613222785@g.us_201556875939', '4.youtubeSearch.ts#86494', 'keyword', 'T', 'Youtube الديبو Search');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`menu_id`);

--
-- Indeks untuk tabel `user_input`
--
ALTER TABLE `user_input`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `menu`
--
ALTER TABLE `menu`
  MODIFY `menu_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `user_input`
--
ALTER TABLE `user_input`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
