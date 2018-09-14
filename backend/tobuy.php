<?php
require ('sqlinclude.php');
$data = json_decode(file_get_contents("php://input"));
switch($data->action) {
    case 'getAll':
    $sql="SELECT * FROM tobuy";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
        // output data of each row
        $jsonData = array();
        $count = 0;
        while($row = mysqli_fetch_assoc($result)) {
           $jsonData[$count] = $row;
           $count++;
        }
        echo json_encode($jsonData);
    } else {
        echo "0 results";
    }
    break;
    case 'getAllForTodo':
    $sql="SELECT * FROM tobuy WHERE usedIn = ('$data->id')";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
        // output data of each row
        $jsonData = array();
        $count = 0;
        while($row = mysqli_fetch_assoc($result)) {
           $jsonData[$count] = $row;
           $count++;
        }
        echo json_encode($jsonData);
    } else {
        echo "0 results";
    }
    break;
    case 'createRecord':
    $sql = "INSERT INTO tobuy (name, status, creationDate, usedIn, quantity) VALUES ('$data->name', '$data->status', '$data->creationDate', '$data->usedIn', 1)";
    if (mysqli_query($conn, $sql)) {
        echo mysqli_insert_id($conn);
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    } 
    break;
    case 'deleteRecord':
    $sql = "DELETE FROM tobuy WHERE id = ('$data->id')";
    if (mysqli_query($conn, $sql)) {       
        echo "deleted";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    } 
    
    break;
    case 'update':
    $sql = "UPDATE tobuy SET name='$data->name', price='$data->price', quantity='$data->quantity', deadline='$data->deadline', creationDate='$data->creationDate', status='$data->status', category='$data->category', usedIn='$data->usedIn', supplier='$data->supplier' WHERE id='$data->id'";
    if (mysqli_query($conn, $sql)) {
        echo "update";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    } 
    break;
}
mysqli_close($conn);
?>