# Below are the queries mentioned in case you want to or had to manually perform any actions in MYSQL

- Query to manually create tables for server
```mysql
CREATE TABLE `table_name_here` (
  `authId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `flag` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT '"0:a"',
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expireStamp` int(20) NOT NULL,
  `created_at` datetime NOT NULL,
  `type` int(20) NOT NULL,
  PRIMARY KEY (`authId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
```

- Query to manually create user table
```mysql
CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sec_key` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_type` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
```

- Query to manually insert and admin 
```mysql
INSERT INTO `GGVIPlist`.`tbl_users` (`username`, `password`, `sec_key`, `user_type`) VALUES ('your_admin_name_here', 'your_Admin_pass_here', 'your_admin_auth_key_here','1 for superuser, 0 for normal');
```

- Query to create sales table manually
```mysql
CREATE TABLE `tbl_sales` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `order_id` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
 `payer_id` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
 `payer_steamid` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
 `payer_email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
 `payer_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
 `payer_surname` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
 `product_desc` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
 `amount_paid` int(20) NOT NULL,
 `amount_currency` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
 `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
 `sale_type` tinyint(4) NOT NULL,
 `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
```

- Query to create tbl_servers table manually
```mysql
CREATE TABLE `tbl_servers` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `tbl_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
 `server_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
 `server_ip` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
 `server_port` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
 `server_rcon_pass` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
 `vip_slots` int(20) DEFAULT NULL,
 `vip_price` int(20) DEFAULT NULL,
 `vip_currency` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
 `vip_flag` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
 `created_at` datetime DEFAULT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
```

- Query to create tbl_settings table manually
```mysql
CREATE TABLE `tbl_settings` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `setting_key` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
 `setting_value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
```

- Query to update table accroding to changes of v1.6
```mysql
ALTER TABLE `tbl_sales` CHANGE `payer_surname` `payer_surname` VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;
ALTER TABLE `tbl_sales`  ADD `payment_gateway` VARCHAR(20) NOT NULL  AFTER `id`;
```