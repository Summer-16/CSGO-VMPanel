<?php
session_start();
?>
<?php
if ($_SESSION["name"]) {
  ?>
  <?php
  error_reporting(E_ALL);
  ini_set('display_errors', 1);
  include('../config/config.php');
  $connection = mysqli_connect($db_host, $db_user, $db_pass, $db_name); // Establishing Connection with Server
  // Check connection
  if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
  if (isset($_POST['submit'])) { // Fetching variables of the form which travels in URL
    $authId = $_POST['Id'];
    $day = $_POST['day'];
    $server = $_POST['server'];

    if ($authId != '' || $day != '') {
      //Insert Query of SQL
      //$query = mysqli_query($connection,"insert into vipUser(authId, expireStamp) values ('$authId', '$expireStamp')");
      if ($server == 'retake') {    // <<-- Change table and server name here
        $result = mysqli_query($connection, "SELECT expireStamp FROM retakevip where authId = '$authId'");
        $row = mysqli_fetch_row($result);
        $current_sub = $row[0];
        $expireStamp = $current_sub + ($day * 86400);
        mysqli_query($connection, "UPDATE retakevip SET expireStamp='$expireStamp' WHERE authId = '$authId'");
        echo "<h1>RETAKE VIP updated successfully...!!</h1>";
      }
      if ($server == 'awp') {    // <<-- Change table and server name here
        $result = mysqli_query($connection, "SELECT expireStamp FROM awpvip where authId = '$authId'");
        $row = mysqli_fetch_row($result);
        $current_sub = $row[0];
        $expireStamp = $current_sub + ($day * 86400);
        mysqli_query($connection, "UPDATE awpvip SET expireStamp='$expireStamp' WHERE authId = '$authId'");
        echo "<h1>AWP VIP updated successfully...!!</h1>";
      }
      if ($server == 'arena') {    // <<-- Change table and server name here
        $result = mysqli_query($connection, "SELECT expireStamp FROM arenavip where authId = '$authId'");
        $row = mysqli_fetch_row($result);
        $current_sub = $row[0];
        $expireStamp = $current_sub + ($day * 86400);
        mysqli_query($connection, "UPDATE arenavip SET expireStamp='$expireStamp' WHERE authId = '$authId'");
        echo "<h1>1v1 VIP updated successfully...!!</h1>";
      }
      if ($server == 'execute') {    // <<-- Change table and server name here
        $result = mysqli_query($connection, "SELECT expireStamp FROM executevip where authId = '$authId'");
        $row = mysqli_fetch_row($result);
        $current_sub = $row[0];
        $expireStamp = $current_sub + ($day * 86400);
        mysqli_query($connection, "UPDATE executevip SET expireStamp='$expireStamp' WHERE authId = '$authId'");
        echo "<h1>Execute VIP updated successfully...!!</h1>";
      }
      if ($server == 'awp2') {    // <<-- Change table and server name here
        $result = mysqli_query($connection, "SELECT expireStamp FROM awp2vip where authId = '$authId'");
        $row = mysqli_fetch_row($result);
        $current_sub = $row[0];
        $expireStamp = $current_sub + ($day * 86400);
        mysqli_query($connection, "UPDATE awp2vip SET expireStamp='$expireStamp' WHERE authId = '$authId'");
        echo "<h1>AIM VIP updated successfully...!!</h1>";
      }
    } else {
      echo "<h1>Insertion Failed <br/> Some Fields are Blank....!!</h1>";
    }
  }
  mysqli_close($connection); // Closing Connection with Server
  header("refresh:5;url=../index.php");
  ?>
  <!DOCTYPE html>
  <html lang="en">
  <html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="insert.css" rel="stylesheet">
  </head>

  </html>
<?php
} else {
	echo "<h1>Please login first .</h1>";
	header("refresh:1;url=login.php");
}
?>