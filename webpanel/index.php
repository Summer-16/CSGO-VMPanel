<?php
session_start();
?>
<?php
if ($_SESSION["name"]) {
  ?>
  <?php
  include('./config/config.php');
  $conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
  if (!$conn) {
    die('Failed to connect to MySQL: ' . mysqli_connect_error());
  }
  $sql = 'SELECT * FROM retakevip';   // <<-- Change table name here
  $sql2 = 'SELECT * FROM awpvip';   // <<-- Change table name here
  $sql3 = 'SELECT * FROM arenavip';   // <<-- Change table name here
  $sql4 = 'SELECT * FROM executevip';   // <<-- Change table name here
  $sql5 = 'SELECT * FROM awp2vip';   // <<-- Change table name here
  $query = mysqli_query($conn, $sql);
  $query2 = mysqli_query($conn, $sql2);
  $query3 = mysqli_query($conn, $sql3);
  $query4 = mysqli_query($conn, $sql4);
  $query5 = mysqli_query($conn, $sql5);
  if (!$query) {
    die('SQL Error: ' . mysqli_error($conn));
  }
  ?>
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="./css/project.css" rel="stylesheet">
    <title>VIP CP</title>
    <link rel="icon" href="favicon.ico" type="image/x-icon">
  </head>

  <body>
    <a class="logout" href="./views/logout.php">Logout</a>
    <h1>VIP Management Panel
    </h1>
    <div class="main">
      <div class="formcolumn one">
        <div class="subheader">ADD A NEW VIP</div>
        <form action="./views/insert.php" method="post">
          <br>
          <label>Steam ID
          </label><br>
          <input class="input" name="Id" type="text" placeholder="enter steam id"><br>
          <label>Name
          </label><br>
          <input class="input" name="name" type="text" placeholder="enter name">
          <label>Days
          </label><br>
          <input class="input" name="day" type="text" placeholder="number of days">
          <label>Server
          </label>
          <select name="server">
            <option value="retake">Retake     <!-- <<-- Change server name here -->
            </option>
            <option value="awp">AWP Delhi     <!-- <<-- Change server name here -->
            </option>
            <option value="arena">1v1     <!-- <<-- Change server name here -->
            </option>
            <option value="execute">Execute     <!-- <<-- Change server name here -->
            </option>
            <option value="awp2">AWP Mumbai     <!-- <<-- Change server name here -->
            </option>
          </select>
          <input class="submit" name="submit" type="submit" value="Insert">
        </form>
      </div>
      <div class="formcolumn two">
        <div class="subheader">UPDATE AN OLD VIP </div>
        <form action="./views/update.php" method="post">
          <br>
          <label>Steam ID
          </label>
          <input class="input" name="Id" type="text" placeholder="id should match with table [example &#34;steam:x:y:111&#34;]">
          <label>Days to add
          </label>
          <input class="input" name="day" type="text" placeholder="number of days">
          <label>Server
          </label>
          <select name="server">
            <option value="retake">Retake     <!-- <<-- Change server name here -->
            </option>
            <option value="awp">AWP Delhi     <!-- <<-- Change server name here -->
            </option>
            <option value="arena">1v1     <!-- <<-- Change server name here -->
            </option>
            <option value="execute">Execute     <!-- <<-- Change server name here -->
            </option>
            <option value="awp2">AWP Mumbai     <!-- <<-- Change server name here -->
            </option>
          </select>
          <input class="submit" name="submit" type="submit" value="UPDATE">
        </form>
      </div>
    </div>
    <div class="column three">
      <div class="tabletitle">RETAKE     <!-- <<-- Change server name here -->
      </div>
      <table>
        <thead>
          <tr>
            <th>Steam ID
            </th>
            <th>Name
            </th>
            <th>Expire Date
            </th>
          </tr>
        </thead>
        <tbody>
          <?php
          while ($row = mysqli_fetch_array($query)) {
            echo '<tr>
<td>' . $row['authId'] . '</td>
<td>' . $row['name'] . '</td>
<td>' . date('d-m-Y', $row['expireStamp']) . '</td>
</tr>';
          } ?>
        </tbody>
      </table>
    </div>
    <div class="column four">
      <div class="tabletitle">AWP Delhi     <!-- <<-- Change server name here -->
      </div>
      <table>
        <thead>
          <tr>
            <th>Steam ID
            </th>
            <th>Name
            </th>
            <th>Expire Date
            </th>
          </tr>
        </thead>
        <tbody>
          <?php
          while ($row = mysqli_fetch_array($query2)) {
            echo '<tr>
<td>' . $row['authId'] . '</td>
<td>' . $row['name'] . '</td>
<td>' . date('d-m-Y', $row['expireStamp']) . '</td>
</tr>';
          } ?>
        </tbody>
      </table>
    </div>
    <div class="column five">
      <div class="tabletitle">1V1     <!-- <<-- Change server name here -->
      </div>
      <table>
        <thead>
          <tr>
            <th>Steam ID
            </th>
            <th>Name
            </th>
            <th>Expire Date
            </th>
          </tr>
        </thead>
        <tbody>
          <?php
          while ($row = mysqli_fetch_array($query3)) {
            echo '<tr>
<td>' . $row['authId'] . '</td>
<td>' . $row['name'] . '</td>
<td>' . date('d-m-Y', $row['expireStamp']) . '</td>
</tr>';
          } ?>
        </tbody>
      </table>
    </div>
    <div class="column six">
      <div class="tabletitle">EXECUTE     <!-- <<-- Change server name here -->
      </div>
      <table>
        <thead>
          <tr>
            <th>Steam ID
            </th>
            <th>Name
            </th>
            <th>Expire Date
            </th>
          </tr>
        </thead>
        <tbody>
          <?php
          while ($row = mysqli_fetch_array($query4)) {
            echo '<tr>
<td>' . $row['authId'] . '</td>
<td>' . $row['name'] . '</td>
<td>' . date('d-m-Y', $row['expireStamp']) . '</td>
</tr>';
          } ?>
        </tbody>
      </table>
    </div>
    <div class="column seven">
      <div class="tabletitle">AWP Mumbai     <!-- <<-- Change server name here -->
      </div>
      <table>
        <thead>
          <tr>
            <th>Steam ID
            </th>
            <th>Name
            </th>
            <th>Expire Date
            </th>
          </tr>
        </thead>
        <tbody>
          <?php
          while ($row = mysqli_fetch_array($query5)) {
            echo '<tr>
<td>' . $row['authId'] . '</td>
<td>' . $row['name'] . '</td>
<td>' . date('d-m-Y', $row['expireStamp']) . '</td>
</tr>';
          } ?>
        </tbody>
      </table>
    </div>
  </body>

  </html>
<?php
} else {
  echo "<h1>Please login first .</h1>";
  header("refresh:1;url=./views/login.php");
}
?>