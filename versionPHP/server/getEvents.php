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

    $sql = "SELECT `id`, `titulo`, `fecha_inicio`, `hora_inicio`, `fecha_fin`, `hora_fin`, `dia_completo`
            FROM `eventos`
            WHERE `usuario` = $usuario";
    $result = $mysqli->query($sql);
    if(!$result){
      $response['error_sql'] = "Falló en la sentencia SQL: (".$mysqli->errno.") ".$mysqli->error;
    }else{

      $result->data_seek(0);
      $response['eventos'] = array();
      while($fila = $result->fetch_assoc()){
        switch($fila['dia_completo']){
            case "0":
                $allDay = false;
                break;
            case "1":
                $allDay = true;
                break;
        }
        $evento = array(
          'id' => $fila['id'],
          'title' => $fila['titulo'],
          'start' => $fila['fecha_inicio'].' '.$fila['hora_inicio'],
          'end' => $fila['fecha_fin'].' '.$fila['hora_fin'],
          'allDay' => $allDay
        );
        array_push($response['eventos'], $evento);
      }
      $response['exito'] = true;
    }
  }

  $mysqli->close();

}else{
  $response['exito'] = false;
}

$json = json_encode($response);
echo $json;

?>
