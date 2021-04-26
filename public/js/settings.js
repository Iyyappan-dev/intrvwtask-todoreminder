var jwt = sessionStorage.getItem('jwt');
var user_id = sessionStorage.getItem('user_id');

function open_home()
{
	window.location='http://localhost:3000/open_home?token=' + jwt;
}

function open_todo()
{
	window.location='http://localhost:3000/open_todo?token=' + jwt;
}

function open_trash()
{
	window.location='http://localhost:3000/open_trash?token=' + jwt;
}

function open_exp_task()
{
	window.location='http://localhost:3000/open_exp_task?token=' + jwt;
}

function verify()
{
	if($('#user_verify_pwd').val().length>0)
	{
		if($('#user_verify_pwd').val().trim()=='')
		{
			alert('Please enter the password');
			$('#user_verify_pwd').focus();
			return;
		}
	}
	else
	{
		alert('Please enter the password');
		$('#user_verify_pwd').focus();
		return;
	}
	
	$.post("http://localhost:3000/user/verify_user",
		{
			user_id: user_id,
			user_password: $('#user_verify_pwd').val(),
			token: jwt
		},
		function(data)
		{
			document.getElementById('verification').style.display = 'none';
			document.getElementById('user_email').value = user_id;
			document.getElementById('user_details').style.display = 'block';
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
				default:
					alert('Error');
			}
			
		}
	)
}

function submit_form()
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
	
	if($('#user_re_pwd').val().length>0)
	{
		if($('#user_re_pwd').val().trim()=='')
		{
			alert('Please re-enter the password');
			$('#user_re_pwd').focus();
			return;
		}
	}
	else
	{
		alert('Please re-enter the password');
		$('#user_re_pwd').focus();
		return;
	}
	
	if($('#user_pwd').val() == $('#user_re_pwd').val())
	{
		$.post("http://localhost:3000/user/update_pwd",
			{
				user_id: $('#user_email').val(),
				user_password: $('#user_pwd').val(),
				token: jwt
			},
			function(data)
			{
				alert('Password Updated Successfully');
				window.location='http://localhost:3000/open_home?token=' + jwt;
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
						alert('User id already exist');
						break;
				}
				
			}
		)
	}
	else
	{
		alert("Password does not match");
	}
}