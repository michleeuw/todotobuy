<?php
require ('sqlinclude.php');
$data = json_decode(file_get_contents("php://input"));
switch($data->action) {
    case 'getAll':
    $sql="SELECT * FROM people";
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
    $sql = "INSERT INTO people (name) VALUES ('$data->name')";
    if (mysqli_query($conn, $sql)) {
        echo mysqli_insert_id($conn);
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    } 
    break;
    case 'deleteRecord':
    $sql = "DELETE FROM people WHERE id = ('$data->id')";
    if (mysqli_query($conn, $sql)) {
        echo "deleted";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    } 
    $sql = "DELETE FROM todo_person WHERE person_id = ('$data->id')";
     if (mysqli_query($conn, $sql)) {
        echo "relation deleted";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    } 
    break;
    case 'update':
    $sql = "UPDATE people SET name='$data->name', function='$data->function', phone='$data->phone', email='$data->email' WHERE id='$data->id'";
    if (mysqli_query($conn, $sql)) {
        echo "update";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    } 
    break;
    case 'addPersonToTodo':
    $sql = "INSERT INTO todo_person (todo_id, person_id) VALUES ('$data->todo_id', '$data->person_id')";
    if (mysqli_query($conn, $sql)) {
        echo "succes";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    } 
    break; 
    case 'removePersonFromTodo':
    $sql = "DELETE FROM todo_person WHERE todo_id = ('$data->todo_id') AND person_id = ('$data->person_id')";
    if (mysqli_query($conn, $sql)) {
        echo "relationdeleted";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    } 
    break;    
     case 'getPeopleForTodo':
    $sql="SELECT person_id FROM todo_person WHERE todo_id = ('$data->todo_id')";
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
}
mysqli_close($conn);
?>