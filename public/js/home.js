var jwt = sessionStorage.getItem('jwt');
var user_id = sessionStorage.getItem('user_id');
var array = [];
function open_settings()
{
	window.location='http://localhost:3000/open_settings?token=' + jwt;
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

function fetch_todo_data()
{
	$.post("http://localhost:3000/user/fetch_todo",
		{
			user_id: user_id,
			token: jwt
		},
		function(data)
		{
			console.log(data);
			array = data;
			var today_date = new Date();
			var block_name = '';
			if(data.length > 0)
			{
				block_name = block_name + '<tr><th>Task Name</th><th>Task Type</th><th>Task Status</th><th>Creation Date</th><th>Schedule Date</th><th>Expiry Date</th><th>Edit</th><th>Delete</th></tr>';
				for(var i=0;i<data.length;i++)
				{
					// var expiry_date = new Date(data[i].expiry_date);
					console.log(expiry_date >= today_date);
					var expiry_date = data[i].expiry_date.split('/');
					expiry_date = new Date(expiry_date[1]+'/'+expiry_date[0]+'/'+expiry_date[2]);
					if(expiry_date >= today_date && data[i].trash_data == 'N')
					{
						block_name = block_name+'<tr><td>'+data[i].task_name+'</td><td>'+data[i].task_type+'</td><td>'+data[i].task_status+'</td><td>'+data[i].today_date+'</td><td>'+data[i].schedule_date+'</td><td>'+data[i].expiry_date+'</td><td><button type="submit" onclick="open_modal(\'' + data[i].task_id + '\');">Edit</button></td><td><button type="button" class="deletebtn" onclick="delete_task(\'' + data[i].task_id + '\');">Delete</button></td></tr>';
					}
					else
					{
						if(data[i].task_status == 'Completed' && data[i].trash_data == 'N')
						{
							block_name = block_name+'<tr><td>'+data[i].task_name+'</td><td>'+data[i].task_type+'</td><td>'+data[i].task_status+'</td><td>'+data[i].today_date+'</td><td>'+data[i].schedule_date+'</td><td>'+data[i].expiry_date+'</td><td><button type="submit" onclick="open_modal(\'' + data[i].task_id + '\');">Edit</button></td><td><button type="button" class="deletebtn" onclick="delete_task(\'' + data[i].task_id + '\');">Delete</button></td></tr>';
						}
					}
				}
				document.getElementById('display_todo').innerHTML = block_name;
			}
			else
			{
				block_name = block_name+'<h2 style="color:red;">No task to display</h2>';
				document.getElementById('empty_todo').innerHTML = block_name;
			}
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

function delete_task(task_id)
{
	$.post("http://localhost:3000/user/delete_todo",
		{
			user_id: user_id,
			task_id: task_id,
			token: jwt
		},
		function(data)
		{
			alert('Task moved successfully to trash');
			window.location='http://localhost:3000/open_home?token=' + jwt;
		}
	)
}

function open_modal(task_id)
{
	sessionStorage.setItem('task_id',task_id);
	document.getElementById('myModal').style.display = 'block';
	for(var i=0;i<array.length;i++)
	{
		if(array[i].task_id == task_id)
		{
			document.getElementById('task_name').value = array[i].task_name;
			document.getElementById('task_type').value = array[i].task_type;
			document.getElementById('task_status').value = array[i].task_status;
			document.getElementById('schedue_datepicker').value = array[i].schedule_date;
			document.getElementById('start_datepicker').value = array[i].expiry_date;
		}
	}
}

function close_modal()
{
	document.getElementById('myModal').style.display = 'none';
}

function Update_todo()
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
	
	if($('#task_status').val().length>0)
	{
		if($('#task_status').val().trim()=='SELECT')
		{
			alert('Please select the task status');
			$('#task_status').focus();
			return;
		}
	}
	else
	{
		alert('Please select the task status');
		$('#task_status').focus();
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
	
	$.post("http://localhost:3000/user/update_todo",
		{
			user_id: user_id,
			task_name: $('#task_name').val(),
			task_type: $('#task_type').val(),
			task_status: $('#task_status').val(),
			expiry_date: $('#start_datepicker').val(),
			schedule_date: $('#schedue_datepicker').val(),
			token: jwt,
			task_id: sessionStorage.getItem('task_id')
		},
		function(data)
		{
			alert("Your TODO data is updated");
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