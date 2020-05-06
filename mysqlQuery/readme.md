
- Query to create tables for server
```mysql
CREATE TABLE `tablename_here`
(`authId` varchar(50) NOT NULL,
  `flag` varchar(45) DEFAULT '"0:a"',
  `name` varchar(45) NOT NULL,
  `expireStamp` int(20) NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`authId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```
- Query to update server table
```mysql
ALTER TABLE `GGVIPlist`.`mumbaiRetake` 
ADD COLUMN `created_at` DATETIME NOT NULL AFTER `expireStamp`;
```

- Query to create user table
```mysql
CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `sec_key` varchar(45) NOT NULL,
  `user_type` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1
```
- Query to insert and admin 
```mysql
INSERT INTO `GGVIPlist`.`tbl_users` (`username`, `password`, `sec_key`, `user_type`) VALUES ('your_admin_name_here', 'your_Admin_pass_here', 'your_admin_auth_key_here','1 for superuser, 0 for normal');