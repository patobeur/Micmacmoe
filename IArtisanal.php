<?php
// session_start(); // pas encore utile maispour les futur option de changement de joueurs ou de nombres de cases (sans rafraichier la page)
ini_set('display_errors',1); // pendant le dev pour afficher mes conchoncetés

//      contenu de config_db_simple.php
//      $host = '';
//      $db_name = '';
//      $username = '';
//      $password = '';
// 

if (!empty($_SERVER['HTTP_CLIENT_IP'])) {$ADDR = $_SERVER['HTTP_CLIENT_IP'];} 
elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {$ADDR = $_SERVER['HTTP_X_FORWARDED_FOR'];} 
else {$ADDR = $_SERVER['REMOTE_ADDR'];}

// $_SESSION['ipuser'] = $ADDR;
// $_SESSION['ipfake'] = strrev($ADDR); 
$ADDR = strrev($ADDR);

if (isset($_POST) && $_POST['seriedecoups']!='' && $_POST['nbcases']!='' && $_POST['nbcases']<6){
    $accespack = true;
    if ($accespack)
        {
        require_once('../../../../patobeur/config_db_simple.php');
        try {
            $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $seriedecoups = $_POST['seriedecoups'];
            $sql = 'SELECT * FROM micmacmoe WHERE seriedecoups="'.$seriedecoups.'"';
            $MaReponse = $conn->prepare($sql);
            $MaReponse->execute();        
            if (!$data = $MaReponse->fetch()) {
                $stmt = $conn->prepare("INSERT INTO micmacmoe(id,winnerid,starter,winnername,nbplayers,nbcases,seriedecoups,idproprio,ipuser,ladate)
                VALUES (:id,:winnerid,:starter,:winnername,:nbplayers,:nbcases,:seriedecoups,:idproprio,:ipuser,:ladate)");

                $id = 'NULL';
                $winnername = $_POST['winnername'];
                $nbplayers = $_POST['nbplayers'];
                $nbcases = $_POST['nbcases'];
                // $seriedecoups = $_POST['seriedecoups'];         // existe plus haut   
                $idproprio = $_POST['idproprio'];
                $ipuser = $_POST['ipuser'];
                $ladate = $timestamp = date('Y-m-d H:i:s');            
                $winnerid = $_POST['winnerid']+1;
                $starter = $_POST['starter']+1;
                
                $tutu = 1;
                $stmt->bindparam(':idproprio',$tutu);
                
                $stmt->bindparam(':id',$id);
                $stmt->bindparam(':winnerid',$winnerid);
                $stmt->bindparam(':starter',$starter);
                $stmt->bindparam(':winnername',$winnername);
                $stmt->bindparam(':nbplayers',$nbplayers);
                $stmt->bindparam(':nbcases',$nbcases);
                $stmt->bindparam(':seriedecoups',$seriedecoups);
                $stmt->bindparam(':ladate',$ladate);
                $stmt->bindparam(':ipuser',$ADDR);
                
                $stmt->execute();

                echo " Nouveauté!";     // renvoyer en claire dans lapage de retour. contenu récupéré par le js 
            } else {
                echo ' Merci!';         // idem qu'au dessus
            }
        }
        catch(PDOException $e){
            // echo "Error" . $e->getMessage(); a mettre pour envoyer les erreurs dans la console JS du navigateur (en clair) attention en ligne 1 ini_set('display_errors',1); 
            echo " Error!";             // idem que plus haut Nouveauté ou Merci
        }
        $conn = null; // fermeture bdd
    }
} elseif (isset($_POST) && $_POST['nbcases']!='' && $_POST['nbcases']<6 && isset($_POST['coups'])){ // Presque la même options. 3n faire qu'une ??? avec un gros switch
    if (isset($_POST['nbcases']) && $_POST['nbcases']!=''){$nbcases = $_POST['nbcases'];} // redondant ???
    else {$nbcases=3;}
    $accespost = true;
    $counting = 0;
    foreach ($_POST as $post => $val )  {
        if($val=='') {$accespost = false;};
        $counting++;
    }
    if ($accespost && $counting > 0)
        {
        require_once('../../../../patobeur/config_db_simple.php');
        try {
            $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $seriedecoups = $_POST['seriedecoups'];
            $sql = 'SELECT seriedecoups,winnerid,ladate,ipuser,winnername FROM micmacmoe WHERE nbcases='.$nbcases.' ORDER by ladate DESC';
            $MaReponse = $conn->prepare($sql);
            $MaReponse->execute();

            // TODO C'EST SAL ICI !!!
            $tempexteJSON = '{';
            $tempexteJSON .= '"user":[';
            $tempexteJSON .= '{"ipuser":"'.$ADDR.'"}';
            $tempexteJSON .= '],';
            $tempexteJSON .= '"coups":[';
            $i = 0;
            while($ligne = $MaReponse->fetch(PDO::FETCH_ASSOC)){       
                $tempexteJSON .= '{';
                $tempexteJSON .= '"seriedecoups":"' .$ligne['seriedecoups']. '",';
                $tempexteJSON .= '"winnerid":"' .$ligne['winnerid']. '",';
                $tempexteJSON .= '"ladate":"' .$ligne['ladate']. '",';
                $tempexteJSON .= '"ipuser":"' .$ligne['ipuser']. '",';
                $tempexteJSON .= '"winnername":"' .$ligne['winnername'].'"';
                $tempexteJSON .= '},';
                $i++;
            }  
            $tempexteJSON .= '{"check":"'.$i.'"}';
            $tempexteJSON .= ']';
            $tempexteJSON .= '}';    

            // echo json_encode($data);
            header('Content-Type: application/json');
            echo $tempexteJSON;
        }
        catch(PDOException $e){
            echo "Error" . $e->getMessage();
        }
        $conn = null;
    }
    else {
        echo 'Vide!';
    }
} // elseif (isset($_GET) && isset($_GET['demande']) && $_GET['demande']==1){
//     if (isset($_GET['nbcases']) && $_GET['nbcases']!=''){$nbcases = $_GET['nbcases'];}
//     else {$nbcases=3;}
//     $accesget = true;
//     $counting = 0;
//     foreach ($_GET as $get => $val )  {  
//         //echo $get.":".$val."<br/>";
//         if($val=='') {$accesget = false;};
//         $counting++;
//     }
//     if ($accesget && $counting > 0)
//         {
//         require_once('../../../../patobeur/config_db_simple.php');
//         try {
//             $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
//             // set the PDO error mode to exception
//             $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//             $seriedecoups = $_POST['seriedecoups'];
//             $sql = 'SELECT seriedecoups FROM micmacmoe WHERE nbcases='.$nbcases.' AND winnername!="Lola"';
//             $MaReponse = $conn->prepare($sql);
//             $MaReponse->execute();
//             // TODO C'EST SAL ICI !!!
//             $tempexteJSON = '[{';
//             while($ligne = $MaReponse->fetch(PDO::FETCH_ASSOC))
//             {   
//                 $tempexteJSON .= "'".$ligne['seriedecoups']."',";
//                 // $data[]= $ligne;
//             }  
//             $tempexteJSON .= "'00'";
//             $tempexteJSON .= '}]';    
//             // echo json_encode($data);
//             echo $tempexteJSON;
//         }
//         catch(PDOException $e){
//             echo "Error" . $e->getMessage();
//         }
//         $conn = null;
//     }
//     else {
//         echo 'Vide!';
//     }
// }
else {
    echo 'Nothing!';
}
?>