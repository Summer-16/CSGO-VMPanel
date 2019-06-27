<?php
session_start();
include('../config/config.php');
$message = "";
if (count($_POST) > 0) {
    $con = mysqli_connect($db_host, $db_user, $db_pass, $db_name) or die('Unable To connect');
    $result = mysqli_query($con, "SELECT * FROM login_user WHERE name='" . $_POST["name"] . "' and password = '" . $_POST["password"] . "'");
    $row  = mysqli_fetch_array($result);
    if (is_array($row)) {
        $_SESSION["id"] = $row[id];
        $_SESSION["name"] = $row[name];
    } else {
        $message = "Invalid Username or Password!";
    }
}
if (isset($_SESSION["id"])) {
    header("Location:../index.php");
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="../css/login.css">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VIP CP</title>
</head>

<body>
    <div class="subheader"><b>Admin Login</b></div>
    <div class="formlayout">
        <form name="frmUser" method="post" action="" align="center">
            <div class="message"><?php if ($message != "") {
                                        echo $message;
                                    } ?></div>
            <label for="name">Username</label><br>
            <input type="text" name="name" placeholder="email"><br>
            <label for="password">Password</label><br>
            <input type="password" name="password" placeholder="password">
            <br>
            <input type="submit" name="submit" value="Submit">
            <input type="reset">
        </form>
    </div>
</body>

</html>