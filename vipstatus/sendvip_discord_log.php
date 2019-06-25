<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include('config.php');
$url = "Your_discord_server_webhook_here";
$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if (!$conn) {
die ('Failed to connect to MySQL: ' . mysqli_connect_error());	
}
//here retakevip is a table in which vip's of retake server are stored, modify below queries according to your no of servers
$sql = 'SELECT * FROM retakevip'; 
$sql2 = 'SELECT * FROM awpvip';
$sql3 = 'SELECT * FROM arenavip';
$sql4 = 'SELECT * FROM executevip';
$query = mysqli_query($conn, $sql);
$query2 = mysqli_query($conn, $sql2);
$query3 = mysqli_query($conn, $sql3);
$query4 = mysqli_query($conn, $sql4);
if (!$query) {
die ('SQL Error: ' . mysqli_error($conn));
}

$s = "**Retake Server VIPs**\r\n";
while ($row = mysqli_fetch_array($query))
{
$s = "".$s. "\r\n -> "  .str_replace(array('"','"'), '',$row['authId']). "  :-  " .str_replace(array('/'), '',$row['name']). "  :-  ***(" .date('d-m-Y', $row['expireStamp']).")*** ";
}

#post message on Discord
// Replace the URL with your own webhook url

$hookObject = json_encode([

    "content" => "Hey VIP's , Following is the list of Current VIP Users with [User Steam ID - User Name - SUB last Date]",

    "username" => "GVIP",

    "tts" => false,

    "embeds" => [

        [
            // Set the title for your embed

            // The type of your embed, will ALWAYS be "rich"
            "type" => "rich",

            // A description for your embed
            "description" => $s,

            // The integer color to be used on the left side of the embed
            "color" => hexdec( "#cb4335" )

        ]
    ]

], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );

$ch = curl_init();

curl_setopt_array( $ch, [
    CURLOPT_URL => $url,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $hookObject,
    CURLOPT_HTTPHEADER => [
        "Length" => strlen( $hookObject ),
        "Content-Type" => "application/json"
    ]
]);

$response = curl_exec( $ch );
curl_close( $ch );
echo $response;

/////////////////////////////////////////////////////////////////////////
$s = "**AWP Server VIPs**\r\n";
while ($row = mysqli_fetch_array($query2))
{
$s = "".$s. "\r\n -> "  .str_replace(array('"','"'), '',$row['authId']). "  :-  " .str_replace(array('/'), '',$row['name']). "  :-  ***(" .date('d-m-Y', $row['expireStamp']).")*** ";
}

#post message on Discord
// Replace the URL with your own webhook url

$hookObject = json_encode([

"username" => "GVIP",

    "tts" => false,

    "embeds" => [

        [
            // The type of your embed, will ALWAYS be "rich"
            "type" => "rich",

            // A description for your embed
            "description" => $s,

            // The integer color to be used on the left side of the embed
            "color" => hexdec( "#884ea0" )

        ]
    ]

], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );

$ch = curl_init();

curl_setopt_array( $ch, [
    CURLOPT_URL => $url,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $hookObject,
    CURLOPT_HTTPHEADER => [
        "Length" => strlen( $hookObject ),
        "Content-Type" => "application/json"
    ]
]);

$response = curl_exec( $ch );
curl_close( $ch );
echo $response;

/////////////////////////////////////////////////////////////////////////
$s = "**1v1 Arena Server VIPs**\r\n";
while ($row = mysqli_fetch_array($query3))
{
$s = "".$s. "\r\n -> "  .str_replace(array('"','"'), '',$row['authId']). "  :-  " .str_replace(array('/'), '',$row['name']). "  :-  ***(" .date('d-m-Y', $row['expireStamp']).")*** ";
}

#post message on Discord
// Replace the URL with your own webhook url

$hookObject = json_encode([

"username" => "GVIP",

    "tts" => false,

    "embeds" => [

        [
            // The type of your embed, will ALWAYS be "rich"
            "type" => "rich",

            // A description for your embed
            "description" => $s,

            // The integer color to be used on the left side of the embed
            "color" => hexdec( "#2874a6" )

        ]
    ]

], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );

$ch = curl_init();

curl_setopt_array( $ch, [
    CURLOPT_URL => $url,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $hookObject,
    CURLOPT_HTTPHEADER => [
        "Length" => strlen( $hookObject ),
        "Content-Type" => "application/json"
    ]
]);

$response = curl_exec( $ch );
curl_close( $ch );
echo $response;


/////////////////////////////////////////////////////////////////////////
$s = "**Execute Server VIPs**\r\n";
while ($row = mysqli_fetch_array($query4))
{
$s = "".$s. "\r\n -> "  .str_replace(array('"','"'), '',$row['authId']). "  :-  " .str_replace(array('/'), '',$row['name']). "  :-  ***(" .date('d-m-Y', $row['expireStamp']).")*** ";
}

#post message on Discord
// Replace the URL with your own webhook url

$hookObject = json_encode([

"username" => "GVIP",

    "tts" => false,

    "embeds" => [

        [
            // The type of your embed, will ALWAYS be "rich"
            "type" => "rich",

            // A description for your embed
            "description" => $s,

            // The integer color to be used on the left side of the embed
            "color" => hexdec( "#28b463" )

        ]
    ]

], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );

$ch = curl_init();

curl_setopt_array( $ch, [
    CURLOPT_URL => $url,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $hookObject,
    CURLOPT_HTTPHEADER => [
        "Length" => strlen( $hookObject ),
        "Content-Type" => "application/json"
    ]
]);

$response = curl_exec( $ch );
curl_close( $ch );
echo $response;




?>


