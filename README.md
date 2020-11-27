# CSGO Vip Management Panel

### Single solution to manage VIPs and Admins in your CSGO servers.

### If you like my work, consider donating to the project and support me. Thank You
[![Donate](https://cdn2.iconfinder.com/data/icons/social-icons-circular-color/512/paypal-64.png)](https://www.paypal.me/Shivam169)  [![Donate](https://cdn2.iconfinder.com/data/icons/social-icons-circular-color/512/paytm-64.png)](https://drive.google.com/file/d/1ks_B3s9dNk_RPkDVf1DL1ITKe0mnrTRk/view)  [![Donate](https://cdn1.iconfinder.com/data/icons/logos-brands-in-colors/436/Google_Pay_GPay_Logo-128.png)](https://drive.google.com/file/d/1c5V8j0W9o23HBCgUiO1SWltR4ADvQTQW/view)  [![Discord](https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/91_Discord-64.png)](https://discord.gg/HcCFa8q)  

-------------------------------------------------------------

## System Requirements

### Web Server (panelServer)
- MySQL Server : 5.6 or higher (8.0 or higher is recommended)
- NodeJS       : 10.x or higher

## CS-GO server (gamesServer)
- Sourcemod    : 1.9 or higher

## Panel Features 1.9 (Changelogs)
- Various UI fixes.
- Sourceban page steam profile data fetch tool fixed.
- Fixed an error in the user dashboard where the renew button doesn't work if 10/10 slots are sold.
- Added Feature to hide admin login form from the public display;
- Added Feature to enable discord notifications for VIP sales.
- Updated MySQL client library from MySQL to mysql2 in panelServer application for better compatibility with MySQL 8.x servers (Mainly new authentication method)
- Updated Bundle buy functions with various checks to detect pre-own VIP to update the VIP
- Code Optimizations and Performance improvements
- Plugin Updated Following features added:
    -Added types of VIP expiry alert (you can choose between Menu alert and Chat alert)

## Panel Features v1.8
- Add VIP or Admin to servers.
- While adding VIP subscription days are entered and once subscription days finished panel will automatically delete that VIP and remove it from the CSGO server too.
- You can also manually delete the VIP and Admins from the panel.
- A user data fetch tool to make it easy to add VIP and Admins just enter the user steam profile URL and the panel will fetch all the info for you (no more using steam id finders)
- Automatic deletion of VIPs whose subscription days are ended.
- Daily notification on your discord server with the latest Listing for all servers.
- A handy dashboard to see all at a glance
- You can create, delete sub-users, and super users in panel handy in case you want multiple admins for panel multiple admins.
- Don't like the default red, don't worry I got you covered, you can change theme color in panel settings.
- CSGO server plugin is available which syncs all the entries from your panel database to the CSGO server.
- A shell script is also available. (used to do plugin work in old versions, but it still works so it's there)
- Note (I recommend using plugin until and unless u r trying to do custom solutions with a shell script. If you are using shell script you will have to manually create server tables in the database.)
- Added RCON feature therefore now as soon as you add any admin or VIP it gets updated in the respective CSGO server through RCON by the panel's plugin
- Added Steam login for Users
- Added Paypal for VIP buy and renew feature
- User can log in through steam and then he can see the status of his VIP subscription in all servers, can buy new VIP, and Renew old VIP through PayPal
- Sales record for Admin
- New Features at Dashboard like (Server list with connecting feature and other stats for Admin)
- PayU Money payment gateway (PayU Payment gateway is for Indian Users only as it does transactions in rupee)
- Panel audit logs
- Server bundles for selling and buying multiple server VIP at once 
- New setting option added to enable disable VIP listing on a public dashboard
- Sourceban integration (You can add Bans and Comm Bans)
- Plugin Updated Following features added:
    -Optimized database connection
    -Added a Command to check VIP Subscription status
    -Added Alert about expiring VIP Subscription
    -Added an Admin command to add VIP through Console
    -Commands updated for better nomenclature (!vipRefresh, !vipStatus, !addVip) . 
    -Note, Commands are case sensitive and the status command will not work for old entries, it will work for entries made with v1.8 and higher.

### I recommend using PayU for INR transactions (Indian payment gateway) and PayPal for USD transactions, Note: don't enable both with USD as PayU does not support USD.

## Web panel Screenshots
![ScreenShot](https://github.com/Summer-16/CSGO-VMP/blob/master/screenshots/VMP_SS.jpg)
[View All ScreenShots](https://github.com/Summer-16/CSGO-VMPanel/tree/master/screenshots)

## Step-by-Step install Instructions for New Installation 
### Setting Up the node server
- NOTE: This is a Node.Js based application so do not try to install it as a PHP application (drag and drop in www folder will not work), so just read the instructions it's super easy :)
- Install Node.Js first if not installed https://nodejs.org/en/download/
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
- Now inside the config file add your database details in the DB object
- Your Steam API key for Steam login to work (get key here https://steamcommunity.com/dev)
- and a secure key for jwt (remember to add a strong key)
- and a secret key for app (remember to add a strong key)
- Your Paypal client Id for automatic VIP buy and renewal to work (instructions to get key here https://developer.paypal.com/docs/archive/checkout/integrate/#5-go-live)
- Like same, you can enable PayU payment gateway (set enabled: true, environment 'live' for live payments 'test' for testing)
- and you PayU Merchant Key and Salt which is available in your PayU Dashboard.
- save the file and get back to panelServer directory
```bash
cd ..
cd ..
node server.js
```
- At this point, your server will be running  on the default port mentioned in config or the port you defined (updated in config)
- To access the server type in your machine or VM instance URL/public IP in the browser along with port (example: localhost:3534, 127.0.0.1:3535) and you can use the panel but it will stop if u terminate the server or system restart so we need to add it into the service
- to add your server into the service run the following commands in panelServer directory
```bash
npm install pm2 -g
pm2 start server.js
```
- At this point, your server is running as a service by pm2 but we still need to save the pm2 config, so now do
```bash
pm2 save
pm2 l
```
- Now pm2 config is saved and pm2 l, must have given you the list of node servers being run by pm2 id no other server was added in pm2 earlier then your server must have id 0, therefore we can use this id to start, restart and stop the server with following commands
```bash
pm2 start 0
pm2 restart 0
pm2 stop 0
```
- Logging into the server, your server is running and your default username: admin and password: password, use these creds to login to the Panel, go to panel setting create your own superuser, switch to your user, and delete the default user.
- At this point, you are good to go and install the plugin on all your servers.
- If you want to remove the port from the URL then use the following apache2 config, After adding the apache config you will need to update your vmpanel config.json to make the apache proxy variable true, and add a new hostname defined in the virtual host in the hostname.
```bash
<VirtualHost *:80>
 ServerAdmin webmaster@localhost
 ServerName vip.example.com


  ProxyRequests off

    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>

    <Location />
        ProxyPass http://localhost:3535/
        ProxyPassReverse http://localhost:3535/
    </Location>

</VirtualHost>
```

### Install plugin in CSGO server
- go to gameServer folder inside the plugin folder copy the addon and cfg folder
- paste into your CSGO server's CSGO folder now go to cfg/sourcemod/vmpanel.cfg
- open the cfg file add a table name for your server something like sv_servername
- Restart the server, and check if the plugin is working without any errors
- now add an entry named vmpanel in your database.cfg and add the database cred for the same database used for panel
- Command for plugin (!vipRefresh, !vipStatus, !addVip)
- After installing the plugin, add the server in the panel using the following steps
- Open panel, login as admin, go to panel settings, click manage servers, fill up the details in add new server.
- Note that u need fill the server table name as same as you filled in the server cfg file of plugin (refer to the screenshot, 1->In Server CFG, 2->In Panel)

![ScreenShot](https://github.com/Summer-16/CSGO-VMP/blob/master/screenshots/add_server_cfg.PNG)
![ScreenShot](https://github.com/Summer-16/CSGO-VMP/blob/master/screenshots/add_server_panel.PNG)

### Adding bash file in servers (old method) (not needed if you using the plugin)
- Copy the script from serverScript folder add to your CSGO server 
- Update your DB cred and admins_simple.ini path in the script and add the script into cron

## Updating from v1.8 to 1.9
- Stop your panel service while updating
- Add files from the latest source code to yours installed directory
- Add the following code in your config, see example config for reference 
```
  "app": {
    "secret": "add some randomly generated string here min 32length"
  },
```
- execute the below queries in your database
```mysql
INSERT INTO `tbl_settings` (`setting_key`, `setting_value`) VALUES ('hiddenadmin_login', '0');
INSERT INTO `tbl_settings` (`setting_key`, `setting_value`) VALUES ('salenotification_discord', '0');
```
- Now restart your server and you are good to go
