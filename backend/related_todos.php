<?php
require ('sqlinclude.php');
$data = json_decode(file_get_contents("php://input"));
switch($data->action) {
    case 'getAll':
    $sql="SELECT * FROM related_todos WHERE todo1_id = ('$data->id') OR todo2_id = ('$data->id')";
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
    $sql = "INSERT INTO related_todos (todo1_id, todo2_id) VALUES ('$data->todo1_id', '$data->todo2_id')";
    if (mysqli_query($conn, $sql)) {
        echo mysqli_insert_id($conn);
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    } 
    break;
    case 'deleteRecord':
    $sql = "DELETE FROM related_todos WHERE todo1_id = ('$data->todo1_id') AND todo2_id = ('$data->todo2_id')";
    if (mysqli_query($conn, $sql)) {
        echo "deleted";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    } 
    break;   
}
mysqli_close($conn);
?>