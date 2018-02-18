<?php

require('conexion.php');

$response['connection_error'] = "";
$response['error_sql'] = "";
$response['exito'] = false;

if($mysqli->connect_errno){
  $response['connection_error'] = "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}else{

  if(file_get_contents("php://input")){
    $datos = json_decode(file_get_contents("php://input"));
    foreach($datos as $row){
      $sql = "INSERT INTO `agenda`.`usuarios` (`id`, `correo`, `clave`, `nombre_completo`, `fecha_nacimiento`, `estado`, `fecha_creado`)
              VALUES (NULL, '$row->correo', MD5('$row->clave'), '$row->nombre_completo', '$row->fecha_nacimiento', 'A', CURRENT_TIMESTAMP);";
      if(!$mysqli->query($sql)){
        $response['error_sql'] = "Falló en la sentencia SQL: (".$mysqli->errno.") ".$mysqli->error;
    	}else{
        $response['exito'] = true;
      }
    }
  }

}

$mysqli->close();
$json = json_encode($response);
echo $json;

?>
