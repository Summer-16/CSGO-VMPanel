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