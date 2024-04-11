import { createContext, createRef, useContext, useState } from "react"
import { toast } from 'react-toastify';


const TodosContext=createContext();
let uniqueId = 4;

export const useTodosContextValue=()=> useContext(TodosContext);

const CustomTodosContext=({children})=>{
      // State variables
  const [tasks, setTasks] = useState([]);  // Holds the list of tasks
  const [filter, setFilter] = useState('all'); // Holds the current filter type
//   const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
  const [editTaskId, setEditTaskId] = useState(null);  // Holds the ID of the task being edited
    // Ref variable hold the input value
  const inputRef= createRef();

  // Add a new task
   const handleAddTask = async () => {
      try {
        const inputValue= inputRef.current.value;
  
        if (inputValue.trim() === '') {
          return;
        }
  
        const newTask = {
          title: inputValue,
          completed: false
        };
  
        // Send a POST request to the API endpoint with the new task data
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
          method: 'POST',
          body: JSON.stringify(newTask), // Convert the new task object to JSON
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        const addedTask = await response.json();
        addedTask.id = ++uniqueId;
        setTasks((prevTasks) => [...prevTasks, addedTask]);
        inputRef.current.value = "";
        toast.success('Task added successfully');
      } 
      catch (error) {
        // Log the error to the console
        console.log('Error adding task:', error);
        // Display an error toast notification
        toast.error('Error adding task');
      }
  };
  
  // Update a task
   const handleUpdateTask = async () => {
    
      try {
        const inputValue = inputRef.current.value;
        if (inputValue.trim() === '') {
          return;
        }
  
        const updatedTask = {
          title: inputValue
        };
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${editTaskId}`, {
          method: 'PUT',
          body: JSON.stringify(updatedTask),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        const updatedTaskData = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editTaskId ? { ...task, title: updatedTaskData.title } : task
          )
        );
        inputRef.current.value = "";
        setEditTaskId(null);
        toast.success('Task updated successfully');
      } catch (error) {
        console.log('Error updating task:', error);
        toast.error('Error updating task');
      }
    };
  
  // Handle checkbox change for a task
   const handleTaskCheckboxChange = (taskId) => {
  setTasks((prevTasks) =>
      prevTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
      )
  );
  };
  
  // Delete a task
   const handleDeleteTask = (taskId) => {
  setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  toast.success('Task deleted successfully');
  };
  
  // Edit a task
   const handleEditTask = (taskId) => {
  setEditTaskId(taskId);
  const taskToEdit = tasks.find((task) => task.id === taskId);
  inputRef.current.value= taskToEdit.title;
  };
  
  // Mark all tasks as completed
   const handleCompleteAll = () => {
  setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: true }))
  );
  };
  
  // Clear completed tasks
   const handleClearCompleted = () => {
  setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };
  
  // Handle filter change
   const handleFilterChange = (filterType) => {
  setFilter(filterType);
  };

    // Filter tasks based on the selected filter
    const filteredTasks = tasks.filter((task) => {
        if (filter === 'all') {
            return true;
        } else if (filter === 'completed') {
            return task.completed;
        } else if (filter === 'uncompleted') {
            return !task.completed;
        }
        return true;
    });

    return (
      <TodosContext.Provider
        value={{
          tasks,
          setTasks,
          filter,
          setFilter,
          editTaskId, 
          setEditTaskId,
          inputRef,
          handleAddTask,
          handleUpdateTask,
          handleTaskCheckboxChange,
          handleDeleteTask,
          handleEditTask,
          handleCompleteAll,
          handleClearCompleted,
          handleFilterChange,
          filteredTasks
        }}
      >
        {children}
    </TodosContext.Provider>
    )
}
 export default CustomTodosContext;