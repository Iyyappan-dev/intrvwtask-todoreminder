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
		$.post("http://localhost:3000/user_signup",
			{
				user_id: $('#user_email').val(),
				user_password: $('#user_pwd').val()
			},
			function(data)
			{
				window.location = 'login.html';
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
					default:
						alert('Error');
				}
				
			}
		)
	}
	else
	{
		alert("Password does not match");
	}
}