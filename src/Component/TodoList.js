import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import todoImage from "../image/todo.png"
import { FaCheckDouble } from "react-icons/fa6";
import { LuListTodo } from "react-icons/lu";
import GridLoader from 'react-spinners/GridLoader';
import { useTodosContextValue } from '../Context';
import ToDoTask from './TodoTask';

const TodoList = () => {
  // State variables
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
  // get todosContextValue
  const {
    tasks,
    setTasks,
    editTaskId,
    inputRef,
    handleAddTask,
    handleUpdateTask,
    handleCompleteAll,
    handleClearCompleted,
    handleFilterChange,
    filteredTasks}=useTodosContextValue();

  // Fetch initial data
  useEffect(() => {
    // Fetch todos from an API
    const fetchTodos = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=4');
        const todos = await response.json();
        setTasks(todos);
        setIsLoading(false);
      } catch (error) {
        console.log('Error fetching todos:', error);
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [setTasks]);

  // Display loading message while data is being fetched
  if (isLoading) {
    return <div className="spinner">
    <GridLoader
      color="#176ae6"
      loading={isLoading}
      size={60}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  </div>;
  }

  // Render the todo list
  return (
    <div className="container">
      <ToastContainer />
      <div className="todo-app">
        <h2>
          <img src={todoImage} alt="todoImage" /> Todo List
        </h2>
        <div className="row">
          <LuListTodo />
          <input
            type="text"
            className="add-task"
            id="add"
            placeholder="Add your todo"
            autoFocus
            ref={inputRef}
          />
          <button id="btn" 
            onClick={()=>{editTaskId ? 
              handleUpdateTask() : 
              handleAddTask() }} >
            {editTaskId ? 'Update' : 'Add'}
          </button>
        </div>

        <div className="mid">
          <FaCheckDouble />
          <p id="complete-all" 
            onClick={()=>handleCompleteAll()}>
            Complete all tasks
          </p>
          <p id="clear-all" 
            onClick={()=>handleClearCompleted()}>
            Delete comp tasks
          </p>
        </div>
        {/* todos list */}
        <ul id="list">
          {filteredTasks.map((task) => (
            <ToDoTask task={task} />
          ))}
        </ul>

        <div className="filters">
          <div className="dropdown">
            <button className="dropbtn">Filter</button>
            <div className="dropdown-content">
              < div id="all" 
                onClick={() => handleFilterChange('all')}>
                All
              </div>
              < div id="rem" 
                onClick={() => handleFilterChange('uncompleted')}>
                Uncompleted
              </div>
              < div id="com" 
                onClick={() => handleFilterChange('completed')}>
                Completed
              </div>
            </div>
          </div>

          <div className="completed-task">
            <p>
              Completed: 
              <span id="c-count">{tasks.filter((task) => task.completed).length}</span>
            </p>
          </div>
          <div className="remaining-task">
            <p>
              <span id="total-tasks">
                Total Tasks: 
                <span id="tasks-counter">{tasks.length}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
