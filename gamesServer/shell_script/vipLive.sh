#!/bin/sh

# Locations of Simpleadminfile
# Example for Pterodactyl server manager
FILE="/srv/daemon-data/ba4462c0-76a8-42c8-a034-d47b7ac72ead/csgo/addons/sourcemod/configs/admins_simple.ini"
# Example for LInuxGSM Server manager
FILE1="/home/ss/csgo_Servers/Execute_server/csgoserver/serverfiles/csgo/addons/sourcemod/configs/admins_simple.in"
# File variable will hold the path of your admins_simple.ini file in which admins and vips get stored

#connect with db, read data and store it in myvar (replace user with your sql user, host_ip with your sql server ip, user_password with your sql user password table_name_here_server1 with the name of table you used to store name, flag and steam id)
myvar=$(mysql testdb -u 'user' -h 'host_ip' -p'user_password' -se "SELECT authId,flag,name FROM table_name_here_server1 ")
echo "$myvar"

myvar2=$(mysql testdb -u 'user' -h 'host_ip' -p'user_password' -se "SELECT authId,flag,name FROM table_name_here_server2 ")
echo "$myvar2"

#fill in admins_simple.ini of first server
/bin/cat <<EOM >$FILE
$myvar
EOM

#fillin admins_simple.ini of second server
/bin/cat <<EOM >$FILE1
$myvar2
EOM

# add more File, myvar, and file writing code for multiple servers keep in mind to use distict names for all servers

#Notify user on discord that all vips are refreshed
echo "Sending vip update notif"
curl -X POST \
  Your_discord_server_webhook_here \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: a47466ea-0446-44bf-ae2c-aed37a9421a1' \
  -H 'cache-control: no-cache' \
  -d '{
"username": "botname",
"avatar_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGwlp38Uh7kH-ySdc-miJh5DwvEi_AmTOCHKmjFKx2ZhdacrBDYA",
  "content": "hello there!",
  "embeds": [{
    "title": "VIP entries refreshed!",
    "description": "Main Server machine\n"
  }]
}'
