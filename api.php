<?
require_once('config.php');
// Подключение к БД
$link = new mysqli($host, $dbuser, $dbpass, $db);
if (!$link) {
    die('Ошибка соединения: ' . mysql_error());
}
if ($_REQUEST['users']){
	// Запрос пользователей
	$res = [];
	$query = "SELECT * FROM users";
	$result = $link->query($query);
	if ($result->num_rows > 0) {
		$i = 0;
	    while($row = $result->fetch_assoc()) {
	        $res[$i] = $row;
	        $i++;
	    }
	} else {
	    echo "0 results";
	}
	print_r(json_encode($res));
}
if ($_REQUEST['user']){
	// Запрос конкретного пользователя
	$id = $_REQUEST['id'];
	$res = [];
	$query = "SELECT * FROM users WHERE ID = '$id'";
	$result = $link->query($query);
	print_r(json_encode($result->fetch_assoc()));
}
if ($_REQUEST['remove']){
	// Удаление пользователя
	$id = $_REQUEST['id'];
	$sql = "DELETE FROM `users` WHERE `ID` = $id";
	if ($link->query($sql) === TRUE) {
	    print_r(json_encode('ok'));
	} else {
	    print_r(json_encode('error'));
	}
}
if ($_REQUEST['useredit']){
	// Редактирование пользователя
	$res = [];
	$id = $_POST['id'];
	$fio = $_POST['title'];
	$date = $_POST['date'];
	$phone = $_POST['phone'];
	$mail = $_POST['mail'];
	$login = $_POST['login'];
	$password = $_POST['password'];
	$photo = '';
	if ($id == '') {
		$sql = "INSERT INTO `users` 
		(`ID`, `FIO`, `date`, `phone`, `mail`, `login`, `password`) VALUES 
		(NULL, '$fio', '$date', '$phone', '$mail', '$login', '$password')";
	}else{
		if ( $_FILES['photo']['error'] <= 0 ) {
			// Загрузка изображения пользователя ели выбрано.
			$uploaddir = 'img/user-images';
	        $ttt = explode(".", $_FILES["photo"]["name"]);
	        $file_name = date("Y-m-d-H-i-s") . '.' . end($ttt);
			move_uploaded_file( $_FILES["photo"]['tmp_name'], "$uploaddir/$file_name" );
	            $sql = "UPDATE `users` SET 
				`FIO` = '$fio', `date` = '$date', `phone` = '$phone', `mail` = '$mail', `login` = '$login', `password` = '$password', `photo` = '$uploaddir/$file_name' WHERE 
				`ID` = '$id'";
	    }else{
			$sql = "UPDATE `users` SET 
			`FIO` = '$fio', `date` = '$date', `phone` = '$phone', `mail` = '$mail', `login` = '$login', `password` = '$password' WHERE 
			`ID` = '$id'";
	    }
		if ($link->query($sql) === TRUE) {
			/* т.к. Загрузка фото средствами аякс с текстом одновременно у меня не получилась 
				или я просто не понимаю как ее сделать, я сделал переход на страницу и обратный 
				редирект.
			*/
		    header('Location: /',true);
			exit;
		} else {
		    echo "Error: " . $sql . "<br>" . $link->error;
		}
	}
}

$link->close();
?>