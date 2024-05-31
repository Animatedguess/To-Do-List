// src/components/TodoApp.js
import React, { useState, useEffect } from 'react';
import './TodoApp.css';
import { useRef } from 'react';
import dustBin from './dust3.png';
import addIcon from './plus2.png';

const TodoApp = () => {
    const buttonRef = useRef(null);
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [sortOrder, setSortOrder] = useState('none'); // none, asc, desc

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(savedTasks);
    }, []);

    let count = 0;

    useEffect(() => {
        const button = buttonRef.current;

        const handleClick = () => {
            button.classList.add('rotate360');
            if (!button) return;
            // Remove the class after the animation completes
            setTimeout(() => {
                button.classList.remove('rotate360');
            }, 1000); // Adjust the timing to match the animation duration
        };

        button.addEventListener('click', handleClick);

        // Clean up the event listener on component unmount
        return () => {
            if (button) {
                button.removeEventListener('click', handleClick);
            }
        };
    }, [count]);

    const saveTasksToLocalStorage = (updatedTasks) => {
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const addTask = () => {
        if (taskInput.trim() === '') {
            alert('Task cannot be empty');
            return;
        }
        const newTask = { id: Date.now(), text: taskInput, completed: false };
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        saveTasksToLocalStorage(updatedTasks);
        setTaskInput('');
        count++;
    };

    const removeTask = (id) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
        saveTasksToLocalStorage(updatedTasks);
    };

    const toggleTaskCompletion = (id) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
        saveTasksToLocalStorage(updatedTasks);
    };

    const sortTasks = (criteria) => {
        let sortedTasks = [];
        switch (criteria) {
            case 'name':
                sortedTasks = [...tasks].sort((a, b) => a.text.localeCompare(b.text));
                break;
            case 'status':
                sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);
                break;
            default:
                sortedTasks = tasks;
                break;
        }
        if (sortOrder === 'desc') {
            sortedTasks.reverse();
        }
        setTasks(sortedTasks);
    };

    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    return (
        <div className="todo-app">
            <h1>Todo List</h1>
            <div className="task-input">
                <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                />
                <button ref={buttonRef} id="rotateButton" className='imgStyle button' onClick={addTask}><img src={addIcon} alt="" /></button>
            </div>
            <div>
                <button className='sortButton' onClick={() => sortTasks('name')}>Sort by Name</button>
                <button className='sortButton' onClick={() => sortTasks('status')}>Sort by Status</button>
                <button className='sortButton' onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    {sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                </button>
            </div>
            <h2>Active Tasks</h2>
            <ul className="task-list">
                {activeTasks.map(task => (
                    <li key={task.id}>
                        <span
                            onClick={() => toggleTaskCompletion(task.id)}
                            style={{ textDecoration: task.completed ? 'line-through' : 'none', cursor: 'pointer' }}
                        >
                            {task.text}
                        </span>
                        <button className='imgStyle' onClick={() => removeTask(task.id)}><img src={dustBin} alt='' /></button>
                    </li>
                ))}
            </ul>
            <h2>Completed Tasks</h2>
            <ul className="task-list completed" id='com'>
                {completedTasks.map(task => (
                    <li key={task.id}>
                        <span
                            onClick={() => toggleTaskCompletion(task.id)}
                            style={{ textDecoration: task.completed ? 'line-through' : 'none', cursor: 'pointer' }}
                        >
                            {task.text}
                        </span>
                        <button className='imgStyle' onClick={() => removeTask(task.id)}><img src={dustBin} alt='' /></button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoApp;
