var jwt = sessionStorage.getItem('jwt');
var user_id = sessionStorage.getItem('user_id');

function open_settings()
{
	window.location='http://localhost:3000/open_settings?token=' + jwt;
}

function open_home()
{
	window.location='http://localhost:3000/open_home?token=' + jwt;
}

function open_trash()
{
	window.location='http://localhost:3000/open_trash?token=' + jwt;
}

function open_exp_task()
{
	window.location='http://localhost:3000/open_exp_task?token=' + jwt;
}

function submit_todo()
{
	if($('#task_name').val().length>0)
	{
		if($('#task_name').val().trim()=='')
		{
			alert('Please enter the task name');
			$('#task_name').focus();
			return;
		}
	}
	else
	{
		alert('Please enter the task name');
		$('#task_name').focus();
		return;
	}
	
	if($('#task_type').val().length>0)
	{
		if($('#task_type').val().trim()=='SELECT')
		{
			alert('Please select the task type');
			$('#task_type').focus();
			return;
		}
	}
	else
	{
		alert('Please select the task type');
		$('#task_type').focus();
		return;
	}
	
	if($('#start_datepicker').val().length>0)
	{
		if($('#start_datepicker').val().trim()=='SELECT')
		{
			alert('Please select the expiry date');
			$('#start_datepicker').focus();
			return;
		}
	}
	else
	{
		alert('Please select the expiry date');
		$('#start_datepicker').focus();
		return;
	}
	
	if($('#schedue_datepicker').val().length>0)
	{
		if($('#schedue_datepicker').val().trim()=='SELECT')
		{
			alert('Please select the schedule date');
			$('#schedue_datepicker').focus();
			return;
		}
	}
	else
	{
		alert('Please select the schedule date');
		$('#schedue_datepicker').focus();
		return;
	}
	
	$.post("http://localhost:3000/insert_todo",
		{
			user_id: user_id,
			task_name: $('#task_name').val(),
			task_type: $('#task_type').val(),
			expiry_date: $('#start_datepicker').val(),
			schedule_date: $('#schedue_datepicker').val(),
			token: jwt
		},
		function(data)
		{
			alert("Your TODO data is added to the list");
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
				default:
					alert('Error');
			}
			
		}
	)
}