-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 16. 03:41
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `lexhub`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `conversation`
--

CREATE TABLE `conversation` (
  `id` int(11) NOT NULL,
  `seekerId` int(11) NOT NULL,
  `providerId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `conversation`
--

INSERT INTO `conversation` (`id`, `seekerId`, `providerId`) VALUES
(1, 1, 11);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `lawyertype`
--

CREATE TABLE `lawyertype` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `lawyertype`
--

INSERT INTO `lawyertype` (`id`, `type`) VALUES
(1, 'Büntetőjogász'),
(2, 'Védőügyvéd'),
(3, 'Polgári jogász'),
(4, 'Ingatlanjogász'),
(5, 'Munkajogász'),
(6, 'Családjogi ügyvéd'),
(7, 'Kártérítési ügyvéd'),
(8, 'Közigazgatási jogász'),
(9, 'Alkotmányjogász'),
(10, 'Nemzetközi jogász'),
(11, 'Kereskedelmi jogász'),
(12, 'Adójogász'),
(13, 'Versenyjogász'),
(14, 'Szellemi tulajdonjogász'),
(15, 'Közbeszerzési jogász'),
(16, 'Egészségügyi jogász'),
(17, 'Környezetvédelmi jogász'),
(18, 'Emberi jogi jogász'),
(19, 'Sportjogász'),
(20, 'IT- és adatvédelmi jogász'),
(21, 'Mediátor (jogi végzettséggel)'),
(22, 'Választottbíró'),
(23, 'Bankjogász'),
(24, 'Társasági jogász'),
(25, 'Fogyasztóvédelmi jogász'),
(26, 'Csődjogász'),
(27, 'Végrehajtási jogász'),
(28, 'Peres ügyvéd'),
(29, 'Közlekedési jogász'),
(30, 'Követeléskezelési ügyvéd'),
(31, 'Kártérítési és biztosítási jogász'),
(32, 'Szerzői jogi ügyvéd'),
(33, 'Orvosi műhibaperekkel foglalkozó ügyvéd'),
(34, 'Öröklési jogász'),
(35, 'Egyesületi és alapítványi jogász'),
(36, 'Oktatási jogász');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `conversationId` int(11) NOT NULL,
  `senderId` int(11) NOT NULL,
  `receiverId` int(11) NOT NULL,
  `text` text NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isEdited` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `message`
--

INSERT INTO `message` (`id`, `conversationId`, `senderId`, `receiverId`, `text`, `createdAt`, `isEdited`) VALUES
(1, 1, 1, 11, 'Jó napot Kívánok!', '2025-04-16 03:07:25', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `userprovider`
--

CREATE TABLE `userprovider` (
  `id` int(11) NOT NULL,
  `userType` enum('provider') DEFAULT 'provider',
  `providerType` enum('individual','company') NOT NULL,
  `name` varchar(255) NOT NULL,
  `companyName` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `kasz` varchar(50) NOT NULL,
  `specs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specs`)),
  `lat` decimal(10,6) DEFAULT NULL,
  `lng` decimal(10,6) DEFAULT NULL,
  `county` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `userprovider`
--

INSERT INTO `userprovider` (`id`, `userType`, `providerType`, `name`, `companyName`, `email`, `phone`, `country`, `city`, `password`, `kasz`, `specs`, `lat`, `lng`, `county`) VALUES
(1, 'provider', 'individual', 'Teszt Ügyvéd 1', NULL, 'provider1@test.hu', '06-20-4491160', 'Hungary', 'Veszprém', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-1', '[14,20]', 47.497900, 19.040200, 'Borsod-Abaúj-Zemplén'),
(2, 'provider', 'individual', 'Teszt Ügyvéd 2', NULL, 'provider2@test.hu', '06-20-9127717', 'Hungary', 'Békéscsaba', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-2', '[19,9]', 47.497900, 19.040200, 'Szabolcs-Szatmár-Bereg'),
(3, 'provider', 'individual', 'Teszt Ügyvéd 3', NULL, 'provider3@test.hu', '06-20-6468161', 'Hungary', 'Eger', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-3', '[5,1]', 47.497900, 19.040200, 'Veszprém'),
(4, 'provider', 'individual', 'Teszt Ügyvéd 4', NULL, 'provider4@test.hu', '06-20-3556207', 'Hungary', 'Kaposvár', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-4', '[26]', 47.497900, 19.040200, 'Békés'),
(5, 'provider', 'individual', 'Teszt Ügyvéd 5', NULL, 'provider5@test.hu', '06-20-3716645', 'Hungary', 'Békéscsaba', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-5', '[2]', 47.497900, 19.040200, 'Bács-Kiskun'),
(6, 'provider', 'individual', 'Teszt Ügyvéd 6', NULL, 'provider6@test.hu', '06-20-5179655', 'Hungary', 'Székesfehérvár', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-6', '[6]', 47.497900, 19.040200, 'Baranya'),
(7, 'provider', 'individual', 'Teszt Ügyvéd 7', NULL, 'provider7@test.hu', '06-20-3353371', 'Hungary', 'Debrecen', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-7', '[16]', 47.497900, 19.040200, 'Heves'),
(8, 'provider', 'individual', 'Teszt Ügyvéd 8', NULL, 'provider8@test.hu', '06-20-6426405', 'Hungary', 'Tatabánya', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-8', '[13,1]', 47.497900, 19.040200, 'Baranya'),
(9, 'provider', 'individual', 'Teszt Ügyvéd 9', NULL, 'provider9@test.hu', '06-20-8076234', 'Hungary', 'Miskolc', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-9', '[30]', 47.497900, 19.040200, 'Tolna'),
(10, 'provider', 'individual', 'Teszt Ügyvéd 10', NULL, 'provider10@test.hu', '06-20-7252344', 'Hungary', 'Zalaegerszeg', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-10', '[15,9]', 47.497900, 19.040200, 'Pest'),
(11, 'provider', 'individual', 'Teszt Ügyvéd 11', NULL, 'provider11@test.hu', '06-20-4247140', 'Hungary', 'Szombathely', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-11', '[26]', 47.497900, 19.040200, 'Békés'),
(12, 'provider', 'individual', 'Teszt Ügyvéd 12', NULL, 'provider12@test.hu', '06-20-5228075', 'Hungary', 'Budapest', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-12', '[19]', 47.497900, 19.040200, 'Vas'),
(13, 'provider', 'individual', 'Teszt Ügyvéd 13', NULL, 'provider13@test.hu', '06-20-5316844', 'Hungary', 'Szombathely', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-13', '[30]', 47.497900, 19.040200, 'Szabolcs-Szatmár-Bereg'),
(14, 'provider', 'individual', 'Teszt Ügyvéd 14', NULL, 'provider14@test.hu', '06-20-4865059', 'Hungary', 'Nyíregyháza', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-14', '[7,15]', 47.497900, 19.040200, 'Fejér'),
(15, 'provider', 'individual', 'Teszt Ügyvéd 15', NULL, 'provider15@test.hu', '06-20-8904635', 'Hungary', 'Eger', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-15', '[17]', 47.497900, 19.040200, 'Fejér'),
(16, 'provider', 'individual', 'Teszt Ügyvéd 16', NULL, 'provider16@test.hu', '06-20-8419834', 'Hungary', 'Szeged', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-16', '[10]', 47.497900, 19.040200, 'Jász-Nagykun-Szolnok'),
(17, 'provider', 'individual', 'Teszt Ügyvéd 17', NULL, 'provider17@test.hu', '06-20-6440914', 'Hungary', 'Miskolc', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-17', '[25]', 47.497900, 19.040200, 'Hajdú-Bihar'),
(18, 'provider', 'individual', 'Teszt Ügyvéd 18', NULL, 'provider18@test.hu', '06-20-9808721', 'Hungary', 'Szeged', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-18', '[24,33]', 47.497900, 19.040200, 'Pest'),
(19, 'provider', 'individual', 'Teszt Ügyvéd 19', NULL, 'provider19@test.hu', '06-20-9617897', 'Hungary', 'Győr', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-19', '[6,11]', 47.497900, 19.040200, 'Szabolcs-Szatmár-Bereg'),
(20, 'provider', 'individual', 'Teszt Ügyvéd 20', NULL, 'provider20@test.hu', '06-20-4174584', 'Hungary', 'Székesfehérvár', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'KASZ-20', '[15,18]', 47.497900, 19.040200, 'Jász-Nagykun-Szolnok');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `userseeker`
--

CREATE TABLE `userseeker` (
  `id` int(11) NOT NULL,
  `userType` enum('seeker') DEFAULT 'seeker',
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `county` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `userseeker`
--

INSERT INTO `userseeker` (`id`, `userType`, `name`, `email`, `phone`, `country`, `city`, `password`, `county`) VALUES
(1, 'seeker', 'Teszt Seeker 1', 'seeker1@test.hu', '06-30-000-0001', 'Hungary', 'Szombathely', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'Békés'),
(2, 'seeker', 'Teszt Seeker 2', 'seeker2@test.hu', '06-30-000-0002', 'Hungary', 'Kecskemét', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'Somogy'),
(3, 'seeker', 'Teszt Seeker 3', 'seeker3@test.hu', '06-30-000-0003', 'Hungary', 'Kaposvár', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'Vas'),
(4, 'seeker', 'Teszt Seeker 4', 'seeker4@test.hu', '06-30-000-0004', 'Hungary', 'Pécs', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'Pest'),
(5, 'seeker', 'Teszt Seeker 5', 'seeker5@test.hu', '06-30-000-0005', 'Hungary', 'Debrecen', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'Komárom-Esztergom'),
(6, 'seeker', 'Teszt Seeker 6', 'seeker6@test.hu', '06-30-000-0006', 'Hungary', 'Kaposvár', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'Békés'),
(7, 'seeker', 'Teszt Seeker 7', 'seeker7@test.hu', '06-30-000-0007', 'Hungary', 'Veszprém', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'Pest'),
(8, 'seeker', 'Teszt Seeker 8', 'seeker8@test.hu', '06-30-000-0008', 'Hungary', 'Zalaegerszeg', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'Győr-Moson-Sopron'),
(9, 'seeker', 'Teszt Seeker 9', 'seeker9@test.hu', '06-30-000-0009', 'Hungary', 'Zalaegerszeg', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'Pest'),
(10, 'seeker', 'Teszt Seeker 10', 'seeker10@test.hu', '06-30-000-00010', 'Hungary', 'Kecskemét', '$2b$10$QSLIbocxmwPLDxdzLI9Qz.71OtGnfE32ldOFUPDchPwRB8IwtaUH2', 'Borsod-Abaúj-Zemplén');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_conversation_seeker` (`seekerId`),
  ADD KEY `fk_conversation_provider` (`providerId`);

--
-- A tábla indexei `lawyertype`
--
ALTER TABLE `lawyertype`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_message_convo` (`conversationId`);

--
-- A tábla indexei `userprovider`
--
ALTER TABLE `userprovider`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A tábla indexei `userseeker`
--
ALTER TABLE `userseeker`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `lawyertype`
--
ALTER TABLE `lawyertype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT a táblához `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `userprovider`
--
ALTER TABLE `userprovider`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT a táblához `userseeker`
--
ALTER TABLE `userseeker`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `conversation`
--
ALTER TABLE `conversation`
  ADD CONSTRAINT `fk_conversation_provider` FOREIGN KEY (`providerId`) REFERENCES `userprovider` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_conversation_seeker` FOREIGN KEY (`seekerId`) REFERENCES `userseeker` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `fk_message_convo` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
