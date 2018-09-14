<?php
$host="mysql.leeuwdesign.nl"; // Host name 
$username="leeuwdesign"; // Mysql username 
$password="draadstaal38"; // Mysql password 
$dbname="leeuwdesign"; // Database name
// Create connection
$conn = mysqli_connect($host, $username, $password, $dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>