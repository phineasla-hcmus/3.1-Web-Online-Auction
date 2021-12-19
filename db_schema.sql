-- COMMENT THIS LINE TO EXECUTE ON PLANET SCALE
CREATE DATABASE IF NOT EXISTS `web-express-auction`;

-- All table creation must comply these rules:
-- 1. DROP TABLE IF EXISTS before CREATE TABLE
-- 2. No FOREIGN KEY

USE `web-express-auction`;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `roleId` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `roleName` varchar(20) NOT NULL,
  PRIMARY KEY (`roleId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `userId` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(60) NOT NULL UNIQUE,
  `password` char(60),
  `firstname` varchar(40),
  `lastname` varchar(40),
  `dob` date,
  `address` varchar(100),
  `rating` double DEFAULT NULL,
  `roleId` tinyint unsigned DEFAULT 1,
  PRIMARY KEY (`userId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for OTP
-- Each user can only have one token
-- ----------------------------
DROP TABLE IF EXISTS `otp`;
CREATE TABLE `otp` (
  `userId` int unsigned NOT NULL,
  `dateCreated` datetime DEFAULT CURRENT_TIMESTAMP,
  `token` char(4) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `catId` int unsigned NOT NULL AUTO_INCREMENT,
  `catName` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `parentId` int unsigned,
  PRIMARY KEY (`catId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `proId` int unsigned NOT NULL AUTO_INCREMENT,
  `proName` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `proImg` varchar(2083) NOT NULL,
  `catId` int unsigned NOT NULL,
  `currentPrice` int unsigned NOT NULL,
  `buyNowPrice` int unsigned DEFAULT NULL,
  `fullDes` varchar(200) NOT NULL,
  `postDate` datetime NOT NULL,
  `expiredDate` datetime NOT NULL,
  `numberOfBids` tinyint unsigned DEFAULT 0,
  `bidderId` int DEFAULT NULL,
  `bidderName` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`proId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for watchlist
-- ----------------------------
DROP TABLE IF EXISTS `watchlist`;
CREATE TABLE `watchlist` (
  `bidderId` int unsigned NOT NULL,
  `proId` int unsigned NOT NULL,
  PRIMARY KEY (`bidderId`, `proId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for auction history
-- ----------------------------
DROP TABLE IF EXISTS `auctionHistory`;
CREATE TABLE `auctionHistory` (
  `proId` int unsigned NOT NULL,
  `auctionTime` datetime NOT NULL,
  `bidderId` int unsigned NOT NULL,
  `bidderName` varchar(80) NOT NULL,
  `auctionPrice` int NOT NULL,
  PRIMARY KEY (`proId`, `auctionTime`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for rating history
-- ----------------------------
DROP TABLE IF EXISTS `ratingHistory`;
CREATE TABLE `ratingHistory` (
  `bidderId` int unsigned NOT NULL,
  `assessorId` int unsigned NOT NULL,
  `proId` int unsigned NOT NULL,
  `assessorName` varchar(80) NULL,
  `ratingTime` datetime NOT NULL,
  `satisfied` boolean NOT NULL,
  `comment` varchar(100),
  PRIMARY KEY (`bidderId`, `assessorId`, `proId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for auction list
-- ----------------------------
DROP TABLE IF EXISTS `auctionList`;
CREATE TABLE `auctionList` (
  `sellerId` int unsigned NOT NULL,
  `proId` int unsigned NOT NULL,
  `postDate` datetime NOT NULL,
  PRIMARY KEY (`sellerId`, `proId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for upgrade list
-- ----------------------------
DROP TABLE IF EXISTS `upgradeList`;
CREATE TABLE `upgradeList` (
  `bidderId` int unsigned NOT NULL,
  `registerTime` datetime NOT NULL,
  `status` tinyint NOT NULL, -- -1: pending, 0: denied, 1: accepted
  PRIMARY KEY (`bidderId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ----------------------------
-- Table structure for denyBidder
-- ----------------------------
DROP TABLE IF EXISTS `deniedBidder`;
CREATE TABLE `deniedBidder`(
  `bidderId` int unsigned NOT NULL,
  `proId` int unsigned NOT NULL,
  PRIMARY KEY(`bidderId`,`proId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for aunctionAuto
-- ----------------------------

DROP TABLE IF EXISTS `aunctionAuto`;
CREATE TABLE `aunctionAuto`(
  `proId` int unsigned NOT NULL,
  `userId` int unsigned NOT NULL,
  `maxPrice` int unsigned NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY(`proId`,`userId`,`maxPrice`) 
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Full-text search
ALTER TABLE products
ADD FULLTEXT(proName)