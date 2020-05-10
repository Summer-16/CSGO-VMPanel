#pragma semicolon 1
#include <sourcemod>

//Database g_Database = null; 
char dbconfig[] = "vmpanel";

ConVar g_cServertable;

public Plugin myinfo = {
  name = "SM VMPanel ",
  author = "Summer Soldier",
  description = "CSGO Plugin for VMPanel Project",
  version = "0.1",
  url = "https://github.com/Summer-16/CSGO-VMPanel"
};

public void OnPluginStart() {

  g_cServertable = CreateConVar("sm_vmpServerTable", "sv_table", "PLEASE READ !, Enter Name for the table of current server , a table in vmpanel db will be created with this name automatically, make sure to give a unique name(name should not match with any other server connected in vmpanel)");

  // Execute the config file, create if not present
  AutoExecConfig(true, "VMPanel");
  RegServerCmd("sm_vmprefresh", commandRefreshVipAndAdmins);
  createTableAndFillentries();
  PrintToServer("***[VMP] Reloading Admins in server Now***");
  ServerCommand("sm_reloadadmins");
}

public Action commandRefreshVipAndAdmins(int args) {
  refreshVipAndAdmins();
  PrintToServer("***[VMP] Reloading Admins in server Now***");
  ServerCommand("sm_reloadadmins");
}

public void OnMapStart() {
  refreshVipAndAdmins();
  PrintToServer("***[VMP] Reloading Admins in server Now***");
  ServerCommand("sm_reloadadmins");
}

public void createTableAndFillentries() {
  PrintToServer("***[VMP] Running on plugin start func***");

  Database g_Database = null;
  char error[512];
  g_Database = SQL_Connect(dbconfig, true, error, sizeof(error));

  if (g_Database == null) {
    PrintToServer("***[VMP] Error connecting to database==> %s", error);
    LogError("***[VMP] Error connecting to database==> %s", error);
  } else {
    SQL_SetCharset(g_Database, "utf8mb4");

    char g_sSQLTable[512];
    g_cServertable.GetString(g_sSQLTable, sizeof(g_sSQLTable));

    char createTableQuery[4096];
    Format(createTableQuery, sizeof(createTableQuery),
      "CREATE TABLE IF NOT EXISTS `%s` ( \
                    `authId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL, \
                    `flag` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT '\"0:a\"', \
                    `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL, \
                    `expireStamp` int(20) unsigned NOT NULL, \
                    `created_at` datetime NOT NULL, \
                    `type` int(20) NOT NULL, \
                    PRIMARY KEY (`authId`) \
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", g_sSQLTable);

    PrintToServer("***[VMP] Running qury to create table if not exists***");

    if (!SQL_FastQuery(g_Database, createTableQuery)) {
      SQL_GetError(g_Database, error, sizeof(error));
      PrintToServer("***[VMP] Failed to execute create table query (error: %s)", error);
      LogError("***[VMP] Failed to execute create table query (error: %s)", error);
    }

    char vipListQuery[4096];
    Format(vipListQuery, sizeof(vipListQuery), "SELECT authId,flag,name FROM %s WHERE expireStamp > %d;", g_sSQLTable, GetTime());

    PrintToServer("***[VMP] Running qury to fetch vip and admins***");

    DBResultSet query = SQL_Query(g_Database, vipListQuery);
    if (query == null) {
      SQL_GetError(g_Database, error, sizeof(error));
      PrintToServer("***[VMP] Error in fetching vip and admin list (error: %s)", error);
      LogError("***[VMP] Error in fetching vip and admin list (error: %s)", error);
    } else {
      PrintToServer("***[VMP] Result fetch done , opening admin file for writing***");

      new String: g_sFilePath[PLATFORM_MAX_PATH];
      BuildPath(Path_SM, g_sFilePath, sizeof(g_sFilePath), "/configs/admins_simple.ini");
      new Handle: FileHandle = OpenFile(g_sFilePath, "w");
      WriteFileLine(FileHandle, "//This file is maintained by VMPanel Plugin, Do not add any entries in this file as they will be overwritten by plugin");

      /* Process results here! */
      while (SQL_HasResultSet(query) && SQL_FetchRow(query)) {
        char authId[100];
        char flag[100];
        char name[100];
        SQL_FetchString(query, 0, authId, sizeof(authId));
        SQL_FetchString(query, 1, flag, sizeof(flag));
        SQL_FetchString(query, 2, name, sizeof(name));
        WriteFileLine(FileHandle, "%s  %s  %s ", authId, flag, name);
      }
      /* Free the Handle */
      PrintToServer("***[VMP] All operations done closing all db and file handles***");
      LogMessage("***[VMP] All VIP and Admin entries refreshed in admins_simple.ini");
      CloseHandle(FileHandle);
      delete query;
    }
    delete g_Database;
  }
}

public void refreshVipAndAdmins() {
  PrintToServer("***[VMP] Running manual vip and refresh func***");

  Database g_Database = null;
  char error[512];
  g_Database = SQL_Connect(dbconfig, true, error, sizeof(error));

  if (g_Database == null) {
    PrintToServer("***[VMP] Error connecting to database==> %s", error);
    LogError("***[VMP] Error connecting to database==> %s", error);
  } else {

    char g_sSQLTable[512];
    g_cServertable.GetString(g_sSQLTable, sizeof(g_sSQLTable));

    char vipListQuery[4096];
    Format(vipListQuery, sizeof(vipListQuery), "SELECT authId,flag,name FROM %s WHERE expireStamp > %d;", g_sSQLTable, GetTime());

    PrintToServer("***[VMP] Running qury to fetch vip and admins***");

    DBResultSet query = SQL_Query(g_Database, vipListQuery);
    if (query == null) {
      SQL_GetError(g_Database, error, sizeof(error));
      PrintToServer("***[VMP] Error in fetching vip and admin list (error: %s)", error);
      LogError("***[VMP] Error in fetching vip and admin list (error: %s)", error);
    } else {
      PrintToServer("***[VMP] Result fetch done , opening admin file for writing***");

      new String: g_sFilePath[PLATFORM_MAX_PATH];
      BuildPath(Path_SM, g_sFilePath, sizeof(g_sFilePath), "/configs/admins_simple.ini");
      new Handle: FileHandle = OpenFile(g_sFilePath, "w");
      WriteFileLine(FileHandle, "//This file is maintained by VMPanel Plugin, Do not add any entries in this file as they will be overwritten by plugin");

      /* Process results here! */
      while (SQL_HasResultSet(query) && SQL_FetchRow(query)) {
        char authId[100];
        char flag[100];
        char name[100];
        SQL_FetchString(query, 0, authId, sizeof(authId));
        SQL_FetchString(query, 1, flag, sizeof(flag));
        SQL_FetchString(query, 2, name, sizeof(name));
        WriteFileLine(FileHandle, "%s  %s  %s ", authId, flag, name);
      }
      /* Free the Handle */
      PrintToServer("***[VMP] All operations done closing all db and file handles***");
      LogMessage("***[VMP] All VIP and Admin entries refreshed in admins_simple.ini");
      CloseHandle(FileHandle);
      delete query;
    }
    delete g_Database;
  }
}