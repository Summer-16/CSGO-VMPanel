# CSGO Vip Management Panel
[![Donate](https://cdn2.iconfinder.com/data/icons/social-icons-circular-color/512/paypal-64.png)](https://www.paypal.me/Shivam169)  [![Donate](https://cdn2.iconfinder.com/data/icons/social-icons-circular-color/512/paytm-64.png)](https://drive.google.com/file/d/1ks_B3s9dNk_RPkDVf1DL1ITKe0mnrTRk/view)  [![Donate](https://cdn.iconscout.com/icon/free/png-64/upi-bhim-transfer-1795405-1522773.png)](https://drive.google.com/open?id=1VYYThJS78Pp6yyIU0lCIC4j7ef5a4G0l)  [![Discord](https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/91_Discord-64.png)](https://discord.gg/HcCFa8q)  
### Single solution to mange VIPs and Admins in your CSGO servers.

## Panel Features v1.7 (Changelogs)
- Now admin can define no of subscription days for every server
- Admin can create server bundle where they can create a bundle by adding multiple servers with custom subscription days and price to create custom offers

## Panel Features v1.6 (Changelogs) (will be released tonight)
- PayU Money payment gateway added (PayU Payment gateway is for Indian Users only as it does transactions in rupee)
- Some bugs fixed for the login screen
- Panel logs added
- Pagination added for large data
- Server data load and autofill added for server update form

## Panel Features v1.5
- Add VIP or Admin to servers.
- While adding VIP subscription days are entered and once subscription days finished panel will automatically delete that VIP and remove it from the CSGO server too.
- You can also manually delete the VIP and Admins from the panel.
- A user data fetch tool to make it easy to add VIP and Admins just enter the user steam profile URL and panel will fetch all the info for you (no more using steam id finders)
- Automatic deletion of VIPs whose subscription days are ended.
- Daily notification on your discord server with the latest Listing for all servers.
- A handy dashboard to see all at a glance
- You can create, delete sub-users, and super users in panel handy in case you want multiple admins for panel multiple admins.
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

## Only enable both payment gateways if you are doing transactions in INR, if you are doing transactions is USD do not enable PayU

## Web panel Screenshots
![ScreenShot](https://github.com/Summer-16/CSGO-VMP/blob/master/screenshots/VMP_SS.jpg)
[View All ScreenShots](https://github.com/Summer-16/CSGO-VMPanel/tree/master/screenshots)

## Step-by-Step install Instructions for New Installation 
#### (these instructions apply to current dev code if you are installing v1.7 then follow the instructions given in its zip)
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
- Like same you can enable PayU payment gateway (set enaled:true, environment 'live' for live payments 'test' for testing)
- and you PayU Merchant Key and Salt which is available in your PayU Dashboard.
- save the file and get back to panelServer directory
```bash
cd ..
cd ..
node server.js
```
- At this point, your server will be running  on default port mentioned in config or the port you defined (updated in config)
- To access the server type in your machine or VM instance URL/public IP in the browser along with port (example: localhost:3534, 127.0.0.1:3535) and you can use the panel but it will stop if u terminate the server or system restart so we need to add it into the service
- to add your server into the service run the following commands in panelServer directory
```bash
npm install pm2 -g
pm2 start server.js
```
- At this point, your server is running as a service by pm2 but we still need to save pm2 config so now do
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
- At this point, you are good to go and install the plugin in all your servers.
- After installing the plugin in the server go to panel settings and add your server in the panel.
- Please note it is important that you must add the plugin in the server first and make sure you restart the server after adding the plugin, then check if plugin working without any error and then add the server in the panel.
- If you want to remove port the use the following apache2 config, After adding the apache config you will need to update your vmpanel config.json make the apache proxy variable true, and add new hostname defined in the virtual host in the hostname.
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
- Restart the server, and check if plugin is working without an errors
- now add an entry named vmpanel in your database.cfg and add the database cred for the same database used for panel
- Command for plugin "sm_vmprefresh"

### Adding bash file in servers (old method) (not needed if you using the plugin)
- Copy the script from serverScript folder add into your CSGO server 
- Update your DB cred and admins_simple.ini path in the script and add the script into cron

## Updating from v1.6 to v1.7
- Stop your panel service while updating
- Add files from latest commit to yours installed directory
- Go to panelServer folder , open your Linux terminal and run npm i
- Go to your config and update the new  details from example config
- execute the below query in your database
```mysql
ALTER TABLE `tbl_servers` 
ADD COLUMN `vip_days` INT(11) NULL DEFAULT 30 AFTER `vip_currency`;
```
- Now restart your server and you are good to go
