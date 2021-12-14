USE `onlineauction`;

insert into roles values(1, 'Unverified');
insert into roles values(2, 'Bidder');
insert into roles values(3, 'Seller');
insert into roles values(4, 'Admin');

insert into categories values(1, 'Electronics', null);
insert into categories values(2, 'Furniture', null);
insert into categories values(3, 'Houseware', null);
insert into categories values(4, 'Laptop', 1);
insert into categories values(5, 'Phone', 1);
insert into categories values(6, 'iPad', 1);
insert into categories values(7, 'Bed', 2);
insert into categories values(8, 'Desk', 2);
insert into categories values(9, 'Cabinet', 2);
insert into categories values(10, 'Coffee press', 3);
insert into categories values(11, 'Chopping board', 3);
insert into categories values(12, 'Baking dish', 3);

insert into users values(1, "tmnguyen@gmail.com", "$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G", "Tam", "Nguyen", "2001-10-12", "somewhere in the universe", 1);
insert into users values(2, "a@gmail.com", "$2a$10$knCAXg.TOhk69XK246nUnOhSNvM3fR5PjVWVR1cY5y6VecpatGh8G", "Hong", "Du Shik", "1995-10-12", "somewhere", 1);

insert into products values(1, 'Laptop Lenovo Ideapad 3', "https://cdn.cellphones.com.vn/media/catalog/product/cache/7/image/9df78eab33525d08d6e5fb8d27136e95/l/a/laptop-ksp-v2-004.jpg", 4, "500", "450", "abc", "2021-11-30", "2021-12-15", 4, 1);
insert into products values(2, 'Laptop HP', "https://cdn.cellphones.com.vn/media/catalog/product/cache/7/image/9df78eab33525d08d6e5fb8d27136e95/5/c/5cb9252e618c4537be38b0b8ea227d29-2.jpg", 4, "550", "500", "abc", "2021-11-30", "2021-12-15", 10, 1);
insert into products values(3, 'Laptop ASUS Vivobook', "https://cdn.cellphones.com.vn/media/catalog/product/cache/7/image/9df78eab33525d08d6e5fb8d27136e95/_/0/_0003_rwo2bv-ksp.jpg", 4, "700", "600", "abc", "2021-11-30", "2021-12-15", 5, 1);
insert into products values(4, 'Laptop Acer Aspire 3', "https://cdn.cellphones.com.vn/media/catalog/product/cache/7/image/9df78eab33525d08d6e5fb8d27136e95/1/_/1_66_5.jpg", 4, "650", "600", "abc", "2021-11-30", "2021-12-05", 2, 1);
insert into products values(5, 'Laptop ASUS Gaming ROG', "https://cdn.cellphones.com.vn/media/catalog/product/cache/7/image/9df78eab33525d08d6e5fb8d27136e95/l/a/laptop-asus-rog-strix-g15-g513ih-hn015t-1-jj.jpg", 4, "1000", "900", "abc", "2021-11-30", "2021-12-15", 9, 1);
insert into products values(6, 'Surface Pro 7', "https://cdn.cellphones.com.vn/media/catalog/product/cache/7/image/9df78eab33525d08d6e5fb8d27136e95/s/u/surface-pro-7-2_1-ksp00978v2.jpg", 4, "900", "850", "abc", "2021-11-30", "2021-12-15", 8, 1);

insert into watchlist values(1, 1);
insert into watchlist values(1, 2);
insert into watchlist values(1, 3);
insert into watchlist values(1, 4);
insert into watchlist values(1, 5);
