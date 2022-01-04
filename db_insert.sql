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
insert into users values(2, 'a@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Hong', 'Du Shik', '1995-10-12', 'somewhere', null, 1);
insert into users values(3, 'leesuby@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Hong', 'Phuc', '2001-10-12', 'somewhere in the universe', 7, 3);
insert into users values(4, 'admin@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Long', 'Long', '2001-10-12', 'somewhere in the universe', 8, 4);
-- sample data used for [admin] manage users
insert into users values(5, 'hoho1@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Ai', 'Zay', '2001-10-12', 'abc', null, 2);
insert into users values(6, 'hoho2@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Ai', 'Zay', '2001-10-12', 'abc', null, 2);
insert into users values(7, 'hoho3@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Ai', 'Zay', '2001-10-12', 'abc', null, 2);
insert into users values(8, 'hoho4@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Ai', 'Zay', '2001-10-12', 'abc', null, 2);
insert into users values(9, 'hoho5@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Ai', 'Zay', '2001-10-12', 'abc', null, 2);
insert into users values(10, 'hoho6@gmail.com', '$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G', 'Ai', 'Zay', '2001-10-12', 'abc', null, 2);

insert into products values(1, 'Laptop Lenovo Ideapad 3', 4, "500", "100", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 4, 1, 2, 0);
insert into products values(2, 'Laptop HP', 4, "550", "100", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 10, 1, 2, 0);
insert into products values(3, 'Laptop ASUS Vivobook', 4, "700", "100", "2021-11-30 08:20:30", "2022-01-16 09:30:00", 5, 1, 2, 0);
insert into products values(4, 'Laptop Acer Aspire 3', 4, "650", "100", "2021-11-30 08:20:30", "2022-01-16 09:30:00", 2, 1, 2, 0);
insert into products values(5, 'Laptop ASUS Gaming ROG', 4, "1000", "100", "2021-11-30 08:20:30", "2022-01-16 09:30:00", 9, 1, 2, 1);
insert into products values(6, 'Surface Pro 7', 4, "900", "150", "2021-11-30 08:20:30", "2022-01-16 09:30:00", 8, 1, 2, 1);
insert into products values(7, 'Samsung Galaxy Z Fold3 5G', 5, "1800", "200", "2021-11-30 08:20:30", "2022-01-16 09:30:00", 8, 1, 2,1);
insert into products values(8, 'Samsung Galaxy S21 Ultra 5G', 5, "800", "100", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 8, 1, 2, 1);
insert into products values(9, 'Samsung Galaxy Z Flip3 5G', 5, "900", "100", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 8, 1, 2, 1);
insert into products values(10, 'Apple iPad Pro 12.9 2021 M1 5G 256GB', 6, "1300", "150", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 8, 1, 2, 1);
insert into products values(11, 'iPad Pro 12.9 2020 4G 128GB', 6, "1100", "100", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 8, 1, 2, 1);
insert into products values(12, 'Apple iPad mini 6 4G 256G', 6, "900", "100", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 8, 1, 2, 1);
insert into products values(13, 'Samsung Galaxy S20 FE 256GB (Fan Edition)', 5, "500", "100", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 8, 1, 2, 1);
insert into products values(14, 'ASUS ROG Phone 5', 5, "800", "100", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 8, 1, 2, 1);
insert into products values(15, 'Xiaomi Mi 11 Lite 5G', 5, "350", "100", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 8, 1, 2, 1);
insert into products values(16, 'Samsung Galaxy Note 20 Ultra 5G', 5, "1000", "100", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 8, 1, 2, 1);
insert into products values(17, 'Xiaomi Pad 5', 6, "400", "100", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 8, 1, 2, 1);
insert into products values(18, 'Samsung Galaxy Tab S7', 6, "800", "100", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 8, 1, 2, 1);
insert into products values(19, 'Samsung Galaxy Tab S7 Plus', 6, "1050", "100", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 8, 1, 2, 1);

insert into watchlist values(1, 1);
insert into watchlist values(1, 2);
insert into watchlist values(1, 3);
insert into watchlist values(1, 4);
insert into watchlist values(1, 5);

insert into auctionhistory values(1, '2021-12-05 12:30:00', 1, 'Tam Nguyen', 500);
insert into auctionhistory values(4, '2021-12-05 12:30:00', 1, 'Tam Nguyen', 500);
insert into auctionhistory values(4, '2021-12-05 13:00:00', 2, 'Hong Du Shik', 520);
insert into auctionhistory values(4, '2021-12-06 14:20:00', 1, 'Tam Nguyen', 540);
insert into auctionhistory values(4, '2021-12-06 18:00:00', 2, 'Hong Du Shik', 560);

insert into upgradelist values(1, '2021-12-19 11:34:34', -1, '2021-12-21 11:34:34');
insert into upgradelist values(5, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(6, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(7, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(8, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(9, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(10, '2022-01-04 10:15:37', -1, null);

insert into ratingHistory values (1, 2,1, 'Hong Du Shik', '2021-12-19 15:07', true , 'Fast transaction!');
insert into ratingHistory values (1, 2, 2, 'Hong Du Shik', '2021-12-19 15:07', false , 'Angry!');