<?php

session_start();

if(!empty($_SESSION['usuario'])){
  require('conexion.php');

  if($mysqli->connect_errno){
    $response['connection_error'] = "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
  }else{
    $usuario = $_SESSION['usuario'];

    if(file_get_contents("php://input")){
      $datos = json_decode(file_get_contents("php://input"));
      foreach($datos as $row){
        $sql = "INSERT INTO `agenda`.`eventos` (`id`, `usuario`, `titulo`, `fecha_inicio`, `hora_inicio`, `fecha_fin`, `hora_fin`, `dia_completo`, `fecha_creado`)
                VALUES (NULL, '$usuario', '$row->titulo', '$row->start', '$row->startTime', '$row->end', '$row->endTime', '$row->allDay', CURRENT_TIMESTAMP);";
        if(!$mysqli->query($sql)){
          $response['error_sql'] = "Falló en la sentencia SQL: (".$mysqli->errno.") ".$mysqli->error;
      	}else{
          $response['exito'] = true;
        }
      }
    }else{
      $response['exito'] = false;
    }

  }

  $mysqli->close();

}else{
  $response['exito'] = false;
}



$json = json_encode($response);
echo $json;

?>
