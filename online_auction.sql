
CREATE DATABASE IF NOT EXISTS `onlineauction`;
USE `onlineauction`;

SET NAMES utf8mb4;
-- ----------------------------
-- Table structure for roles
-- ----------------------------
CREATE TABLE `roles` (
  `roleId` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `roleName` varchar(20) NOT NULL,
  PRIMARY KEY (`roleId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Table structure for users
-- ----------------------------
CREATE TABLE `users` (
  `userId` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(60) NOT NULL UNIQUE,
  `password` char(60),
  `firstname` varchar(40),
  `lastname` varchar(40),
  `dob` date,
  `address` varchar(100),
  `roleId` tinyint unsigned DEFAULT 1,
  PRIMARY KEY (`userId`),
  CONSTRAINT `FK_users_roles` FOREIGN KEY (`roleId`) REFERENCES `roles` (`roleId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Table structure for OTP
-- Each user can only have one token
-- ----------------------------
CREATE TABLE `otp` (
  `userId` int unsigned NOT NULL,
  `dateCreated` datetime DEFAULT CURRENT_TIMESTAMP,
  `token` char(4) NOT NULL,
  PRIMARY KEY (`userId`),
  CONSTRAINT `FK_otp_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
CREATE TABLE `categories` (
  `catId` int unsigned NOT NULL AUTO_INCREMENT,
  `catName` varchar(50) COLLATE utf8_general_ci NOT NULL,
  `parentId` int unsigned,
  PRIMARY KEY (`catId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Table structure for products
-- ----------------------------
CREATE TABLE `products` (
  `proId` int unsigned NOT NULL AUTO_INCREMENT,
  `proName` varchar(50) COLLATE utf8_general_ci NOT NULL,
  `proImg` varchar(2083) NOT NULL,
  `catId` int unsigned NOT NULL,
  `currentPrice` int unsigned NOT NULL,
  `buyNowPrice` int unsigned DEFAULT NULL,
  `fullDes` varchar(200) NOT NULL,
  `postDate` datetime NOT NULL,
  `expiredDate` datetime NOT NULL,
  `numberOfBids` tinyint unsigned DEFAULT 0,
  `bidderName` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`proId`),
  CONSTRAINT `FK_products_categories` FOREIGN KEY (`catId`) REFERENCES `categories` (`catId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Table structure for watchlist
-- ----------------------------
CREATE TABLE `watchlist` (
  `bidderId` int unsigned NOT NULL,
  `proId` int unsigned NOT NULL,
  PRIMARY KEY (`bidderId`, `proId`),
  CONSTRAINT `FK_watchlist_users` FOREIGN KEY (`bidderId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_watchlist_products` FOREIGN KEY (`proId`) REFERENCES `products` (`proId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Table structure for auction history
-- ----------------------------
CREATE TABLE `auctionHistory` (
  `proId` int unsigned NOT NULL,
  `auctionTime` datetime NOT NULL,
  `bidderId` int unsigned NOT NULL,
  `auctionPrice` int NOT NULL,
  PRIMARY KEY (`proId`, `auctionTime`),
  CONSTRAINT `FK_auctionHistory_products` FOREIGN KEY (`proId`) REFERENCES `products` (`proId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_auctionHistory_users` FOREIGN KEY (`bidderId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Table structure for rating history
-- ----------------------------
CREATE TABLE `ratingHistory` (
  `bidderId` int unsigned NOT NULL,
  `assessorId` int unsigned NOT NULL,
  `ratingTime` datetime NOT NULL,
  `ratingPoint` tinyint unsigned NOT NULL,
  `comment` varchar(100) NOT NULL,
  PRIMARY KEY (`bidderId`, `assessorId`, `ratingTime`),
  CONSTRAINT `FK_ratingHistory_users_1` FOREIGN KEY (`bidderId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ratingHistory_users_2` FOREIGN KEY (`assessorId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Table structure for auction list
-- ----------------------------
CREATE TABLE `auctionList` (
  `sellerId` int unsigned NOT NULL,
  `proId` int unsigned NOT NULL,
  `postDate` datetime NOT NULL,
  PRIMARY KEY (`sellerId`, `proId`),
  CONSTRAINT `FK_auctionList_users` FOREIGN KEY (`sellerId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_auctionList_products` FOREIGN KEY (`proId`) REFERENCES `products` (`proId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Table structure for upgrade list
-- ----------------------------
CREATE TABLE `upgradeList` (
  `bidderId` int unsigned NOT NULL,
  `registerTime` datetime NOT NULL,
  PRIMARY KEY (`bidderId`),
  CONSTRAINT `FK_upgradeList_users` FOREIGN KEY (`bidderId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;











