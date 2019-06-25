# Vip Management System
This is small automation Script for the CSGO Server managers.
Things which this Script can do for you are:
 - Add Vips into server's admins_simple.ini directly from SQL DB
 - Delete Old Vips automatically once their 30 days are done based on timestamp, if current users timestamp is older then       current time that means it's vip is expired.
 - Send Update Message on your discord server.
 - Send all VIP List from all servers to your discord server.

# TO Do!
 - Optimize the Script a bit with sql variables
  - Add a Webpanel for VIP adding. 
    (I already have a webpanel working for this but its not coded for public use most things are hardcoded , so i need to remake it for general use. If anyone wants to make and contribute the panel then you are welcome plz contact me)
  - Combine everything into a node app (Need some time for this as panel will be a dependency)

### Setup Instructions
 - Some basic knowlege of linux and Scripting is required.
 - Just edit all the details in vipLive.sh (paths to your simpleadmin.ini, mysql info and discord wenhook. Please look into comments and properly add paths)
 - add your sql details in vipstatus/config.php also
 - In the end add the Script inti cron to run hourly or whatever time you prefer, you can also customize the discord script time according to you as per your liking. 
 - [Table example and eample of entries in table for script to work properly](https://github.com/Summer-16/CSGO-VIP-management-system/blob/master/Table_example.png) 

