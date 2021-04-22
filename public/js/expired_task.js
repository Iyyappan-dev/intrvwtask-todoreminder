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

function open_trash()
{
	window.location='http://localhost:3000/open_trash?token=' + jwt;
}

function fetch_todo_data()
{
	$.post("http://localhost:3000/fetch_todo",
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
				block_name = block_name + '<tr><th>Task Name</th><th>Task Type</th><th>Task Status</th><th>Creation Date</th><th>Schedule Date</th><th>Expiry Date</th></tr>';
				for(var i=0;i<data.length;i++)
				{
					// var expiry_date = new Date(data[i].expiry_date);
					var expiry_date = data[i].expiry_date.split('/');
					expiry_date = new Date(expiry_date[1]+'/'+expiry_date[0]+'/'+expiry_date[2]);
					if(expiry_date <= today_date)
					{
						block_name = block_name+'<tr><td>'+data[i].task_name+'</td><td>'+data[i].task_type+'</td><td>'+data[i].task_status+'</td><td>'+data[i].today_date+'</td><td>'+data[i].schedule_date+'</td><td>'+data[i].expiry_date+'</td></tr>';
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