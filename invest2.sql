-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 06 nov. 2025 à 20:30
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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
