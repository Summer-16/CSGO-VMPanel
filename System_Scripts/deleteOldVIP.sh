#!/bin/sh
#Script to delete old vips , add this in cron to run daily

# Get current unix time and delete old VIPS
current_time=$(date -d "${orig}" +"%s")
echo "$current_time"

echo "Deleting old VIPS"
mysql testdb -u root -p'your_sql_password' -Bse "DELETE FROM retakevip where expireStamp < '$current_time'"
echo "Retake old VIPS deleted"
mysql testdb -u root -p'your_sql_password' -Bse "DELETE FROM awpvip where expireStamp < '$current_time'"
echo "AWP old VIPS deleted"
mysql testdb -u root -p'your_sql_password' -Bse "DELETE FROM arenavip where expireStamp < '$current_time'"
echo "Arena old VIPS deleted"
mysql testdb -u root -p'your_sql_password' -Bse "DELETE FROM executevip where expireStamp < '$current_time'"
echo "Execute old VIPS deleted"
mysql testdb -u root -p'your_sql_password' -Bse "DELETE FROM aimvip where expireStamp < '$current_time'"
echo "AIM old VIPS deleted"
