# Setup Instructions
- add a name for the server table inside plugin cfg located in cfg folder (make it unique as plugin will add a table with same name in db, consider naming it once carefull as changing it will result server using a new table with the new name mentioned in cfg )
- Add the addon and cfg folder into your csgo folder
- Add an entry in your database.cfg named "vmpanel" and add the database cred of vmpanel
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
