function login()
{
	if($('#user_email').val().length>0)
	{
		if($('#user_email').val().trim()=='')
		{
			alert('Please enter the email id');
			$('#user_email').focus();
			return;
		}
	}
	else
	{
		alert('Please enter the email id');
		$('#user_email').focus();
		return;
	}
	
	if($('#user_pwd').val().length>0)
	{
		if($('#user_pwd').val().trim()=='')
		{
			alert('Please enter the password');
			$('#user_pwd').focus();
			return;
		}
	}
	else
	{
		alert('Please enter the password');
		$('#user_pwd').focus();
		return;
	}
	
	$.post("http://localhost:3000/user_login",
		{
			user_id: $('#user_email').val(),
			user_password: $('#user_pwd').val()
		},
		function(data)
		{
			sessionStorage.setItem('jwt',data);
			sessionStorage.setItem('user_id',$('#user_email').val());
			// console.log(data);
			window.location = 'home.html';
		}	
	)
	.fail(function (xhr)
		{
			switch (xhr.status)
			{
				case 500:
					alert('500: Error. ');
					break;
				case 501:	
					alert('Incorrect username');
					break;
				case 502:
					alert('Incorrect password');
					break;
				case 503:
					alert('This user cannot access the application');
					break;
				default:
					alert('Error');
			}
			
		}
	)
}

function forgot_password()
{
	if($('#user_validate_email').val().length>0)
	{
		if($('#user_validate_email').val().trim()=='')
		{
			alert('Please enter the email id');
			$('#user_validate_email').focus();
			return;
		}
	}
	else
	{
		alert('Please enter the email id');
		$('#user_validate_email').focus();
		return;
	}
	
	$.post("http://localhost:3000/forgot_password",
		{
			user_id: $('#user_validate_email').val()
		},
		function(data)
		{
			alert("Password has been sent to your email id");
		}	
	)
	.fail(function (xhr)
		{
			switch (xhr.status)
			{
				case 500:
					alert('500: Error. ');
					break;
				case 501:	
					alert('This user id not exist');
					break;
				case 502:
					alert('Incorrect password');
					break;
				case 503:
					alert('This user cannot access the application');
					break;
				default:
					alert('Error');
			}
			
		}
	)
}