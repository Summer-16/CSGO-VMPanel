#pragma semicolon 1
#include <sourcemod>

//Global variables
char gS_VMP_dbconfig[] = "vmpanel";
ConVar gC_VMP_servertable;
Database gH_VMP_dbhandler = null;

//Plugin info
public Plugin myinfo = {
    name = "SM VMPanel ",
    author = "Summer Soldier",
    description = "CSGO Plugin for VMPanel Project",
    version = "1.0",
    url = "https://github.com/Summer-16/CSGO-VMPanel"
};


public void OnPluginStart() {

    //Plugin Cvars
    gC_VMP_servertable = CreateConVar("sm_vmpServerTable", "sv_table", "PLEASE READ !, Enter Name for the table of current server , a table in vmpanel db will be created with this name automatically, make sure to give a unique name(name should not match with any other server connected in vmpanel)");

    //Plugin Commands
    RegConsoleCmd("sm_vmprefresh", handler_RefreshVipAndAdmins);
    RegConsoleCmd("sm_vmpstatus", handler_getUserVIPStatus);

    // Execute the config file, create if not present
    AutoExecConfig(true, "VMPanel");
}


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


public void Nothing_Callback(Database db, DBResultSet result, char[] error, any data) {

    if (result == null)
        LogError("[VMP] Error: %s", error);
}


public Action handler_RefreshVipAndAdmins(int client, int args) {

    PrintToServer("***[VMP] Executing manual refresh triggered by command");

    if (client == 0 || (GetUserFlagBits(client) & ADMFLAG_RESERVATION)) {
        PrintToServer("***[VMP] Requesting user is not an admin can not run command");
        refreshVipAndAdmins();
    } else {
        PrintToChat(client, "You need admin rights to access this command");
    }

}

void refreshVipAndAdmins() {

    char ls_VMP_sqltable[512];
    gC_VMP_servertable.GetString(ls_VMP_sqltable, sizeof(ls_VMP_sqltable));
    char vipListQuery[4096];
    Format(vipListQuery, sizeof(vipListQuery), "SELECT authId, flag, name FROM %s", ls_VMP_sqltable);
    gH_VMP_dbhandler.Query(refreshVipAndAdmins_Callback, vipListQuery, DBPrio_High);
}

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
    WriteFileLine(FileHandle, "//This file is maintained by VMPanel Plugin v1.0, Do not add any entries in this file as they will be overwritten by plugin");

    while (result.FetchRow()) {
        char authId[100];
        char flag[100];
        char name[100];
        result.FetchString(0, authId, sizeof(authId));
        result.FetchString(1, flag, sizeof(flag));
        result.FetchString(2, name, sizeof(name));
        // PrintToServer("***[VMP] %s %s %s ",authId,flag,name);
        WriteFileLine(FileHandle, "%s  %s  %s ", authId, flag, name);
    }

    CloseHandle(FileHandle);

    PrintToServer("***[VMP] All Entries updated in admin file, Reloading Admins in server Now");
    ServerCommand("sm_reloadadmins");

}

public Action handler_getUserVIPStatus(int client, int args) {
    PrintToServer("***[VMP] User requested for VIP status");

    if (!IsFakeClient(client)) {
        if (GetUserFlagBits(client) & ADMFLAG_RESERVATION) {
            char ls_VMP_sqltable[512];
            gC_VMP_servertable.GetString(ls_VMP_sqltable, sizeof(ls_VMP_sqltable));
            char vipStatusQuery[4096];
            char clientSTEAMID[100];

            GetClientAuthString(client, clientSTEAMID, sizeof(clientSTEAMID), true);

            Format(vipStatusQuery, sizeof(vipStatusQuery), "SELECT name, expireStamp FROM %s where authId = '\"%s\"'", ls_VMP_sqltable, clientSTEAMID);
            // PrintToServer("***[VMP] query is here %s : ",vipStatusQuery);

            gH_VMP_dbhandler.Query(getUserVIPStatus_callback, vipStatusQuery, client);
        } else {
            PrintToChat(client, "You are not a VIP, Only VIP can use this command");
        }
    }
}

public void getUserVIPStatus_callback(Database db, DBResultSet result, char[] error, any client) {

    if (result == null) {
        PrintToServer("***[VMP] Query Fail: %s", error);
        LogError("[VMP] Query Fail: %s", error);
        PrintToChat(client, "Your VIP is active but could not find your status in db");
        return;
    }

    while (result.FetchRow()) {
        char name[100];

        result.FetchString(0, name, sizeof(name));
        int expireEpoc = result.FetchInt(1);
        int currentEpoc = GetTime();
        int subDays = ((expireEpoc - currentEpoc) / 86400);

        char menuItem[500];
        Menu menu = new Menu(subStatus_menu_Handler);
        menu.SetTitle("Here is your VIP Subscription details");
        menu.AddItem("", "Subscription Status : Active");
        Format(menuItem, sizeof(menuItem), "Subscriber Name : %s", name);
        menu.AddItem("", menuItem);
        Format(menuItem, sizeof(menuItem), "Subscription Days Left : %d", subDays);
        menu.AddItem("", menuItem);
        menu.ExitButton = true;
        menu.Display(client, 10);
    }

}


public int subStatus_menu_Handler(Menu menu, MenuAction action, int param1, int param2) {
    /* Close the menu in case of any selection */
    if (action == MenuAction_Select) {
        delete menu;
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