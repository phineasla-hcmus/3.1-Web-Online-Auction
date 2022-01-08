USE `web-express-auction`;

insert into roles values(1, 'Unverified');
insert into roles values(2, 'Bidder');
insert into roles values(3, 'Seller');
insert into roles values(4, 'Admin');

insert into categories values(1, 'Electronics', null);
insert into categories values(2, 'Furniture', null);
insert into categories values(3, 'Houseware', null);
insert into categories values(4, 'Laptop', 1);
insert into categories values(5, 'Phone', 1);
insert into categories values(6, 'Tablet', 1);
insert into categories values(7, 'Bed', 2);
insert into categories values(8, 'Desk', 2);
insert into categories values(9, 'Cabinet', 2);
insert into categories values(10, 'Coffee press', 3);
insert into categories values(11, 'Chopping board', 3);
insert into categories values(12, 'Baking dish', 3);

insert into users values(1, 'nguyenngocthanhtam9b@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Tam', 'Nguyen', '2001-10-12', 'somewhere in the universe', 8, 2);
insert into users values(2, 'a@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Hong', 'Du Shik', '1995-10-12', 'somewhere', null, 3);
insert into users values(3, 'leesuby@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Hong', 'Phuc', '2001-10-12', 'somewhere in the universe', 7, 3);
insert into users values(4, 'admin@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Long', 'Long', '2001-10-12', 'somewhere in the universe', 8, 4);
-- sample data used for [admin] manage users
insert into users values(5, 'hoho1@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Ai', 'Zay', '2001-10-12', 'abc', null, 2);
insert into users values(6, 'hoho2@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Ai', 'Zay', '2001-10-12', 'abc', null, 2);
insert into users values(7, 'hoho3@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Ai', 'Zay', '2001-10-12', 'abc', null, 2);
insert into users values(8, 'hoho4@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Ai', 'Zay', '2001-10-12', 'abc', null, 2);
insert into users values(9, 'hoho5@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Ai', 'Zay', '2001-10-12', 'abc', null, 2);
insert into users values(10, 'hoho6@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Ai', 'Zay', '2001-10-12', 'abc', null, 2);

insert into products values(1, 'Laptop Lenovo Ideapad 3', 4,"500","5000", "500", "100","This is a product", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 0, 0, 2, 0, 1, 1, 'product/agai9qbgxv97t5iftqly');
insert into products values(2, 'Laptop HP', 4, "550", "5500", "550", "100","This is a product", "2021-11-30 08:20:30", "2022-01-25 09:30:00",0 , 0, 2, 0, 1, 1, 'product/hav2jd8fakluchw6onit');
insert into products values(3, 'Laptop ASUS Vivobook', 4,"700","7000", "700", "100","This is a product", "2021-11-30 08:20:30", "2022-01-16 09:30:00", 0, 0, 2, 0, 1, 1, 'product/c7pwfrpkiqqdlbbb1fb6');
insert into products values(4, 'Laptop Acer Aspire 3', 4,"650","6500", "650", "100","This is a product", "2021-11-30 08:20:30", "2022-01-16 09:30:00", 0, 0, 2, 0,1,1);
insert into products values(5, 'Laptop ASUS Gaming ROG', 4,"1000","1000", "1000", "100","This is a product", "2021-11-30 08:20:30", "2022-01-16 09:30:00", 0, 0, 2, 1,1,1);
insert into products values(6, 'Surface Pro 7', 4,"900","9000", "900", "150","This is a product", "2021-11-30 08:20:30", "2022-01-16 09:30:00", 0, 0, 2, 1,1,1);
insert into products values(7, 'Samsung Galaxy Z Fold3 5G', 5,"1800","18000" ,"1800", "200","This is a product", "2021-11-30 08:20:30", "2022-01-16 09:30:00", 0, 0, 2,1,1,1);
insert into products values(8, 'Samsung Galaxy S21 Ultra 5G', 5,"800","8000", "800", "100","This is a product", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 0, 0, 2, 1,1,1);
insert into products values(9, 'Samsung Galaxy Z Flip3 5G', 5,"900","9000", "900", "100","This is a product", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 0, 0, 2, 1,1,1);
insert into products values(10, 'Apple iPad Pro 12.9 2021 M1 5G 256GB', 6,"1300","13000", "1300", "150","This is a product", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 0, 0, 2, 1,1,1);
insert into products values(11, 'iPad Pro 12.9 2020 4G 128GB', 6,"1100","11000", "1100", "100","This is a product", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 0, 0, 2, 1,1,1);
insert into products values(12, 'Apple iPad mini 6 4G 256G', 6,"900","9000", "900", "100","This is a product", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 0, 0, 2, 1,1,1);
insert into products values(13, 'Samsung Galaxy S20 FE 256GB (Fan Edition)', 5,"500","5000", "500", "100","This is a product", "2021-11-30 08:20:30", "2022-01-04 09:30:00", 0, 0, 2, 1,1,1);
insert into products values(14, 'ASUS ROG Phone 5', 5,"800","8000", "800", "100","This is a product", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 0, 0, 2, 1,1,1);
insert into products values(15, 'Xiaomi Mi 11 Lite 5G', 5,"350","3500", "350", "100","This is a product", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 0, 0, 2, 1,1,1);
insert into products values(16, 'Samsung Galaxy Note 20 Ultra 5G', 5,"1000","10000", "1000", "100","This is a product", "2021-11-30 08:20:30", "2022-01-04 09:30:00", 0, 0, 2, 1,1,1);
insert into products values(17, 'Xiaomi Pad 5', 6,"400","4000", "400", "100","This is a product", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 0, 0, 2, 1,1,1);
insert into products values(18, 'Samsung Galaxy Tab S7', 6,"800","8000", "800", "100","This is a product", "2021-11-30 08:20:30", "2022-01-04 09:30:00", 0, 0, 2, 1,1,1);
insert into products values(19, 'Samsung Galaxy Tab S7 Plus', 6,"1050","10500", "1050", "100","This is a product", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 0, 0, 2, 1,1,1);

insert into activeProducts value(1);
insert into activeProducts value(2);
insert into activeProducts value(3);
insert into activeProducts value(4);
insert into activeProducts value(5);
insert into activeProducts value(6);
insert into activeProducts value(7);
insert into activeProducts value(8);
insert into activeProducts value(9);
insert into activeProducts value(10);
insert into activeProducts value(11);
insert into activeProducts value(12);
insert into activeProducts value(13);
insert into activeProducts value(14);
insert into activeProducts value(15);
insert into activeProducts value(16);
insert into activeProducts value(17);
insert into activeProducts value(18);
insert into activeProducts value(19);

insert into watchlist values(1, 1);
insert into watchlist values(1, 2);
insert into watchlist values(1, 3);
insert into watchlist values(1, 4);
insert into watchlist values(1, 5);

insert into upgradelist values(1, '2021-12-19 11:34:34', 1, '2021-12-21 11:34:34');
insert into upgradelist values(5, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(6, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(7, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(8, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(9, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(10, '2022-01-04 10:15:37', -1, null);

insert into ratingHistory values (1, 2, 1, '2021-12-19 15:07', true , 'Fast transaction!');
insert into ratingHistory values (1, 2, 2, '2021-12-19 15:07', false , 'Angry!');

update products set expiredDate = "2022-01-08 17:56:00" where proId = 13;

INSERT INTO productImages (`proId`,`imgId`,`secureUrl`,`extra`) VALUES (1,'product/agai9qbgxv97t5iftqly','https://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641644901/product/agai9qbgxv97t5iftqly.jpg','{\"url\": \"http://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641644901/product/agai9qbgxv97t5iftqly.jpg\", \"etag\": \"dfb3d4970c19b59a5fa851692fdcbcdd\", \"tags\": [], \"type\": \"upload\", \"bytes\": 44034, \"width\": 612, \"format\": \"jpg\", \"height\": 612, \"api_key\": \"938665217115286\", \"version\": 1641644901, \"asset_id\": \"59349f9077f8ab686e34dee8c8e34a03\", \"signature\": \"4e4f89491731000d7d4c62bc19568be21dde413a\", \"created_at\": \"2022-01-08T12:28:21Z\", \"version_id\": \"19ee926a83c4268111f7d8371cb34a5c\", \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}');
INSERT INTO productImages (`proId`,`imgId`,`secureUrl`,`extra`) VALUES (1,'product/fevmdpyfokmfox1cyqyw','https://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641644901/product/fevmdpyfokmfox1cyqyw.jpg','{\"url\": \"http://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641644901/product/fevmdpyfokmfox1cyqyw.jpg\", \"etag\": \"6ba65ca4fde3ad8db3be5dc96953b73f\", \"tags\": [], \"type\": \"upload\", \"bytes\": 20009, \"width\": 612, \"format\": \"jpg\", \"height\": 612, \"api_key\": \"938665217115286\", \"version\": 1641644901, \"asset_id\": \"dd01fb083f993cd0f92d33de588e4b33\", \"signature\": \"d5b8647c93e1e823b2e316d8e1cafc5443407ff9\", \"created_at\": \"2022-01-08T12:28:21Z\", \"version_id\": \"19ee926a83c4268111f7d8371cb34a5c\", \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}');
INSERT INTO productImages (`proId`,`imgId`,`secureUrl`,`extra`) VALUES (1,'product/gyycfz5xgvybz8ash12a','https://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641644901/product/gyycfz5xgvybz8ash12a.jpg','{\"url\": \"http://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641644901/product/gyycfz5xgvybz8ash12a.jpg\", \"etag\": \"fcf290c61b88ec2bf85fbdc88ab1811c\", \"tags\": [], \"type\": \"upload\", \"bytes\": 25401, \"width\": 612, \"format\": \"jpg\", \"height\": 612, \"api_key\": \"938665217115286\", \"version\": 1641644901, \"asset_id\": \"6cd11271d5a70972d38c0e52fc7e3c62\", \"signature\": \"5ec7b10bfc5c01beb4870bc378294ded4c83b8c3\", \"created_at\": \"2022-01-08T12:28:21Z\", \"version_id\": \"19ee926a83c4268111f7d8371cb34a5c\", \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}');
INSERT INTO productImages (`proId`,`imgId`,`secureUrl`,`extra`) VALUES (1,'product/pchxirhd31r0ptsprgji','https://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641644901/product/pchxirhd31r0ptsprgji.jpg','{\"url\": \"http://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641644901/product/pchxirhd31r0ptsprgji.jpg\", \"etag\": \"b73e5e0531e36ec2e98fcecca440f35e\", \"tags\": [], \"type\": \"upload\", \"bytes\": 32167, \"width\": 500, \"format\": \"jpg\", \"height\": 500, \"api_key\": \"938665217115286\", \"version\": 1641644901, \"asset_id\": \"05f0a4034c261e3fb45ab54a40c9bb6a\", \"signature\": \"de7f125b4705d636f7221017dd528db1b9e4dc56\", \"created_at\": \"2022-01-08T12:28:21Z\", \"version_id\": \"19ee926a83c4268111f7d8371cb34a5c\", \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}');
INSERT INTO productImages (`proId`,`imgId`,`secureUrl`,`extra`) VALUES (2,'product/hav2jd8fakluchw6onit','https://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645087/product/hav2jd8fakluchw6onit.jpg','{\"url\": \"http://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645087/product/hav2jd8fakluchw6onit.jpg\", \"etag\": \"6fad0ea1f5082e882a66137d0f48d3e9\", \"tags\": [], \"type\": \"upload\", \"bytes\": 40269, \"width\": 500, \"format\": \"jpg\", \"height\": 500, \"api_key\": \"938665217115286\", \"version\": 1641645087, \"asset_id\": \"4d5f19f79af95291853a6070ab88bafa\", \"signature\": \"016e4e8ad94a67b5a04a4c65c678f82e269d6eb5\", \"created_at\": \"2022-01-08T12:31:27Z\", \"version_id\": \"839d7561f253b2bade5d868ff711d273\", \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}');
INSERT INTO productImages (`proId`,`imgId`,`secureUrl`,`extra`) VALUES (2,'product/quoodku30kjlzhkht00c','https://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645087/product/quoodku30kjlzhkht00c.jpg','{\"url\": \"http://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645087/product/quoodku30kjlzhkht00c.jpg\", \"etag\": \"9dd0f07ad922f5b314a4f30b94a5b780\", \"tags\": [], \"type\": \"upload\", \"bytes\": 32950, \"width\": 500, \"format\": \"jpg\", \"height\": 500, \"api_key\": \"938665217115286\", \"version\": 1641645087, \"asset_id\": \"37764da569ca57107e8e80087adc193e\", \"signature\": \"f2c2215899b65f972e474e1aa5999cd448bad7d1\", \"created_at\": \"2022-01-08T12:31:27Z\", \"version_id\": \"839d7561f253b2bade5d868ff711d273\", \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}');
INSERT INTO productImages (`proId`,`imgId`,`secureUrl`,`extra`) VALUES (2,'product/uufpshrmdrmky831pk2h','https://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645087/product/uufpshrmdrmky831pk2h.jpg','{\"url\": \"http://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645087/product/uufpshrmdrmky831pk2h.jpg\", \"etag\": \"390ebf4a3bf00bc198c5cc6173c982cf\", \"tags\": [], \"type\": \"upload\", \"bytes\": 31200, \"width\": 500, \"format\": \"jpg\", \"height\": 500, \"api_key\": \"938665217115286\", \"version\": 1641645087, \"asset_id\": \"06b23f42a704446ddf5c3ded440f1e95\", \"signature\": \"fa1a7577308132ee6aa544325bd9569f1feabe72\", \"created_at\": \"2022-01-08T12:31:27Z\", \"version_id\": \"839d7561f253b2bade5d868ff711d273\", \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}');
INSERT INTO productImages (`proId`,`imgId`,`secureUrl`,`extra`) VALUES (2,'product/vzoea7haaji6ycnvuegl','https://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645087/product/vzoea7haaji6ycnvuegl.jpg','{\"url\": \"http://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645087/product/vzoea7haaji6ycnvuegl.jpg\", \"etag\": \"cf38623208a2de3260ae3da3ccc8737b\", \"tags\": [], \"type\": \"upload\", \"bytes\": 21737, \"width\": 500, \"format\": \"jpg\", \"height\": 500, \"api_key\": \"938665217115286\", \"version\": 1641645087, \"asset_id\": \"adf0a47c746ad09d6db89eae9cc4dab5\", \"signature\": \"c710a77d0ac3e2a6a0b5906d5c03fb12ae6260f0\", \"created_at\": \"2022-01-08T12:31:27Z\", \"version_id\": \"839d7561f253b2bade5d868ff711d273\", \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}');
INSERT INTO productImages (`proId`,`imgId`,`secureUrl`,`extra`) VALUES (2,'product/xqgvfcpcjwta8nuwwsbf','https://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645087/product/xqgvfcpcjwta8nuwwsbf.jpg','{\"url\": \"http://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645087/product/xqgvfcpcjwta8nuwwsbf.jpg\", \"etag\": \"7eeee32d11bdf1128a46d29b436d09d0\", \"tags\": [], \"type\": \"upload\", \"bytes\": 8651, \"width\": 500, \"format\": \"jpg\", \"height\": 500, \"api_key\": \"938665217115286\", \"version\": 1641645087, \"asset_id\": \"2c27539a672fa42f3eceec225f2e5543\", \"signature\": \"d6ec5c4b60a2571b5dacaa3c42365c97336637c5\", \"created_at\": \"2022-01-08T12:31:27Z\", \"version_id\": \"839d7561f253b2bade5d868ff711d273\", \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}');
INSERT INTO productImages (`proId`,`imgId`,`secureUrl`,`extra`) VALUES (3,'product/c7pwfrpkiqqdlbbb1fb6','https://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645487/product/c7pwfrpkiqqdlbbb1fb6.jpg','{\"url\": \"http://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645487/product/c7pwfrpkiqqdlbbb1fb6.jpg\", \"etag\": \"0dcb38fd5033d4309567c4cd72d4d6bf\", \"tags\": [], \"type\": \"upload\", \"bytes\": 13597, \"width\": 600, \"format\": \"jpg\", \"height\": 600, \"api_key\": \"938665217115286\", \"version\": 1641645487, \"asset_id\": \"d373c807139ebf16bf819c4ef3305cbb\", \"signature\": \"e4e48ead646833d737de8660ef8a1b6b004f05ac\", \"created_at\": \"2022-01-08T12:38:07Z\", \"version_id\": \"26321cd70e49eb91fc9dd6e1d235a898\", \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}');
INSERT INTO productImages (`proId`,`imgId`,`secureUrl`,`extra`) VALUES (3,'product/eetryq3u2zmghohiafb8','https://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645488/product/eetryq3u2zmghohiafb8.jpg','{\"url\": \"http://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645488/product/eetryq3u2zmghohiafb8.jpg\", \"etag\": \"313d6e5a51da9b58bd87d46f1a0b5314\", \"tags\": [], \"type\": \"upload\", \"bytes\": 32603, \"width\": 600, \"format\": \"jpg\", \"height\": 600, \"api_key\": \"938665217115286\", \"version\": 1641645488, \"asset_id\": \"5c1078e5176ae2181032009461c508c3\", \"signature\": \"a38275abf11d42cb6621b23a0dda3c38fa9dcc72\", \"created_at\": \"2022-01-08T12:38:08Z\", \"version_id\": \"4c800f759ba550647bbd6539a3725462\", \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}');
INSERT INTO productImages (`proId`,`imgId`,`secureUrl`,`extra`) VALUES (3,'product/nabl18pqzmz7jwkyehsq','https://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645487/product/nabl18pqzmz7jwkyehsq.jpg','{\"url\": \"http://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645487/product/nabl18pqzmz7jwkyehsq.jpg\", \"etag\": \"e90de74a0bfeb57648296e207443d418\", \"tags\": [], \"type\": \"upload\", \"bytes\": 13686, \"width\": 600, \"format\": \"jpg\", \"height\": 600, \"api_key\": \"938665217115286\", \"version\": 1641645487, \"asset_id\": \"72d4e491f13779f13a0c3795a763991a\", \"signature\": \"fe044c177137ade610c12cefbddca729cab25a93\", \"created_at\": \"2022-01-08T12:38:07Z\", \"version_id\": \"26321cd70e49eb91fc9dd6e1d235a898\", \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}');
INSERT INTO productImages (`proId`,`imgId`,`secureUrl`,`extra`) VALUES (3,'product/yedmdwke00h6jmc2zrha','https://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645488/product/yedmdwke00h6jmc2zrha.jpg','{\"url\": \"http://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645488/product/yedmdwke00h6jmc2zrha.jpg\", \"etag\": \"4168f903cb44d0384571707eba02d3a2\", \"tags\": [], \"type\": \"upload\", \"bytes\": 39246, \"width\": 500, \"format\": \"jpg\", \"height\": 500, \"api_key\": \"938665217115286\", \"version\": 1641645488, \"asset_id\": \"54159796bc38bd961f516ec8a342d462\", \"signature\": \"9bcd3650517274fda418d43adc3a66424f538816\", \"created_at\": \"2022-01-08T12:38:08Z\", \"version_id\": \"4c800f759ba550647bbd6539a3725462\", \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}');
INSERT INTO productImages (`proId`,`imgId`,`secureUrl`,`extra`) VALUES (3,'product/zqs6vw3xo8iaihbxc2kf','https://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645488/product/zqs6vw3xo8iaihbxc2kf.jpg','{\"url\": \"http://res.cloudinary.com/popcorn-software-engineering/image/upload/v1641645488/product/zqs6vw3xo8iaihbxc2kf.jpg\", \"etag\": \"aa21bd69045609f9ca9cf013cba2ba04\", \"tags\": [], \"type\": \"upload\", \"bytes\": 28868, \"width\": 500, \"format\": \"jpg\", \"height\": 500, \"api_key\": \"938665217115286\", \"version\": 1641645488, \"asset_id\": \"0da5b8de749d4a522444db0667687618\", \"signature\": \"34c7ed9a16efce3ec840927bcef915c56fde66e9\", \"created_at\": \"2022-01-08T12:38:08Z\", \"version_id\": \"4c800f759ba550647bbd6539a3725462\", \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}');

update products set bidderId = 1 where proid = 13;
update products set expiredDate = "2022-01-08 17:56:00" where proId = 13 ;
