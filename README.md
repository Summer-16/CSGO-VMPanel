# CSGO Vip Management System
This system makes the adding of vip in csgo community server's super easy, all you gotta do is add them from panel and forget system will automatically add them in server from db and delete them when their subscription expires and it comes with a handy webpanel.

## Nodejs Server
- It is main server to manage and maintain everything, from database to vip addition , deletion and notification.
- You will get a webpanel with forms to add new vip and update/extend time for old vip and A home page with listing of all vips server wise with their vip subscription details.
- Panel will automatically delete the expired vips from database (no worries of managing time for vip anymore)
- Everyday Panel will send the latest vip list to your discord server.
 

## Server Script
- A bash Script need to be added with csgo servers , and it will fetch all the vips from db and add them to server's simple_admin.ini 
- this script must be added in cron

## Step-by-Step install Instructions
### Setting Up the mysql databse first
- Query to create tables for server
```mysql
CREATE TABLE `tablename_here`
(`authId` varchar(50) NOT NULL,
  `flag` varchar(45) DEFAULT '"0:a"',
  `name` varchar(45) NOT NULL,
  `expireStamp` int(20) NOT NULL,
  PRIMARY KEY (`authId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```
- Query to create user table
```mysql
CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `sec_key` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1
```
- Query to insert and admin 
```mysql
INSERT INTO `GGVIPlist`.`tbl_users` (`username`, `password`, `sec_key`) VALUES ('your_admin_name_here', 'your_Admin_pass_here', 'your_admin_auth_key_here');
```

### Setting Up the node server
- Inside your prefered directory open the linux terminal.
- run the following commands
```bash
git clone https://github.com/Summer-16/CSGO-VMP.git
cd CSGO-VMP/panelServer/
npm i
cd app/config/
mv example_config.json config.json
vim config.json
```
- Now inside config file add your database details in db object
- server tables list in servers array (just write the name of tables which you made in database corresponding to servers)
- your discord server webhook url in webhook for notifications
- and a secure key for jwt (remebeer to add a strong key)
- save the file and get back to panelServer directory
```bash
cd ..
cd ..
node server.js
```
- At this point your server will be running and you can use it but it will stop if u terminate the server or system restart so we need to add it into the service
- to add your server into the service run the following commands in panelServer directory
```bash
npm install -g forever
npm install -g forever-service
sudo forever-service install vmpService --script server.js
```
- Once done you will get info on your terminal how to start, stop and restart the service using your OS service manaher which indicate the successfull execution of command.
- At this point you are good to go and add the bash file in all your servers.

### Adding bash file in servers
- Copy the script from serverScript folder add into your csgo server 
- Update your db cred and admins_simple.ini path in the script and add the script into cron


## Future features 
- Delete option from panel
