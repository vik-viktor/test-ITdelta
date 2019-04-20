var oUrl = '/api.php';
var ui = {
    userLoad:function () {
    	// Функция первого запроса списка пользователей. Простой аякс к апи
    	if (window.location.pathname == '/') {
			$.ajax({
		        url: oUrl + '?users=1',
		        type: 'GET',
		        dataType:'json',
		        success: function(data) {
		        	var userList = '<div class="user-item-headers user-row row">\
		        		<div class="user-photo col"></div>\
		        		<div class="user-title col">Ф.И.О.</div>\
	        			<div class="user-date col">Дата рождения</div>\
	        			<div class="user-phone col">Телефон</div>\
	        			<div class="user-mail col">e-mail</div>\
	        			<div class="user-but user-but-edit col"></div>\
		        	</div>';
		        	var i = 0;
		            for (i in data) {
		            	var uID = data[i].ID;
		            	var uFIO = data[i].FIO;
		            	var uDATE = data[i].date;
		            	var uLOGIN = data[i].login;
		            	var uMAIL = data[i].mail;
		            	var uPHONE = data[i].phone;
		            	var uPHOTO = data[i].photo;
		            	if (!uPHOTO || uPHOTO == '' || uPHOTO == '/') {
		            		uPHOTO = '/img/no-image.svg'
		            	}
		        		userList += '\
			        		<div class="user-item user-row align-items-center row">\
			        			<div class="user-photo col"><img src="' + uPHOTO + '"></div>\
			        			<div class="user-title col">' + uFIO + '</div>\
			        			<div class="user-date col">' + uDATE + '</div>\
			        			<div class="user-phone col"><a href="tel:' + uPHONE + '">' + uPHONE + '</a></div>\
			        			<div class="user-mail col"><a href="mailto:' + uMAIL + '">' + uMAIL + '</div>\
			        			<div class="user-but user-but-edit col">\
			        				<div class="btn-block">\
				        				<a href="#" class="btn btn-outline-primary edit-user" data-id="' + uID + '">\
				        					Изменить\
				        				</a>\
				        			</div>\
			        				<div class="btn-block">\
				        				<a href="#" class="btn btn-outline-danger remove-user" data-id="' + uID + '">\
				        					Удалить\
				        				</a>\
				        			</div>\
			        			</div>\
			        		</div>';
		            }
		            $('.user-list').html(userList);
		        },
		        error: function(data) {
		            alert('request error');
		            console.log(data);
		        }
		    });
    	}
    },
    flashAlert: function (text) {
    	// Всплывающая подсказка
    	$('#flash').fadeIn(300).find('.modal-body').html(text);
    	setTimeout(function(){
    		ui.modalClose();
    	},2500)
    },
    modalClose: function () {
    	$('.modal').fadeOut(300);
    },
    mainInit: function () {
        this.userLoad();
    }
}
$(document).ready(function(){
    ui.mainInit();
    $('body').on('click', '.edit-user, .add-user', function() {
    	// Редактирование и удаление пользователя. Аякс для запроса данных конкретного пользователя.
    	var id = $(this).attr('data-id');
    	if (!id || id == '') {
    		$('#user').fadeIn(300).find('.form-title').html('Добавление пользователя');
    	}else{
    		$('#user').fadeIn(300).find('.form-title').html('Редактирование пользователя');
    		$('.edit-form input[name="id"]').val(id)
    		
    		$.ajax({
		        url: oUrl + '?user=1',
		        type: 'POST',
		        data: {'id':id},
		        dataType:'json',
		        success: function(data) {
		        	console.log(data)
		        	var uPHOTO = data.photo;
		        	if (!uPHOTO || uPHOTO == '' || uPHOTO == '/') {
	            		uPHOTO = '/img/no-image.svg'
	            	}
		            $('.edit-form .photo-group label').css({
		            	'background-image':'url('+uPHOTO+')'
		            })
		            $('.edit-form input[name="title"]').val(data.FIO)
		            $('.edit-form input[name="date"]').val(data.date)
		            $('.edit-form input[name="phone"]').val(data.phone)
		            $('.edit-form input[name="mail"]').val(data.mail)
		            $('.edit-form input[name="login"]').val(data.login)
		            $('.edit-form input[name="password"]').val(data.password)
		        },
		        error: function(data) {
		            alert('request error');
		            console.log(data);
		        }
		    });
    	}
    	return false;
    });
    $('body').on('click', '.remove-user', function() {
    	// Удаление пользователя с подтверждением
    	var id = $(this).attr('data-id');
    	var confirmation = confirm("Вы уверены, что хотите удалить элемент?");
    	if (confirmation) {
	    	$.ajax({
		        url: oUrl+'?remove=1&id='+id,
		        type: 'POST',
		        dataType:'json',
		        success: function(data) {
		        	if (data == 'ok') {
			        	ui.flashAlert('Пользователь был успешно удален')
			        	ui.userLoad();
		        	}
		        },
		        error: function(data) {
		            alert('request error');
		            console.log(data);
		        	ui.flashAlert('Возникли неполадки на сервере <br>Попробуйте позже')
		        }
		    });
    	}
    	return false;
    });
    $('body').on('change', '.edit-form .photo-group input', function() {
    	// Скрывает фото пользователя если было выбрано новое.
    	$('.edit-form .photo-group label').css({
    		'background-image':'url(img/loader.gif)'
    	})
    	setTimeout(function(){
    		$('.edit-form .photo-group label').hide(0)
    	},500)
    })
    
    $('.modal .closeModal').on('click', function() {
    	ui.modalClose();
    	return false;
    })
})

