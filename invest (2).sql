-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 03 nov. 2025 à 05:55
-- Version du serveur : 8.2.0
-- Version de PHP : 8.1.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `invest2`
--

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `admin_id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `admins`
--

INSERT INTO `admins` (`admin_id`, `name`, `email`, `password`) VALUES
(1, 'Super Admin', 'admin@invest.com', '0192023a7bbd73250516f069df18b500'),
(2, 'Admin Tsiky', 'tsikyandriantia@gmail.com', '$2y$10$n5XenaiEfbiL4XXA0UH4Ye.jBMQihoTsCfnn8G6UhQaix6VAwd9aS'),
(3, 'Andy', 'andy@gmail.com', '$2y$10$Ef3NK1PrPP/Awr4HT7zSNuw9sXYneSBBhumELsJjodFzHK4mTdYgm');

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `client_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `adresse` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`client_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `clients`
--

INSERT INTO `clients` (`client_id`, `first_name`, `last_name`, `adresse`, `contact`) VALUES
(1, 'RAVALISON', 'Tsiky', 'tsikyandriantia@gmail.com', '0349766449'),
(2, 'Andy', '', '', '0123456789'),
(3, 'Momo', 'Tsiky', 'tsikyravalison92@gmail.com', '0123456789'),
(4, 'Mama', 'Pama', 'Ananaskd', '1234567891'),
(5, 'Trop', 'Trap', 'Ruuu@gmail.com', '22222222222'),
(6, 'Nana', '', '', '0123456789');

-- --------------------------------------------------------

--
-- Structure de la table `commissions`
--

DROP TABLE IF EXISTS `commissions`;
CREATE TABLE IF NOT EXISTS `commissions` (
  `commission_id` int NOT NULL AUTO_INCREMENT,
  `delivery_id` int NOT NULL,
  `user_id` int NOT NULL,
  `amount` int NOT NULL,
  `status` enum('pending','paid') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`commission_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `commissions`
--

INSERT INTO `commissions` (`commission_id`, `delivery_id`, `user_id`, `amount`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 600000, 'paid', '2025-10-31 19:07:46', '2025-10-31 19:07:46'),
(2, 8, 26, 260000, 'paid', '2025-10-31 19:13:28', '2025-10-31 19:13:28'),
(3, 6, 25, 100000, 'paid', '2025-10-31 19:13:57', '2025-10-31 19:13:57'),
(4, 5, 19, 200000, 'paid', '2025-10-31 19:17:26', '2025-10-31 19:17:26'),
(5, 9, 26, 520000, 'paid', '2025-10-31 19:18:58', '2025-10-31 19:18:58'),
(6, 4, 19, 100000, 'paid', '2025-11-01 18:26:57', '2025-11-01 18:26:57');

-- --------------------------------------------------------

--
-- Structure de la table `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
CREATE TABLE IF NOT EXISTS `deliveries` (
  `delivery_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `client_id` int NOT NULL,
  `user_id` int NOT NULL,
  `place` varchar(112) NOT NULL,
  `delivery_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `quantity` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','validated') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`delivery_id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `deliveries`
--

INSERT INTO `deliveries` (`delivery_id`, `product_id`, `client_id`, `user_id`, `place`, `delivery_date`, `quantity`, `created_at`, `updated_at`, `status`) VALUES
(1, 4, 2, 3, 'Tata', '2025-09-12 03:26:00', 6, '2025-09-03 12:27:09', '2025-10-31 19:07:46', 'validated'),
(7, 4, 5, 26, 'Rata', '2025-11-21 03:20:00', 1, '2025-10-31 19:11:19', '2025-10-31 19:11:19', ''),
(3, 5, 2, 3, 'Mada', '2025-09-20 06:04:00', 2, '2025-09-10 12:05:34', '2025-09-10 12:05:34', 'pending'),
(4, 4, 4, 19, 'Tana', '2025-11-14 02:15:00', 1, '2025-10-30 13:59:48', '2025-11-01 15:26:57', 'validated'),
(5, 4, 5, 19, 'Tompoko', '2025-12-18 23:00:00', 2, '2025-10-31 04:57:18', '2025-10-31 19:17:26', 'validated'),
(6, 4, 5, 25, 'Yaya', '2025-11-14 04:16:00', 1, '2025-10-31 17:25:48', '2025-10-31 19:13:57', 'validated'),
(8, 5, 5, 26, 'Tata', '2025-11-21 03:16:00', 1, '2025-10-31 19:12:48', '2025-10-31 19:13:28', 'validated'),
(9, 5, 4, 26, 'Haha', '2025-11-22 03:15:00', 2, '2025-10-31 19:18:37', '2025-10-31 19:18:58', 'validated');

-- --------------------------------------------------------

--
-- Structure de la table `deposits`
--

DROP TABLE IF EXISTS `deposits`;
CREATE TABLE IF NOT EXISTS `deposits` (
  `deposit_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `amount` int NOT NULL,
  `payment_method` enum('bank','mobile_money','check') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sender_number` varchar(20) DEFAULT NULL,
  `proof_image` varchar(255) DEFAULT NULL,
  `status` enum('en attente','rejeté','validé') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'en attente',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `reference` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`deposit_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci DELAY_KEY_WRITE=1 PACK_KEYS=1 ROW_FORMAT=DYNAMIC;

--
-- Déchargement des données de la table `deposits`
--

INSERT INTO `deposits` (`deposit_id`, `user_id`, `amount`, `payment_method`, `sender_number`, `proof_image`, `status`, `created_at`, `reference`) VALUES
(1, 17, 5000, 'mobile_money', '320364068', '1761829833_724559cf3f288c4db0a5.jpg', 'validé', '2025-10-30 16:10:33', 'DEP-000001'),
(2, 17, 5000000, 'mobile_money', '315263136', '1761832160_eb4bd9024dff64b6280e.jpg', 'validé', '2025-10-30 16:49:20', 'DEP-000002'),
(3, 17, 3000000, 'mobile_money', '312846356', '1761886146_7b092b4ee81b3fa9583c.jpg', 'validé', '2025-10-31 07:49:06', 'DEP-000003'),
(4, 28, 10000000, 'mobile_money', '235486533', '1762093260_18d2034661596807ec9c.jpg', 'validé', '2025-11-02 17:21:00', 'DEP-000004'),
(5, 28, 50000000, 'check', NULL, '1762093829_bd66c2f1589b14c99e83.jpg', 'validé', '2025-11-02 17:30:29', 'DEP-000005');

-- --------------------------------------------------------

--
-- Structure de la table `investments`
--

DROP TABLE IF EXISTS `investments`;
CREATE TABLE IF NOT EXISTS `investments` (
  `investment_id` int NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `total_amount` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  `pack_id` int NOT NULL,
  `product_id` int NOT NULL,
  `reference` varchar(100) NOT NULL,
  PRIMARY KEY (`investment_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=FIXED;

--
-- Déchargement des données de la table `investments`
--

INSERT INTO `investments` (`investment_id`, `quantity`, `total_amount`, `created_at`, `user_id`, `pack_id`, `product_id`, `reference`) VALUES
(1, 4, 4000000, '2025-10-17 09:39:25', 1, 5, 4, 'IN-000001'),
(2, 2, 2000000, '2025-10-30 13:48:06', 17, 5, 4, 'IN-000002'),
(3, 1, 2000000, '2025-10-30 16:49:49', 17, 6, 5, 'IN-000003'),
(4, 8, 8000000, '2025-11-02 17:31:18', 28, 5, 4, 'IN-000004'),
(5, 5, 10000000, '2025-11-02 17:43:13', 28, 6, 5, 'IN-000005'),
(6, 2, 20000000, '2025-11-02 17:43:39', 28, 8, 8, 'IN-000006');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('success','warning','error','info') DEFAULT 'info',
  `icon` varchar(50) DEFAULT 'bell-o',
  `status_icon` varchar(50) DEFAULT 'info-circle',
  `status_color` varchar(20) DEFAULT '#3b82f6',
  `read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `icon`, `status_icon`, `status_color`, `read`, `created_at`) VALUES
(1, 1, 'Nouveau paiement validé', 'Votre paiement de 1 000 000 Ar via wallet a été validé et votre investissement a été enregistré.', 'success', 'credit-card', 'check-square-o', '#4ade80', 1, '2025-10-17 12:38:29'),
(2, 1, 'Nouveau paiement en attente', 'Votre demande de paiement de 3 000 000 Ar a été soumise et est en attente de validation.', 'info', 'arrow-circle-down', 'info-circle', '#fac115ff', 1, '2025-10-17 12:39:08'),
(3, 1, 'Paiement validé', 'Votre paiement de 3 000 000 Ar a été validé.', 'success', 'credit-card', 'check-square-o', '#4ade80', 1, '2025-10-17 12:39:25'),
(4, 1, 'Nouveau retrait en attente', 'Votre demande de retrait de 2 000 000 Ar a été soumise et est en attente de validation.', 'info', 'arrow-circle-up', 'info-circle', '#fac115ff', 1, '2025-10-17 13:56:10'),
(5, 1, 'Retrait validé', 'Votre demande de retrait de 2 000 000 Ar a été validée.', 'success', 'arrow-circle-up', 'check-square-o', '#4ade80', 1, '2025-10-17 13:56:26'),
(6, 17, 'Nouveau dépôt en attente', 'Votre demande de dépôt de 5 000 Ar a été soumise et est en attente de validation.', 'info', 'arrow-circle-down', 'info-circle', '#fac115ff', 1, '2025-10-30 16:10:33'),
(7, 17, 'Dépôt validé', 'Votre demande de dépôt de 5 000 Ar a été validée.', 'success', 'arrow-circle-down', 'check-square-o', '#4ade80', 1, '2025-10-30 16:16:27'),
(8, 17, 'Nouveau paiement en attente', 'Votre demande de paiement de 2 000 000 Ar a été soumise et est en attente de validation.', 'info', 'arrow-circle-down', 'info-circle', '#fac115ff', 1, '2025-10-30 16:47:14'),
(9, 17, 'Paiement validé', 'Votre paiement de 2 000 000 Ar a été validé.', 'success', 'credit-card', 'check-square-o', '#4ade80', 1, '2025-10-30 16:48:06'),
(10, 17, 'Nouveau dépôt en attente', 'Votre demande de dépôt de 5 000 000 Ar a été soumise et est en attente de validation.', 'info', 'arrow-circle-down', 'info-circle', '#fac115ff', 1, '2025-10-30 16:49:20'),
(11, 17, 'Dépôt validé', 'Votre demande de dépôt de 5 000 000 Ar a été validée.', 'success', 'arrow-circle-down', 'check-square-o', '#4ade80', 1, '2025-10-30 16:49:32'),
(12, 17, 'Nouveau paiement validé', 'Votre paiement de 2 000 000 Ar via wallet a été validé et votre investissement a été enregistré.', 'success', 'credit-card', 'check-square-o', '#4ade80', 1, '2025-10-30 16:49:49'),
(13, 17, 'Nouveau dépôt en attente', 'Votre demande de dépôt de 3 000 000 Ar a été soumise et est en attente de validation.', 'info', 'arrow-circle-down', 'info-circle', '#fac115ff', 0, '2025-10-31 07:49:06'),
(14, 17, 'Dépôt validé', 'Votre demande de dépôt de 3 000 000 Ar a été validée.', 'success', 'arrow-circle-down', 'check-square-o', '#4ade80', 0, '2025-10-31 07:49:37'),
(15, 17, 'Nouveau retrait en attente', 'Votre demande de retrait de 2 000 000 Ar a été soumise et est en attente de validation.', 'info', 'arrow-circle-up', 'info-circle', '#fac115ff', 0, '2025-10-31 07:51:16'),
(16, 17, 'Retrait validé', 'Votre demande de retrait de 2 000 000 Ar a été validée.', 'success', 'arrow-circle-up', 'check-square-o', '#4ade80', 0, '2025-10-31 07:51:42'),
(17, 28, 'Nouveau dépôt en attente', 'Votre demande de dépôt de 10 000 000 Ar a été soumise et est en attente de validation.', 'info', 'arrow-circle-down', 'info-circle', '#fac115ff', 1, '2025-11-02 17:21:00'),
(18, 28, 'Dépôt validé', 'Votre demande de dépôt de 10 000 000 Ar a été validée.', 'success', 'arrow-circle-down', 'check-square-o', '#4ade80', 1, '2025-11-02 17:21:27'),
(19, 28, 'Nouveau dépôt en attente', 'Votre demande de dépôt de 50 000 000 Ar a été soumise et est en attente de validation.', 'info', 'arrow-circle-down', 'info-circle', '#fac115ff', 1, '2025-11-02 17:30:29'),
(20, 28, 'Dépôt validé', 'Votre demande de dépôt de 50 000 000 Ar a été validée.', 'success', 'arrow-circle-down', 'check-square-o', '#4ade80', 1, '2025-11-02 17:30:44'),
(21, 28, 'Nouveau paiement validé', 'Votre paiement de 8 000 000 Ar via wallet a été validé et votre investissement a été enregistré.', 'success', 'credit-card', 'check-square-o', '#4ade80', 1, '2025-11-02 17:31:18'),
(22, 28, 'Nouveau retrait en attente', 'Votre demande de retrait de 3 000 000 Ar a été soumise et est en attente de validation.', 'info', 'arrow-circle-up', 'info-circle', '#fac115ff', 1, '2025-11-02 17:36:55'),
(23, 28, 'Retrait validé', 'Votre demande de retrait de 3 000 000 Ar a été validée.', 'success', 'arrow-circle-up', 'check-square-o', '#4ade80', 1, '2025-11-02 17:37:11'),
(24, 28, 'Nouveau paiement validé', 'Votre paiement de 10 000 000 Ar via wallet a été validé et votre investissement a été enregistré.', 'success', 'credit-card', 'check-square-o', '#4ade80', 0, '2025-11-02 17:43:13'),
(25, 28, 'Nouveau paiement validé', 'Votre paiement de 20 000 000 Ar via wallet a été validé et votre investissement a été enregistré.', 'success', 'credit-card', 'check-square-o', '#4ade80', 0, '2025-11-02 17:43:39'),
(26, 28, 'Objectif atteint', 'Félicitations ! L\'objectif pour le pack \"Pack 2025-008\" a été atteint.', 'success', 'trophy', 'check-square-o', '#4ade80', 0, '2025-11-02 17:43:39');

-- --------------------------------------------------------

--
-- Structure de la table `packs`
--

DROP TABLE IF EXISTS `packs`;
CREATE TABLE IF NOT EXISTS `packs` (
  `pack_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `pack_name` varchar(255) NOT NULL,
  `order_start_date` datetime NOT NULL,
  `min_investment` bigint NOT NULL,
  `objective_quantity` int NOT NULL,
  `return_on_investment` int NOT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pack_id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `packs`
--

INSERT INTO `packs` (`pack_id`, `product_id`, `pack_name`, `order_start_date`, `min_investment`, `objective_quantity`, `return_on_investment`, `reference`, `created_at`) VALUES
(5, 4, 'Pack 2025-005', '2025-07-14 21:52:54', 1000000, 15, 40, NULL, '2025-11-02 12:05:38'),
(6, 5, 'Pack 2025-006', '2025-07-14 21:53:35', 2000000, 10, 20, NULL, '2025-11-02 12:05:38'),
(7, 6, 'Pack 2025-007', '2025-07-18 07:11:04', 200000, 10, 20, NULL, '2025-11-02 12:05:38'),
(8, 8, 'Pack 2025-008', '2025-11-02 00:00:00', 10000000, 2, 12, NULL, '2025-11-02 14:35:15');

-- --------------------------------------------------------

--
-- Structure de la table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `amount` int NOT NULL,
  `quantity` int DEFAULT '1',
  `pack_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `payment_method` enum('bank','mobile_money','check','wallet') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sender_number` varchar(20) DEFAULT NULL,
  `proof_image` varchar(255) DEFAULT NULL,
  `status` enum('en attente','rejeté','validé') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'en attente',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `reference` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`payment_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=1 ROW_FORMAT=DYNAMIC;

--
-- Déchargement des données de la table `payments`
--

INSERT INTO `payments` (`payment_id`, `user_id`, `amount`, `quantity`, `pack_id`, `product_id`, `payment_method`, `sender_number`, `proof_image`, `status`, `created_at`, `reference`) VALUES
(1, 1, 1000000, 1, 5, 4, 'wallet', NULL, NULL, 'validé', '2025-10-17 12:38:29', 'P-000001'),
(2, 1, 3000000, 3, 5, 4, 'mobile_money', '340000000', '1760693948_6e124ad585cb3f855436.jpg', 'validé', '2025-10-17 12:39:08', 'P-000002'),
(3, 17, 2000000, 2, 5, 4, 'mobile_money', '331234567', '1761832034_cddc5ea7c617d8904aee.jpg', 'validé', '2025-10-30 16:47:14', 'P-000003'),
(4, 17, 2000000, 1, 6, 5, 'wallet', NULL, NULL, 'validé', '2025-10-30 16:49:49', 'P-000004'),
(5, 28, 8000000, 8, 5, 4, 'wallet', NULL, NULL, 'validé', '2025-11-02 17:31:18', 'P-000005'),
(6, 28, 10000000, 5, 6, 5, 'wallet', NULL, NULL, 'validé', '2025-11-02 17:43:13', 'P-000006'),
(7, 28, 20000000, 2, 8, 8, 'wallet', NULL, NULL, 'validé', '2025-11-02 17:43:39', 'P-000007');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `unit_price` int NOT NULL,
  `available_quantity` int NOT NULL,
  `description` text,
  `commission_rate` int DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`product_id`, `name`, `image_url`, `unit_price`, `available_quantity`, `description`, `commission_rate`, `reference`, `created_at`) VALUES
(4, 'Montre de luxe', '/uploads/products/1752527660_63ba240309e959aa3adf.png', 1000000, 10, 'Cette montre de luxe en or 18 carats incarne l’élégance et le raffinement. Son boîtier poli avec précision capte la lumière, tandis que son cadran finement travaillé affiche des index dorés et des aiguilles délicates. Le verre saphir inrayable protège un mouvement automatique suisse d’une fiabilité exceptionnelle. Le fond transparent laisse admirer la mécanique horlogère. Son bracelet en cuir d’alligator ou en or massif assure confort et distinction. Chaque détail témoigne d’un savoir-faire artisanal d’exception. Plus qu’un accessoire, c’est une pièce d’exception destinée aux connaisseurs.', 10, 'M001', '2025-11-02 12:07:04'),
(5, 'Ordinateur', '/uploads/products/1752527759_346337d7cb00bb877f11.png', 2000000, 7, 'L’ordinateur de jeu Intel Megaport est conçu pour offrir des performances de haut niveau aux gamers exigeants. Équipé d’un processeur Intel puissant, il garantit une fluidité exceptionnelle même dans les jeux les plus gourmands. Sa carte graphique dédiée assure un rendu visuel ultra-réaliste en haute résolution. Avec son design moderne, ses LED RGB personnalisables et son boîtier ventilé, il allie style et efficacité. Le système de refroidissement optimisé maintient des températures stables en toutes circonstances. Compatible avec les dernières technologies, il offre une expérience immersive et réactive. Un choix idéal pour le jeu intensif et le multitâche.', 13, 'OR001', '2025-11-02 12:07:04'),
(6, 'Cartable', '/uploads/products/1752525537_50acde3fd23c37f58204.png', 200000, 10, 'Ce cartable rouge allie praticité, style et durabilité pour accompagner les journées d’école avec élégance. Conçu dans un tissu résistant et imperméable, il protège efficacement les affaires scolaires. Son grand compartiment principal accueille cahiers, livres et trousse, tandis que ses poches extérieures offrent un accès rapide aux petits objets. Les bretelles rembourrées et réglables assurent un confort optimal même chargé. Sa couleur rouge vive apporte une touche de dynamisme et de personnalité. Solide et bien pensé, il convient aussi bien aux enfants qu’aux adolescents. Un choix fonctionnel et plein de caractère pour la rentrée.', 12, 'C001', '2025-11-02 12:07:04'),
(7, 'Iphone 16 Pro', 'uploads/produits/1760582585_c5755499bb370096be4c.png', 3500000, 8, 'L\'iPhone 16 Pro est un smartphone doté d\'un écran Super Retina XDR de 6,3 pouces, d\'une puce A18 Pro plus puissante, d\'un système photo avancé avec des objectifs grand-angle, ultra grand-angle et téléobjectif, et d\'un nouveau bouton de commande de l\'', 10, 'ip16', '2025-11-02 12:07:04'),
(8, 'Voiture', 'uploads/produits/1762094068_4fc94dd14ee27d3dd671.jpg', 50000000, 0, 'Une voiture', 30, 'V001', '2025-11-02 14:34:28');

-- --------------------------------------------------------

--
-- Structure de la table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE IF NOT EXISTS `transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `amount` int NOT NULL,
  `status` enum('en attente','rejeté','validé') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'en attente',
  `type` enum('deposit_request','payment_request','withdrawal_request') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `payment_method` enum('bank','check','mobile_money','wallet') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sender_number` varchar(20) DEFAULT NULL,
  `receiver_number` varchar(20) DEFAULT NULL,
  `proof_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `deposit_id` int DEFAULT NULL,
  `withdrawal_id` int DEFAULT NULL,
  `payment_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `reference` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`transaction_id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=1 ROW_FORMAT=FIXED;

--
-- Déchargement des données de la table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `user_id`, `amount`, `status`, `type`, `payment_method`, `sender_number`, `receiver_number`, `proof_image`, `deposit_id`, `withdrawal_id`, `payment_id`, `created_at`, `reference`) VALUES
(1, 1, 1000000, 'validé', 'payment_request', 'wallet', NULL, NULL, NULL, NULL, NULL, 1, '2025-10-17 12:38:29', 'P-000001'),
(2, 1, 3000000, 'validé', 'payment_request', 'mobile_money', '340000000', NULL, '1760693948_6e124ad585cb3f855436.jpg', NULL, NULL, 2, '2025-10-17 12:39:08', 'P-000002'),
(3, 1, 2000000, 'validé', 'withdrawal_request', 'mobile_money', NULL, '340000000', NULL, NULL, 1, NULL, '2025-10-17 13:56:10', 'RET-000001'),
(4, 17, 5000, 'validé', 'deposit_request', 'mobile_money', '320364068', NULL, '1761829833_724559cf3f288c4db0a5.jpg', 1, NULL, NULL, '2025-10-30 16:10:33', 'DEP-000001'),
(5, 17, 2000000, 'validé', 'payment_request', 'mobile_money', '331234567', NULL, '1761832034_cddc5ea7c617d8904aee.jpg', NULL, NULL, 3, '2025-10-30 16:47:15', 'P-000003'),
(6, 17, 5000000, 'validé', 'deposit_request', 'mobile_money', '315263136', NULL, '1761832160_eb4bd9024dff64b6280e.jpg', 2, NULL, NULL, '2025-10-30 16:49:20', 'DEP-000002'),
(7, 17, 2000000, 'validé', 'payment_request', 'wallet', NULL, NULL, NULL, NULL, NULL, 4, '2025-10-30 16:49:49', 'P-000004'),
(8, 17, 3000000, 'validé', 'deposit_request', 'mobile_money', '312846356', NULL, '1761886146_7b092b4ee81b3fa9583c.jpg', 3, NULL, NULL, '2025-10-31 07:49:06', 'DEP-000003'),
(9, 17, 2000000, 'validé', 'withdrawal_request', 'mobile_money', NULL, '646464688', NULL, NULL, 2, NULL, '2025-10-31 07:51:16', 'RET-000002'),
(10, 28, 10000000, 'validé', 'deposit_request', 'mobile_money', '235486533', NULL, '1762093260_18d2034661596807ec9c.jpg', 4, NULL, NULL, '2025-11-02 17:21:00', 'DEP-000004'),
(11, 28, 50000000, 'validé', 'deposit_request', 'check', NULL, NULL, '1762093829_bd66c2f1589b14c99e83.jpg', 5, NULL, NULL, '2025-11-02 17:30:29', 'DEP-000005'),
(12, 28, 8000000, 'validé', 'payment_request', 'wallet', NULL, NULL, NULL, NULL, NULL, 5, '2025-11-02 17:31:18', 'P-000005'),
(13, 28, 3000000, 'validé', 'withdrawal_request', 'mobile_money', NULL, '123456789', NULL, NULL, 3, NULL, '2025-11-02 17:36:55', 'RET-000003'),
(14, 28, 10000000, 'validé', 'payment_request', 'wallet', NULL, NULL, NULL, NULL, NULL, 6, '2025-11-02 17:43:13', 'P-000006'),
(15, 28, 20000000, 'validé', 'payment_request', 'wallet', NULL, NULL, NULL, NULL, NULL, 7, '2025-11-02 17:43:39', 'P-000007');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone_number` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `date_of_birth` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('commercial','investor') NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `profile_picture` text,
  `CIN_picture` text,
  `status` enum('en attente','rejeté','validé','') NOT NULL DEFAULT 'en attente',
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=1;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `phone_number`, `email`, `date_of_birth`, `password`, `role`, `created_at`, `updated_at`, `profile_picture`, `CIN_picture`, `status`) VALUES
(1, 'Ravalison', 'Tsiky Andriantia', '0349766449', 'tsikyandriantia@gmail.com', '2003-07-11', '$2y$10$7J3lFZZYSP7z9tLCGtgeFuRypIBKzYrvE/w.C/pPWEv/4cb/LwZBO', 'investor', '2025-07-21 06:06:12', '2025-09-30 06:47:47', '/uploads/1759214867_09072c619bc9e79c32c4.jpg', NULL, 'en attente'),
(19, 'Andrianarimalala', 'Andy', NULL, 'andy@gmail.com', '2020-05-22', '$2y$10$NS71CFfg5U6qp9ZJqnukoOCfAk0GVZ.LHwVhq0z5lIUK/w4yT3XNS', 'commercial', '2025-10-30 13:56:00', '2025-10-30 13:56:00', NULL, NULL, ''),
(11, 'RAVALISON', 'Kanto Fitiaviana', NULL, 'kanto@gmail.com', '2000-01-08', '$2y$10$2nbQTXhnMvqY5tXrN7/mAOsPj8tLvhLOYm4qOr/4NImAZkg7IVx2m', 'commercial', '2025-09-16 00:45:34', '2025-09-16 00:45:34', NULL, NULL, ''),
(12, 'Ravalison', 'Hery', NULL, 'hery@gmail.com', '1973-11-16', '$2y$10$ArSL2zjCMxSqf2uWY0T8o.T6KBFwALTcDCToYHIKPIVKgp3eSqphC', 'investor', '2025-09-16 01:26:09', '2025-09-16 01:26:09', NULL, NULL, ''),
(13, 'Bodovoahangy', 'Pulchérie', NULL, 'bodo@gmail.com', '1970-09-10', '$2y$10$Q1JyFUeJilf6K4xFhunQyO7yjvRAZwxr5LVJzWPpiK3LCn/ioA4M.', 'investor', '2025-10-16 18:34:20', '2025-10-16 18:34:20', NULL, NULL, ''),
(14, 'Ravalison', 'Tsiky', NULL, 'tkjhbtkjhb@gmail.com', '2003-07-11', '$2y$10$onZHsDBE307TvkqOGV8be.wmiQLqzBdw9eAayLKau2WGQBxbEWaE.', 'commercial', '2025-10-17 02:01:43', '2025-10-17 02:01:43', NULL, NULL, ''),
(15, 'Berta', 'Mandimby', '0345688833', 'berta@gmail.com', '2000-05-12', '$2y$10$bSLPouxU3Jha34eq6HuJEOVC39aUjis9siHxQBb2gkctNV0ISRtpS', 'investor', '2025-10-17 06:32:35', '2025-10-17 06:34:57', NULL, NULL, ''),
(16, 'Voahangy', 'Tsiketa', NULL, 'tsiketa@gmail.com', '2005-12-17', '$2y$10$Fj7Trc5zuOWqcS34GS5cJu706iO5UTX8zVU5veA17NIykKwl/CFli', 'investor', '2025-10-17 08:36:52', '2025-10-17 08:36:52', NULL, NULL, ''),
(17, 'So', 'Son', '0340364069', 'son@gmail.com', '2020-06-27', '$2y$10$gO9kbErB53uH3IXd8yUNAe54haNpN5tZsoSLaS8CgSb1pKonCMtgS', 'investor', '2025-10-30 06:19:39', '2025-10-30 13:51:35', '/uploads/1761832250_069e3ca72f1bbf609c2f.jpg', '/uploads/1761832259_9dd057be1bea748943ef.jpg', ''),
(18, 'Andy', 'Andy', NULL, 'andy7andria@gmail.com', '2019-05-25', '$2y$10$rWLuAwRtxft0hbrcgRize.fE3rAp7pE9EiIJjC0o1AgBydbNCb1CO', 'commercial', '2025-10-30 06:21:24', '2025-10-30 06:21:24', NULL, NULL, ''),
(20, 'Ra', 'Rara', NULL, 'ra@gmail.com', '2020-06-27', '$2y$10$3Zor10eSb0F4PLYkBQjzFOCHDYD.ZP8gZ11jWvuHESsJVPErTPiTW', 'commercial', '2025-10-31 16:32:10', '2025-10-31 16:32:10', NULL, NULL, ''),
(21, 'Tahana', 'Tahana', NULL, 'tana@gmail.com', '2024-05-26', '$2y$10$FuUkg0wbXdoWAGsbGpbxreIH51aRL6t4OpoLp2B5R4cdSb8mrizGG', 'commercial', '2025-10-31 17:01:09', '2025-10-31 17:01:09', NULL, NULL, ''),
(22, 'Momo', 'Mo', NULL, 'se20200068@gmail.com', '2021-08-26', '$2y$10$gNiNr7TyvsrO5JE/ZAJeWep2dgIPZSHfm8EGYnOXckP2Fi6Bv9HZ6', 'commercial', '2025-10-31 17:05:44', '2025-10-31 17:05:44', NULL, NULL, ''),
(23, 'Ma', 'Ma', NULL, 'ma@gmail.com', '2021-06-26', '$2y$10$2dF8koaoz.M/ZgXRr5VZEe/xD022hBTK3P1BkD2xZAo7DbHrRIJKK', 'commercial', '2025-10-31 17:06:53', '2025-10-31 17:06:53', NULL, NULL, ''),
(24, 'Me', 'Me', NULL, 'me@gmail.n', '2021-06-27', '$2y$10$ifoqikS0H/SZvTuphOwE.u/o.OMjgxhK4NuNfYBClHzEN5UNNw81W', 'commercial', '2025-10-31 17:08:25', '2025-10-31 17:08:25', NULL, NULL, ''),
(25, 'Tata', 'Tata', NULL, 'tata@gmail.com', '2021-05-25', '$2y$10$8Gnt83elF8kbozOUfNJaQ.GAbVozVB.hLy0HyyJDYJ7AM2rpMlBym', 'commercial', '2025-10-31 17:19:07', '2025-10-31 17:19:07', NULL, NULL, ''),
(26, 'Nana', 'Nana', NULL, 'nana@gmail.com', '2020-05-28', '$2y$10$vzWBcGtWH72/SwDWJ3FPBehpjZ6EnGjk0suNvrQSixLE5DohYGTO.', 'commercial', '2025-10-31 19:10:33', '2025-10-31 19:10:33', NULL, NULL, ''),
(27, 'ha', 'ha', NULL, 'ha@gmail.com', '2020-05-27', '$2y$10$iI0AiIYoFJwfgc0t6VGRKOjZD.ieTs5ezwTscHsIBgjruJNtXQ57S', 'investor', '2025-10-31 20:12:41', '2025-10-31 20:12:41', NULL, NULL, ''),
(28, 'nanao', 'tania', NULL, 'nanao@gmail.com', '2021-05-30', '$2y$10$FWV9scAk15JC3DSSsqDIEuUhdNf8dXH9FMRVKpiC1WJ/fap.YCQru', 'investor', '2025-11-02 14:20:19', '2025-11-02 14:20:19', NULL, NULL, '');

-- --------------------------------------------------------

--
-- Structure de la table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
CREATE TABLE IF NOT EXISTS `wallets` (
  `wallet_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `balance` int DEFAULT '0',
  PRIMARY KEY (`wallet_id`)
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `wallets`
--

INSERT INTO `wallets` (`wallet_id`, `user_id`, `balance`) VALUES
(1, 1, 3400000),
(2, 2, 5000000),
(3, 3, 5600000),
(16, 16, 0),
(15, 15, 2800000),
(14, 14, 0),
(13, 13, 53800000),
(12, 12, 249570000),
(11, 11, 0),
(17, 17, 4005000),
(18, 18, 0),
(19, 19, 300000),
(20, 20, 0),
(21, 21, 0),
(22, 22, 0),
(23, 23, 0),
(24, 24, 0),
(25, 25, 100000),
(26, 26, 780000),
(27, 27, 0),
(28, 28, 19000000);

-- --------------------------------------------------------

--
-- Structure de la table `withdrawals`
--

DROP TABLE IF EXISTS `withdrawals`;
CREATE TABLE IF NOT EXISTS `withdrawals` (
  `withdrawal_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `amount` int NOT NULL,
  `payment_method` enum('mobile_money') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'mobile_money',
  `receiver_number` varchar(20) NOT NULL,
  `status` enum('en attente','rejeté','validé') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'en attente',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reference` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`withdrawal_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=1 ROW_FORMAT=FIXED;

--
-- Déchargement des données de la table `withdrawals`
--

INSERT INTO `withdrawals` (`withdrawal_id`, `user_id`, `amount`, `payment_method`, `receiver_number`, `status`, `created_at`, `reference`) VALUES
(1, 1, 2000000, 'mobile_money', '340000000', 'validé', '2025-10-17 13:56:10', 'RET-000001'),
(2, 17, 2000000, 'mobile_money', '646464688', 'validé', '2025-10-31 07:51:16', 'RET-000002'),
(3, 28, 3000000, 'mobile_money', '123456789', 'validé', '2025-11-02 17:36:55', 'RET-000003');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
