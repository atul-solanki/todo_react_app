import React from 'react';
import TodoList from './Component/TodoList';
import CustomTodosContext from './Context';

function App() {
  return (
    <CustomTodosContext>
      <TodoList/>
    </CustomTodosContext>
  );
}

export default App;
