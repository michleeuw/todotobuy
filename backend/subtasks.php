<?php
require ('sqlinclude.php');
$data = json_decode(file_get_contents("php://input"));
switch($data->action) {
    case 'getAll':
    $sql="SELECT * FROM subtasks WHERE parentTaskId = ('$data->id')";
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
    $sql = "INSERT INTO subtasks (name, status, parentTaskId) VALUES ('$data->name', '$data->status', '$data->parentTaskId')";
    if (mysqli_query($conn, $sql)) {
        echo mysqli_insert_id($conn);
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    } 
    break;
    case 'deleteRecord':
    $sql = "DELETE FROM subtasks WHERE id = ('$data->id')";
    if (mysqli_query($conn, $sql)) {       
        echo "deleted";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    } 
    break;
    case 'update':
    $sql = "UPDATE subtasks SET name='$data->name', description='$data->description', criterion='$data->criterion', deadline='$data->deadline', status='$data->status' WHERE id='$data->id'";
    if (mysqli_query($conn, $sql)) {
        echo "update";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    } 
    break;
}
mysqli_close($conn);
?>