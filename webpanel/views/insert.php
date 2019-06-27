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
		$name = $_POST['name'];
		$day = $_POST['day'];
		$server = $_POST['server'];
		$expireStamp = time() + ($day * 86400);
		if ($authId != '' || $expireStamp != '') {
			//Insert Query of SQL
			//$query = mysqli_query($connection,"insert into vipUser(authId, expireStamp) values ('$authId', '$expireStamp')");
			if ($server == 'retake') {    // <<-- Change table and server name here
				mysqli_query($connection, "INSERT INTO retakevip (authId,flag,name,expireStamp) 
	VALUES ('\"$authId\"','\"a\"','//$name','$expireStamp')");
				echo "<h1>Retake VIP Added successfully...!!</h1>";
			}
			if ($server == 'awp') {    // <<-- Change table and server name here
				mysqli_query($connection, "INSERT INTO awpvip (authId,flag,name,expireStamp) 
	VALUES ('\"$authId\"','\"a\"','//$name','$expireStamp')");
				echo "<h1>AWP VIP Added successfully...!!</h1>";
			}
			if ($server == 'arena') {    // <<-- Change table and server name here
				mysqli_query($connection, "INSERT INTO arenavip (authId,flag,name,expireStamp) 
	VALUES ('\"$authId\"','\"a\"','//$name','$expireStamp')");
				echo "<h1>1v1 VIP Added successfully...!!</h1>";
			}
			if ($server == 'execute') {    // <<-- Change table and server name here
				mysqli_query($connection, "INSERT INTO executevip (authId,flag,name,expireStamp) 
	VALUES ('\"$authId\"','\"a\"','//$name','$expireStamp')");
				echo "<h1>Execute VIP Added successfully...!!</h1>";
			}
			if ($server == 'awp2') {    // <<-- Change table and server name here
				mysqli_query($connection, "INSERT INTO awp2vip (authId,flag,name,expireStamp) 
	VALUES ('\"$authId\"','\"a\"','//$name','$expireStamp')");
				echo "<h1>AIM VIP Added successfully...!!</h1>";
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