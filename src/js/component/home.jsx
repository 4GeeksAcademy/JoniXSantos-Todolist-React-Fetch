import React, { useState, useEffect } from "react";

const Home = () => {

	const [ list, setList ] = useState([]);
	const [ task, setTask ] = useState("");
	const [ edit, setEdit ] = useState(false);
	const [ currentTask, setCurrentTask ] = useState(null);

	const host = 'https://playground.4geeks.com';

	const getData = async () => {
		const uri = `${host}/todo/users/JoniXSantos`;
		const response = await fetch(uri);
		if (!response.ok) {
			console.log('Error: ', response.status, response.statusText);
			return;
		};
		const data = await response.json();
		setList(data.todos);
	}

	const addTask = async () => {
		const dataToSend = {
			label: task,
			is_done: false
		};
		const uri = `${host}/todo/todos/JoniXSantos`;
		const options = {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(dataToSend)
		};
		const response = await fetch(uri, options);
		if (!response.ok) {
			console.log('Error: ', response.status, response.statusText);
			return;
		};
		setTask('');
		getData();
	}

	const editTask = async (item) => {
		const dataToSend = {
			label: task,
			is_done: false
		};
		const uri = `${host}/todo/todos/${item.id}`;
		const options = {
			method: 'PUT',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(dataToSend)
		};
		const response = await fetch(uri, options);
		if (!response.ok) {
			console.log('Error: ', response.status, response.statusText);
			return;
		}
		setEdit(false);
		setTask('');
		setCurrentTask(null);
		getData();
	}

	const checkTask = async (item) => {
		const dataToSend = {
			label: item.label,
			is_done: true
		};
		const uri = `${host}/todo/todos/${item.id}`;
		const options = {
			method: 'PUT',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(dataToSend)
		};
		const response = await fetch(uri, options);
		if (!response.ok) {
			console.log('Error: ', response.status, response.statusText);
			return;
		}
		setCurrentTask(null);
		getData();
	}

	const deleteTask = async (item) => {
		const uri = `${host}/todo/todos/${item.id}`;
		const options = {
			method: 'DELETE',
			headers: {
				"Content-Type": "application/json"
			}
		};
		const response = await fetch(uri, options);
		if (!response.ok) {
			console.log('Error: ', response.status, response.statusText);
			return;
		}
		getData();
	}

	useEffect(() => {
		getData();
	}, []);

	return (
		<div className="container col-4">
			<h1 className="text-center text-light mt-3">To Do List</h1>
			<h2 className="text-center text-light mb-3">with React and Fetch</h2>
			<ul>
				<li>
					{!edit ? 
						<input type="text" value={task} onChange={(e) => setTask(e.target.value)} onKeyDown={(e) => {
							if (e.key === "Enter") {
								addTask();
							}}}
						placeholder="Add a task" /> 
						: 
						<input type="text" value={task} onChange={(e) => setTask(e.target.value)} onKeyDown={(e) => {
							if (e.key === "Enter") {
								editTask(currentTask);
							}}}
							placeholder="Edit this task" />
						}
				</li>
				{list.map((item) => (
					<li key={item.id}>
						<div className="d-flex align-items-baseline justify-content-between">
							{!item.is_done ? item.label : <del>{item.label}</del>}
							<div>
							{!item.is_done ? <i className="fas fa-pencil-alt text-warning me-3" 
								onClick={() => {
									setEdit(true);
									setTask(item.label);
									setCurrentTask(item);
								}}></i> : ''}
								{!item.is_done ? <i className="fas fa-check text-success me-3" onClick={() => checkTask(item)}></i> : ''}
								<i className="fas fa-trash text-danger" onClick={() => deleteTask(item)}></i>
							</div>
						</div>
					</li>
				))}
				<li style={{fontSize: "13px"}}>
					{list.length} {list.length !== 1 ? "tasks" : "task"} left
				</li>
			</ul>
		</div>
	);
};

export default Home;