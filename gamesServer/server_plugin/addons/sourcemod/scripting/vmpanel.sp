#pragma semicolon 1
#include <sourcemod>
#include <multicolors>

//Global variables
char gS_VMP_dbconfig[] = "vmpanel";
ConVar gC_VMP_servertable;
ConVar gC_VMP_alertenable;
ConVar gC_VMP_alerttimer;
ConVar gC_VMP_alertdays;
ConVar gC_VMP_panelurl;
ConVar gC_VMP_defaultvipflag;
Database gH_VMP_dbhandler = null;

//Plugin info
public Plugin myinfo = {
    name = "SM VMPanel ",
    author = "Summer Soldier",
    description = "CSGO Plugin for VMPanel Project",
    version = "2.0",
    url = "https://github.com/Summer-16/CSGO-VMPanel"
};


public void OnPluginStart() {

    //Plugin Cvars
    gC_VMP_servertable = CreateConVar("sm_vmpServerTable", "sv_table", "PLEASE READ !, Enter Name for the table of current server , a table in vmpanel db will be created with this name automatically, make sure to give a unique name(name should not match with any other server connected in vmpanel)");
    gC_VMP_panelurl = CreateConVar("sm_vmpPanelURL", "vmpanel.example", "Enter the URL of Your panel");
    gC_VMP_defaultvipflag = CreateConVar("sm_vmpDefaultVIPFlag", "0:a", "default vip flag and immunity to be used in add vip command");
    gC_VMP_alertenable = CreateConVar("sm_vmpAlertEnable", "1", "Should plugin display subsciption expiring alert to clients");
    gC_VMP_alerttimer = CreateConVar("sm_vmpAlertTimer", "5.0", "When the Subscribtion Expiring alert should be displayed after the player join in the server (in seconds)");
    gC_VMP_alertdays = CreateConVar("sm_vmpAlertdays", "10", "At how many days left user should be notified");


    //Plugin Commands
    RegConsoleCmd("sm_vipRefresh", handler_RefreshVipAndAdmins);
    RegConsoleCmd("sm_vipStatus", handler_getUserVIPStatus);
    RegAdminCmd("sm_addVip", handler_addVIP, ADMFLAG_ROOT, "Adds a VIP Usage: sm_vmpaddvip \"<SteamID>\" <Duration in days> <Name>");

    // Execute the config file, create if not present
    AutoExecConfig(true, "VMPanel");
}


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
// Functions

// Function called once in all maps after all configs get executed
public void OnConfigsExecuted() {
    //check for db connection
    if (gH_VMP_dbhandler == null) {
        PrintToServer("***[VMP] Database connection is null in , Making a new Connection Now");
        SQL_DBConnect();
    } else {
        PrintToServer("***[VMP] Database Connection is availabe refreshing Admins and VIPs Now");
        refreshVipAndAdmins();
    }

}


// Function called for all clients once after , client enters in server
public OnClientPostAdminCheck(client) {
    if ((GetConVarInt(gC_VMP_alertenable) == 1) && (CheckCommandAccess(client, "", ADMFLAG_RESERVATION)) && !IsFakeClient(client)) {
        CreateTimer(GetConVarFloat(gC_VMP_alerttimer), handler_checkUserSubForAlert, client);
    }
}


// Function to make sql connection
void SQL_DBConnect() {

    PrintToServer("***[VMP] Making a Database Connection");

    if (gH_VMP_dbhandler != null)
        delete gH_VMP_dbhandler;

    if (SQL_CheckConfig(gS_VMP_dbconfig)) {
        Database.Connect(SQLConnect_Callback, gS_VMP_dbconfig);
    } else {
        PrintToServer("***[VMP] Error Whike Making a Database Connection, Plugin config missing from databases.cfg file ");
        LogError("[VMP] Startup failed. Error: %s", "\"vmpanel\" is not a specified entry in databases.cfg.");
    }
}


// function to refresh vip/admins
void refreshVipAndAdmins() {

    char ls_VMP_sqltable[512];
    gC_VMP_servertable.GetString(ls_VMP_sqltable, sizeof(ls_VMP_sqltable));
    char vipListQuery[4096];
    Format(vipListQuery, sizeof(vipListQuery), "SELECT authId, flag, name FROM %s", ls_VMP_sqltable);
    gH_VMP_dbhandler.Query(refreshVipAndAdmins_Callback, vipListQuery, DBPrio_High);
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
// Handlers

// Nothing callback for sql queries which do not return any results
public void Nothing_Callback(Database db, DBResultSet result, char[] error, any data) {

    if (result == null)
        LogError("[VMP] Error: %s", error);
}


// Nothing callback for sql queries which do not return any results
public void Nothing_Callback_addVip(Database db, DBResultSet result, char[] error, any client) {

    if (result == null) {
        LogError("[VMP] Error: %s", error);
        CPrintToChat(client, "{red}[VMP] {green}Operation Failed , Error: %s", error);
    } else {
        CPrintToChat(client, "{red}[VMP] {green}VIP Successfully added , Refreshing Cahche in Admin File and In Server");
        refreshVipAndAdmins();

        char clientName[50], ls_VMP_addAuditQuery[4096];
        GetClientName(client, clientName, sizeof(clientName));
        Format(ls_VMP_addAuditQuery, sizeof(ls_VMP_addAuditQuery), "INSERT INTO tbl_audit_logs (activity, additional_info, created_by, created_at) values ('New VIP added', 'Added Through Plugin', '%s', NOW());", clientName);

        gH_VMP_dbhandler.Query(Nothing_Callback, ls_VMP_addAuditQuery, DBPrio_High);

    }

}


// handler to be called when vip/admin refresh command is called
public Action handler_RefreshVipAndAdmins(int client, int args) {

    PrintToServer("***[VMP] Executing manual refresh triggered by command");
    // PrintToServer("***[VMP] here is client for checking====> %d", client);

    if ((client == 0) || (CheckCommandAccess(client, "", ADMFLAG_GENERIC))) {
        if(client > 0){
            CPrintToChat(client, "{red}[VMP] {green}Updating the VIP/Admin in Server");
        }
        PrintToServer("***[VMP] Requesting user is an Admin/Console, Executing the command");
        refreshVipAndAdmins();
    } else {
        CPrintToChat(client, "{red}[VMP] {green}You need admin rights to access this command");
    }

}


// handler for vmpstatus command 
public Action handler_getUserVIPStatus(int client, int type) {

    PrintToServer("***[VMP] User requested for VIP status");

    if (!IsFakeClient(client)) {
        if (CheckCommandAccess(client, "", ADMFLAG_RESERVATION)) {

            if (type != 2) {
                CPrintToChat(client, "{red}[VMP] {green}Hold On Getting your Data now.");
            }

            char ls_VMP_sqltable[512];
            gC_VMP_servertable.GetString(ls_VMP_sqltable, sizeof(ls_VMP_sqltable));
            char vipStatusQuery[4096];
            char clientSTEAMID[100];

            GetClientAuthString(client, clientSTEAMID, sizeof(clientSTEAMID), true);

            Format(vipStatusQuery, sizeof(vipStatusQuery), "SELECT name, expireStamp FROM %s where authId = '\"%s\"'", ls_VMP_sqltable, clientSTEAMID);
            // PrintToServer("***[VMP] query is here %s : ",vipStatusQuery);

            if (type == 2) {
                gH_VMP_dbhandler.Query(getUserVIPStatusAlert_callback, vipStatusQuery, client);
            } else {
                gH_VMP_dbhandler.Query(getUserVIPStatus_callback, vipStatusQuery, client);
            }
        } else {
            CPrintToChat(client, "{red}[VMP] {green}You are not a VIP, Only VIP can use this command");
        }
    }
}


// handler for add vip command
public Action handler_addVIP(int client, int args) {

    if (args < 3) {
        if (client != 0)
            CPrintToChat(client, "{red}[VMP] {green}Invalid Params Usage: sm_vmpaddvip \"<SteamID>\" <Duration in days> <Name>");
        else
            PrintToServer("***[VMP] Invalid Params Usage:  sm_vmpaddvip \"<SteamID>\" <Duration in days> <Name>");
        return Plugin_Handled;
    }

    char tempArgument[50], steamId[50], userName[50];
    int subDays = 0;

    GetCmdArg(1, tempArgument, sizeof(tempArgument));
    if (StrContains(tempArgument, "STEAM_1:1:", true) == -1) {
        if (client != 0)
            CPrintToChat(client, "{red}[VMP] {green}Invalid Steam Id format use STEAM_1:1:xxxxxx");
        else
            PrintToServer("***[VMP] Invalid Steam Id format use STEAM_1:1:xxxxxx");
        return Plugin_Handled;
    } else {
        strcopy(steamId, sizeof(steamId), tempArgument);
    }

    GetCmdArg(2, tempArgument, sizeof(tempArgument));
    subDays = StringToInt(tempArgument);
    subDays = ((subDays * 86400) + GetTime());

    GetCmdArg(3, userName, sizeof(userName));

    // CPrintToChat(client, "{red}[VMP] {green}Here are the final args Steam: %s, Epoc: %d, Name: %s",steamId,subDays,userName);

    char ls_VMP_sqltable[512];
    gC_VMP_servertable.GetString(ls_VMP_sqltable, sizeof(ls_VMP_sqltable));
    char ls_VMP_vipFlag[50];
    gC_VMP_defaultvipflag.GetString(ls_VMP_vipFlag, sizeof(ls_VMP_vipFlag));

    char ls_VMP_addVipQuery[4096];
    Format(ls_VMP_addVipQuery, sizeof(ls_VMP_addVipQuery), "INSERT INTO %s (authid, flag, name, expireStamp, created_at ,type) values ('\"%s\"', '\"%s\"', '//%s', %d, NOW(), 0);", ls_VMP_sqltable, steamId, ls_VMP_vipFlag, userName, subDays);

    gH_VMP_dbhandler.Query(Nothing_Callback_addVip, ls_VMP_addVipQuery, client);

    return Plugin_Handled;
}


// timer handler for timer executed in OnClientPostAdminCheck 
public Action: handler_checkUserSubForAlert(Handle: timer, any: client) {
    handler_getUserVIPStatus(client, 2);
}


// handler for menu
public int subStatus_menu_Handler(Menu menu, MenuAction action, int param1, int param2) {
    /* Close the menu in case of any selection */
    if (action == MenuAction_Select) {
        // delete menu;
        // Do nothing
    }
    /* Close the menu in case of any selection */
    else if (action == MenuAction_Cancel) {
        PrintToServer("Client %d's menu was cancelled.  Reason: %d", param1, param2);
    }
    /* If the menu has ended, destroy it */
    else if (action == MenuAction_End) {
        delete menu;
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
// Callbacks

// Callback to execute on successfull sql connection
public void SQLConnect_Callback(Database db, char[] error, any data) {

    PrintToServer("***[VMP] SQL Connection created succesfully");

    if (db == null) {
        PrintToServer("***[VMP] Can't connect to SQL server. Error: %s", error);
        LogError("[VMP] Can't connect to SQL server. Error: %s", error);
        return;
    }

    gH_VMP_dbhandler = db;
    char ls_VMP_sqltable[512];
    gC_VMP_servertable.GetString(ls_VMP_sqltable, sizeof(ls_VMP_sqltable));

    char ls_VMP_tablecreatequery[4096];
    Format(ls_VMP_tablecreatequery, sizeof(ls_VMP_tablecreatequery),
        "CREATE TABLE IF NOT EXISTS `%s` ( \
                    `authId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL, \
                    `flag` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT '\"0:a\"', \
                    `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL, \
                    `expireStamp` int(20) unsigned NOT NULL, \
                    `created_at` datetime NOT NULL, \
                    `type` int(20) NOT NULL, \
                    PRIMARY KEY (`authId`) \
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", ls_VMP_sqltable);

    gH_VMP_dbhandler.Query(Nothing_Callback, ls_VMP_tablecreatequery, DBPrio_High);
}


// callback to execute when vip/admin data fetch query is ececuted
public void refreshVipAndAdmins_Callback(Database db, DBResultSet result, char[] error, any data) {

    if (result == null) {
        PrintToServer("***[VMP] Query Fail: %s", error);
        LogError("[VMP] Query Fail: %s", error);
        return;
    }

    PrintToServer("***[VMP] Result fetch done , opening admin file for writing***");

    new String: g_sFilePath[PLATFORM_MAX_PATH];
    BuildPath(Path_SM, g_sFilePath, sizeof(g_sFilePath), "/configs/admins_simple.ini");
    new Handle: FileHandle = OpenFile(g_sFilePath, "w");
    WriteFileLine(FileHandle, "//This file is maintained by VMPanel Plugin v2.0, Do not add any entries in this file as they will be overwritten by plugin");

    while (result.FetchRow()) {
        char authId[100];
        char flag[100];
        char name[100];
        result.FetchString(0, authId, sizeof(authId));
        result.FetchString(1, flag, sizeof(flag));
        result.FetchString(2, name, sizeof(name));
        PrintToServer("***[VMP] fetched entries || ===> %s %s %s ",authId,flag,name);
        WriteFileLine(FileHandle, "%s  %s  %s ", authId, flag, name);
    }

    CloseHandle(FileHandle);

    PrintToServer("***[VMP] All Entries updated in admin file, Reloading Admins in server Now");
    ServerCommand("sm_reloadadmins");

}


// callback to execute when user data fetch query is ececuted for sub status
public void getUserVIPStatus_callback(Database db, DBResultSet result, char[] error, any client) {

    if (result == null) {
        PrintToServer("***[VMP] Query Fail: %s", error);
        LogError("[VMP] Query Fail: %s", error);
        CPrintToChat(client, "{red}[VMP] {green}Your VIP is active but could not find your status in Database");
        return;
    }

    while (result.FetchRow()) {
        char name[100];

        result.FetchString(0, name, sizeof(name));
        int expireEpoc = result.FetchInt(1);
        int currentEpoc = GetTime();
        int subDays = ((expireEpoc - currentEpoc) / 86400);
        // CPrintToChat(client, "subDays==>",subDays);

        char menuItem[500];
        Menu menu = new Menu(subStatus_menu_Handler);
        menu.SetTitle("Here is your VIP Subscription details, For this Server");
        menu.AddItem("", "Subscription Status : Active");
        Format(menuItem, sizeof(menuItem), "Subscriber Name : %s", name);
        menu.AddItem("", menuItem);
        Format(menuItem, sizeof(menuItem), "Subscription Days Left : %d", subDays);
        menu.AddItem("", menuItem);
        menu.ExitButton = true;
        menu.Display(client, 10);
    }
}

// callback to execute when user data fetch query is ececuted for sub alert
public void getUserVIPStatusAlert_callback(Database db, DBResultSet result, char[] error, any client) {

    if (result == null) {
        PrintToServer("***[VMP] Query Fail: %s", error);
        LogError("[VMP] Query Fail: %s", error);
        CPrintToChat(client, "{red}[VMP] {green}Your VIP is active but could not find your status in Database");
        return;
    }

    while (result.FetchRow()) {
        char name[100];

        result.FetchString(0, name, sizeof(name));
        int expireEpoc = result.FetchInt(1);
        int currentEpoc = GetTime();
        int subDays = ((expireEpoc - currentEpoc) / 86400);

        if (subDays <= GetConVarInt(gC_VMP_alertdays)) {
            char menuItem[500];
            char ls_VMP_panelurl[512];
            gC_VMP_panelurl.GetString(ls_VMP_panelurl, sizeof(ls_VMP_panelurl));
            Menu menu = new Menu(subStatus_menu_Handler);
            menu.SetTitle("Your VIP Subscription is about to expire, \nPlease renew to continue using VIP benefits");
            menu.AddItem("", "Subscription Status : About to Expire");
            Format(menuItem, sizeof(menuItem), "Subscriber Name : %s", name);
            menu.AddItem("", menuItem);
            Format(menuItem, sizeof(menuItem), "Subscription Days Left : %d", subDays);
            menu.AddItem("", menuItem);
            Format(menuItem, sizeof(menuItem), "Visit %s to Renew now", ls_VMP_panelurl);
            menu.AddItem("", menuItem);

            menu.ExitButton = true;
            menu.Display(client, 10);
        }
    }
}