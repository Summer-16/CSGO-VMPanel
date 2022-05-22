# CSGO Vip Management Panel

### Single solution to manage VIPs and Admins in your CSGO servers.

-------------------------------------------------------------

<p align="">
<b>🙌 If you like my work, consider <a href="https://www.paypal.me/Shivam169">donating</a> to support the project. ! 🙌</b>
</p>

[![Donate](https://cdn2.iconfinder.com/data/icons/social-icons-circular-color/512/paypal-64.png)](https://www.paypal.me/Shivam169)  [![Donate](https://cdn2.iconfinder.com/data/icons/social-icons-circular-color/512/paytm-64.png)](https://drive.google.com/file/d/1ks_B3s9dNk_RPkDVf1DL1ITKe0mnrTRk/view)  [![Donate](https://cdn1.iconfinder.com/data/icons/logos-brands-in-colors/436/Google_Pay_GPay_Logo-128.png)](https://drive.google.com/file/d/1c5V8j0W9o23HBCgUiO1SWltR4ADvQTQW/view)  [![Discord](https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/91_Discord-64.png)](https://discord.gg/HcCFa8q)  

-------------------------------------------------------------

## System Requirements

### Web Server (Panel_Server)
- MySQL Server: 5.6 or higher (8.0 or higher is recommended)
- NodeJS: 10.x or higher

## CS-GO server (Plugin)
- Sourcemod: 1.9 or higher

-------------------------------------------------------------

## Panel Changelogs 1.10 - Beta
- Added Support for Admin groups in VIP and Admin.
- Fixed an Error with the login Page when trying to access the route directly.
- Updated pagination calculation function.
- Loader stuck after admin delete fixed
- Token missing error handling updated to display a proper error to the user
- Added option to disable Panel/Author card in about section
- Added file logging
- Upgraded few dependencies 

## Panel Features (Latest Stable release - v1.9)
- Add VIP or Admin to servers.
- While adding VIP subscription days are entered and once subscription days finished panel will automatically delete that VIP and remove it from the CSGO server too.
- You can also manually delete the VIP and Admins from the panel.
- A user data fetch tool to make it easy to add VIP and Admins just enter the user steam profile URL and the panel will fetch all the info for you (no more using steam id finders)
- Automatic deletion of VIPs whose subscription days are ended.
- Daily notification on your discord server with the latest Listing for all servers.
- A handy dashboard to see all at a glance
- You can create, delete sub-users, and super users in panel handy in case you want multiple admins for panel multiple admins.
- Don't like the default red, don't worry I got you covered, you can change the theme color in panel settings.
- CSGO server plugin is available which syncs all the entries from your panel database to the CSGO server.
- RCON feature to instantly sync changes in server.
- Steam login for Users
- PayPal for VIP buy and renew feature
- User can log in through steam and then he can see the status of his VIP subscription in all servers, can buy new VIP, and Renew old VIP through PayPal
- Sales record for Admin
- Features at Dashboard like (Server list with connecting feature and other stats for Admin)
- PayU Money payment gateway (PayU Payment gateway is for Indian Users only as it does transactions in rupee)
- Panel audit logs
- Server bundles for selling and buying multiple server VIP at once 
- Sourceban integration (You can add Bans and Comm Bans)
- Feature to hide admin login form from the public display;
- Feature to enable discord notifications for VIP sales.
- Plugin Updated Following features added:
    -Optimized database connection
    -Added a Command to check VIP Subscription status
    -Added Alert about expiring VIP Subscription
    -Added an Admin command to add VIP through Console
    -Commands updated for better nomenclature (!vipRefresh, !vipStatus, !addVip) . 
    -Types of VIP expiry alerts (you can choose between Menu alert and Chat alert).
    -Feature to auto add the server in the panel.
    -Note, Commands are case sensitive and the status command will not work for old entries, it will work for entries made with v1.8 and higher.

### I recommend using PayU for INR transactions (Indian payment gateway) and PayPal for USD transactions, Note: don't enable both with USD as PayU does not support USD.

-------------------------------------------------------------

## Web panel Screenshots
![ScreenShot](https://github.com/Summer-16/CSGO-VMP/blob/master/Screen_Shots/VMP_SS.jpg)
[View All ScreenShots](https://github.com/Summer-16/CSGO-VMPanel/tree/master/Screen_Shots)

-------------------------------------------------------------

## Step-by-Step install Instructions for New Installation 
### Setting Up the node server
- NOTE: This is a Node.Js based application so do not try to install it as a PHP application (drag and drop in www folder will not work), so just read the instructions it's super easy :)
- Install Node.Js first if not installed https://nodejs.org/en/download/
- Inside your preferred directory open the Linux terminal.
- run the following commands
```bash
git clone https://github.com/Summer-16/CSGO-VMP.git
cd CSGO-VMP/Panel_Server/
npm i
cd app/config/
mv example_config.json config.json
vim config.json
```
- Now inside the config file add your database details in the DB object
- Your Steam API key for Steam login to work (get key here https://steamcommunity.com/dev)
- and a secure key for jwt (remember to add a strong key)
- and a secret key for the app (remember to add a strong key)
- Your PayPal client Id for automatic VIP buy and renewal to work (instructions to get key here https://developer.paypal.com/docs/archive/checkout/integrate/#5-go-live)
- Like same, you can enable PayU payment gateway (set enabled: true, environment 'live' for live payments 'test' for testing)
- and you PayU Merchant Key and Salt which is available in your PayU Dashboard.
- save the file and get back to the Panel_Server directory
```bash
cd ..
cd ..
node server.js
```
- At this point, your server will be running  on the default port mentioned in config or the port you defined (updated in config)
- To access the server type in your machine or VM instance URL/public IP in the browser along with port (example: localhost:3535, 127.0.0.1:3535) and you can use the panel but it will stop if u terminate the server or system restart so we need to add it into the service
- to add your server into the service run the following commands in the Panel_Server directory
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
- go to the Server_Plugin folder, copy the addon and cfg folder
- paste into your CSGO server's CSGO folder now go to cfg/sourcemod/vmpanel.cfg
- open the cfg file add a table name for your server something like sv_servername
- now add an entry named vmpanel in your sourcemod database.cfg and add the database cred for the same database used for panel
```
	"vmpanel"
	{
		"driver"        "mysql"
		"host"          "hostname_here"
		"database"      "database_name_here"
		"user"          "username_name_here"
		"pass"          "password_name_here"
		//"timeout"     "0"
    //"port"        "0" // only change if using custom port
	}
```
- Restart the server, and check if the plugin is working without any errors
- Command for plugin (!vipRefresh, !vipStatus, !addVip)
- After installing the plugin, if you are not getting any error then (plugin will automatically create a table to store players entry and gonna add the server in panel too, you can update the server name and other stuff in panel->settings->manage servers->update server details)

-------------------------------------------------------------

## Updating from v1.9 to 1.10 - Beta
- Stop your panel service while updating
- Add files from the latest source code to your installed directory
- execute the below queries in your database
```mysql
INSERT INTO `tbl_settings` (`id`, `setting_key`, `setting_value`) VALUES (NULL, 'disable_about', '0');
```
- Now restart your server and you are good to go
