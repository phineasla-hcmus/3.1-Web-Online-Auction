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

insert into products values(1, 'Laptop Lenovo Ideapad 3', 4,"500","5000", "500", "100","This is a product", "2021-11-30 08:20:30", "2022-01-25 09:30:00", 0, 0, 2, 0,1,1);
insert into products values(2, 'Laptop HP', 4, "550", "5500", "550", "100","This is a product", "2021-11-30 08:20:30", "2022-01-25 09:30:00",0 , 0, 2, 0,1,1);
insert into products values(3, 'Laptop ASUS Vivobook', 4,"700","7000", "700", "100","This is a product", "2021-11-30 08:20:30", "2022-01-16 09:30:00", 0, 0, 2, 0,1,1);
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

insert into upgradelist values(1, '2021-12-19 11:34:34', -1, '2021-12-21 11:34:34');
insert into upgradelist values(5, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(6, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(7, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(8, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(9, '2022-01-04 10:15:37', -1, null);
insert into upgradelist values(10, '2022-01-04 10:15:37', -1, null);

insert into ratingHistory values (1, 2, 1, '2021-12-19 15:07', true , 'Fast transaction!');
insert into ratingHistory values (1, 2, 2, '2021-12-19 15:07', false , 'Angry!');