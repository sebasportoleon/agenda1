<?php

header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST');
header("access-control-allow-origin: *");

require('conexion.php');

$response['exito'] = false;

if($mysqli->connect_errno){
  $response['connection_error'] = "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}else{

  if(file_get_contents("php://input")){
    $datos = json_decode(file_get_contents("php://input"));
    foreach($datos as $row){
      $sql = "SELECT id, correo, nombre_completo
              FROM usuarios
              WHERE correo = '$row->correo'
              AND clave = MD5('$row->clave')
              AND estado = 'A'";
      $result = $mysqli->query($sql);
      if(!$result){
        $response['error_sql'] = "Falló en la sentencia SQL: (".$mysqli->errno.") ".$mysqli->error;
      }else{

        if($result->num_rows > 0){
          session_start();
          $result->data_seek(0);
          while($fila = $result->fetch_assoc()){
              $response['usuario'] = $fila['id'];
              $response['correo'] = $fila['correo'];
              $response['nombre'] = $fila['nombre_completo'];
              $_SESSION['usuario'] = $fila['id'];
              $_SESSION['correo'] = $fila['correo'];
              $_SESSION['nombre'] = $fila['nombre_completo'];
          }
          $response['exito'] = true;
        }

      }
    }
  }

}

$mysqli->close();
$json = json_encode($response);
echo $json;

?>
