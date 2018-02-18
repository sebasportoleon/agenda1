<?php

header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST');
header("access-control-allow-origin: *");

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
        $sql = "UPDATE `agenda`.`eventos`
                SET `fecha_inicio` = '$row->start',
                `hora_inicio` = '$row->startTime',
                `fecha_fin` = '$row->end',
                `hora_fin` = '$row->endTime'
                WHERE `eventos`.`id` = $row->id
                AND `eventos`.`usuario` = $usuario";
        $result = $mysqli->query($sql);
      }
      if(!$result){
        $response['error_sql'] = "Falló en la sentencia SQL: (".$mysqli->errno.") ".$mysqli->error;
      }else{
        $response['exito'] = true;
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
