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
- Coming in few days 

## Future features 
- Login for admin (instead of secure key)
- Delete option from panel
