# CSGO Vip Management Panel
[![Donate](https://cdn2.iconfinder.com/data/icons/social-icons-circular-color/512/paypal-64.png)](https://www.paypal.me/Shivam169)  [![Donate](https://cdn2.iconfinder.com/data/icons/social-icons-circular-color/512/paytm-64.png)](https://drive.google.com/file/d/1ks_B3s9dNk_RPkDVf1DL1ITKe0mnrTRk/view)  [![Donate](https://cdn.iconscout.com/icon/free/png-64/upi-bhim-transfer-1795405-1522773.png)](https://drive.google.com/open?id=1VYYThJS78Pp6yyIU0lCIC4j7ef5a4G0l)  [![Discord](https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/91_Discord-64.png)](https://discord.gg/HcCFa8q)  
### Single solution to mange VIPs and Admins in your CSGO servers.

## Panel Features v1.5
- Add VIP or Admin to servers.
- While adding VIP subscription days are entered and once subscription days finished panel will automatically delete that VIP and remove it from the CSGO server too.
- You can also manually delete the VIP and Admins from the panel.
- A user data fetch tool to make it easy to add VIP and Admins just enter the user steam profile URL and panel will fetch all the info for you (no more using steam id finders)
- Automatic deletion of VIPs whose subscription days are ended.
- Daily notification on your discord server with the latest Listing for all servers.
- A handy dashboard to see all at a glance
- You can create, delete sub-users and super users in panel handy in case you want multiple admins for panel multiple admins.
- Don't like the default red, don't worry I got you covered, you can change theme color in panel settings.
- CSGO server plugin is available which syncs all the entries from your panel database to the CSGO server.
- A shell script is also available. (used to do plugin work in old versions, but it still works so it's there)
- Note (I recommend using plugin until and unless u r trying to do custom solutions with a shell script. If you are using shell script you will have to manually create server tables in the database.)
- Added RCON feature therefore now as soon as you add any admin or VIP it gets updated in respective CSGO server through RCON by the panel's plugin
- Added Steam login for Users
- Added Paypal for VIP buy and renew feature
- User can log in through steam and then he can see the status of his VIP subscription in all servers, can buy new VIP and Renew old VIP through PayPal
- Sales record for Admin
- New Features at Dashboard like (Server list with connecting feature and other stats for Admin)

## Webpanel Screenshots
![ScreenShot](https://github.com/Summer-16/CSGO-VMP/blob/master/screenshots/VMP_SS.jpg)


## Step-by-Step install Instructions for New Installation 
#### (these instructions apply to current dev code if you are installing v1.4 then follow the instructions given in its zip)
Always install the latest released version and follow the instructions available inside the readme of downloaded release.
I don't recommend installing under-development builds as they may have errors. 

### Setting Up the node server
- Install nodejs first if not installed https://nodejs.org/en/download/
- Inside your preferred directory open the Linux terminal.
- run the following commands
```bash
git clone https://github.com/Summer-16/CSGO-VMP.git
cd CSGO-VMP/panelServer/
npm i
cd app/config/
mv example_config.json config.json
vim config.json
```
- Now inside config file add your database details in DB object
- Your Steam API key for Steam login to work (get key here https://steamcommunity.com/dev)
- Your Paypal client Id for automatic VIP buy and renew to work (instructions to get key here https://developer.paypal.com/docs/archive/checkout/integrate/#5-go-live)
- and a secure key for jwt (remember to add a strong key)
- save the file and get back to panelServer directory
```bash
cd ..
cd ..
node server.js
```
- At this point, your server will be running and you can use it but it will stop if u terminate the server or system restart so we need to add it into the service
- to add your server into the service run the following commands in panelServer directory
```bash
npm install -g forever
npm install -g forever-service
sudo forever-service install vmpService --script server.js
sudo service vmpService start
```
- Now your server is running and your default username: admin and password: password, use these creds to login to the Panel, go to panel setting create your own superuser, switch to your user, and delete the default user.
- At this point, you are good to go and install the plugin in all your servers.
- After installing the plugin in the server go to panel settings and add your server in the panel.

### Install plugin in CSGO server
- go to gameServer folder inside the plugin folder copy the addon and cfg folder
- paste into your CSGO server's CSGO folder now go to cfg/sourcemod/vmpanel.cfg
- open the cfg file add a table name for your server something like sv_servername
- now add an entry named vmpanel in your database,cfg and add the database cred for the same database used for panel
- Command for plugin "sm_vmprefresh"

### Adding bash file in servers (old method)
- Copy the script from serverScript folder add into your CSGO server 
- Update your DB cred and admins_simple.ini path in the script and add the script into cron

## Updating from v1.4 to v1.5
- Stop your panel service while updating
- Add files from v1.5 to yours installed directory
- Go to panelServer folder , open your linux terminal and run npm i
- Go to your config and update the following details from example config
- Your Steam API key for Steam login to work (get key here https://steamcommunity.com/dev)
- Your Paypal client Id for automatic VIP buy and renew to work (instructions to get key here https://developer.paypal.com/docs/archive/checkout/integrate/#5-go-live)
- execute below query in your database
```mysql
ALTER TABLE `tbl_servers`  ADD `vip_slots` INT(20) NOT NULL  AFTER `created_at`,  ADD `vip_price` INT(20) NOT NULL  AFTER `vip_slots`,  ADD `vip_currency` VARCHAR(45) NOT NULL  AFTER `vip_price1`,  ADD `vip_flag` VARCHAR(45) NOT NULL DEFAULT '\"0:a\"'  AFTER `vip_currency1`;
```
```mysql
INSERT INTO `tbl_settings` (`setting_key`, `setting_value`) VALUES ('community_logo_url', '\"\"'), ('community_info', 'Enter One line Info or Greeting here.....'), ('community_website', '\"\"');
```
- Now restart your server and you are good to go
