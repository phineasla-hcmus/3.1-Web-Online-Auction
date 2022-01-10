-- COMMENT THIS LINE TO EXECUTE ON PLANET SCALE
CREATE DATABASE IF NOT EXISTS `web-express-auction`;

-- All table creation must comply these rules:
-- 1. DROP TABLE IF EXISTS before CREATE TABLE
-- 2. No FOREIGN KEY

USE `web-express-auction`;

DROP TABLE IF EXISTS `sessions`;

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

DROP TABLE IF EXISTS `socials`;
CREATE TABLE `socials` (
	`userId` 		int unsigned NOT NULL,
    `socialId` 		varchar(255) NOT NULL,
    `refreshToken` 	varchar(255) NOT NULL,
    `provider` 		tinyint,
    PRIMARY KEY (`userId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for OTP
-- Each user can only have one token
-- ----------------------------
DROP TABLE IF EXISTS `otp`;
CREATE TABLE `otp` (
  `userId` int unsigned NOT NULL,
  `otpType` tinyint NOT NULL,
  `dateCreated` datetime DEFAULT CURRENT_TIMESTAMP,
  `token` char(6) NOT NULL,
  PRIMARY KEY (`userId`, `otpType`)
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
  `proId` 			int unsigned 	NOT NULL AUTO_INCREMENT,
  `proName` 		varchar(255) 	COLLATE utf8mb4_general_ci NOT NULL,
  `catId` 			int unsigned 	NOT NULL,
  `basePrice` 		int unsigned 	NOT NULL,
  `buyNowPrice` 	int unsigned 	DEFAULT NULL,
  `currentPrice` 	int unsigned 	NOT NULL,
  `stepPrice` 		int unsigned	NOT NULL,
  `description` 	varchar(16000)	NOT NULL,
  `postDate` 		datetime 		DEFAULT CURRENT_TIMESTAMP,
  `expiredDate` 	datetime 		NOT NULL,
  `numberOfBids` 	tinyint unsigned DEFAULT 0,
  `bidderId` 		int 			DEFAULT NULL,
  `sellerId` 		int unsigned 	NOT NULL,
  `isAllowRating` 	int 			NOT NULL,	-- 1 is allow to bid for user who don't have Rating , 0 is not allow
  `isDisable` 		int 			DEFAULT 1,  -- 1 is active , 0 is disable // for admin add to deleting product,
  `isExtendLimit` 	int 			DEFAULT 0, 	-- 1 is extend, 0 is not,
  `thumbnailId`		char(30)		DEFAULT NULL,
  PRIMARY KEY (`proId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `productImages`;
CREATE TABLE `productImages` (
	`proId` 		int unsigned 	NOT NULL,
    `imgId`			char(30)		NOT NULL,
    `secureUrl`		varchar(256)	NOT NULL,
    `extra`			json			NOT NULL,
    PRIMARY KEY (`proId`, `imgId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `activeProducts`;
CREATE TABLE `activeProducts`(
	`proId` int unsigned NOT NULL,
    PRIMARY KEY(`proId`)
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
  `isDenied` int default 1, -- 0 is denied , 1 is non
  PRIMARY KEY (`proId`, `auctionTime`,`bidderId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for rating history
-- ----------------------------
DROP TABLE IF EXISTS `ratingHistory`;
CREATE TABLE `ratingHistory` (
  `userId` int unsigned NOT NULL,
  `rateId` int unsigned NOT NULL,
  `proId` int unsigned NOT NULL,
  `ratingTime` datetime NOT NULL,
  `satisfied` boolean NOT NULL,
  `comment` varchar(100),
  PRIMARY KEY (`userId`, `rateId`, `proId`)
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
  `expiredDate` datetime,
  PRIMARY KEY (`bidderId`, `registerTime`)
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
-- Table structure for auctionAuto
-- ----------------------------

DROP TABLE IF EXISTS `auctionAuto`;
CREATE TABLE `auctionAuto`(
  `proId` int unsigned NOT NULL,
  `userId` int unsigned NOT NULL,
  `maxPrice` int unsigned NOT NULL,
  `time` datetime NOT NULL,
  `isDenied` int default 1, -- 0 is denied , 1 is non
  PRIMARY KEY(`proId`,`userId`,`maxPrice`) 
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for waitingList (list of bidder which doesn't have rating score , waiting for seller allow)
-- ----------------------------
-- DROP TABLE IF EXISTS `waitingList`;
-- CREATE TABLE `waitingList`(
--   `sellerId` int unsigned NOT NULL,
--   `proId` int unsigned NOT NULL,
--   `userId` int unsigned NOT NULL,
--   PRIMARY KEY(`sellerId`,`proId`,`userId`) 
-- ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for deletingProduct ( table for admin delete product) 
-- ----------------------------

DROP TABLE IF EXISTS `deletingProduct`;
CREATE TABLE `deletingProduct`(
  `proId` int unsigned NOT NULL,
  `userId` int unsigned NOT NULL,
  PRIMARY KEY(`proId`,`userId`) 
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Full-text search
ALTER TABLE products
ADD FULLTEXT(proName);

ALTER TABLE categories
ADD FULLTEXT(catName);