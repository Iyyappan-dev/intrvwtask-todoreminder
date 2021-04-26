function submit_form()
{
	var url = window.location.href;
	var user_email = url.split('=');
	
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
		$.post("http://localhost:3000/user/update_user_pwd",
			{
				user_id: user_email[1],
				user_password: $('#user_pwd').val()
			},
			function(data)
			{
				alert('Password Updated Successfully');
				window.location='login.html'
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