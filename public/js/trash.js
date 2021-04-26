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

function open_todo()
{
	window.location='http://localhost:3000/open_todo?token=' + jwt;
}

function open_exp_task()
{
	window.location='http://localhost:3000/open_exp_task?token=' + jwt;
}

function fetch_trash_data()
{
	$.post("http://localhost:3000/user/fetch_todo",
		{
			user_id: user_id,
			token: jwt
		},
		function(data)
		{
			console.log(data);
			var block_name = '';
			if(data.length > 0)
			{
				block_name = block_name + '<tr><th>Task Name</th><th>Task Type</th><th>Task Status</th><th>Creation Date</th><th>Schedule Date</th><th>Expiry Date</th><th>Restore</th></tr>';
				for(var i=0;i<data.length;i++)
				{
					if(data[i].trash_data == 'Y')
					{
						block_name = block_name+'<tr><td>'+data[i].task_name+'</td><td>'+data[i].task_type+'</td><td>'+data[i].task_status+'</td><td>'+data[i].today_date+'</td><td>'+data[i].schedule_date+'</td><td>'+data[i].expiry_date+'</td><td><button type="button" onclick="restore_task(\'' + data[i].task_id + '\');"><span class="glyphicon glyphicon-refresh"></span> Restore</button></td></tr>';
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
}

function restore_task(task_id)
{
	$.post("http://localhost:3000/user/restore_todo",
		{
			user_id: user_id,
			task_id: task_id,
			token: jwt
		},
		function(data)
		{
			alert("Restore Successful");
			window.location='http://localhost:3000/open_home?token=' + jwt;
		}
	)
}