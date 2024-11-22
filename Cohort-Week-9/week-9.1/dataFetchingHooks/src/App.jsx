import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

function useTodos(n) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const value = setInterval(() => {
      axios.get("http://localhost:3000/todos")
      .then(res => {
        setTodos(res.data.todos);
        setLoading(false);
      })
    }, n * 1000);

    axios.get("http://localhost:3000/todos")
      .then(res => {
        setTodos(res.data.todos);
        setLoading(false);
      })

      return () => {
        clearInterval(value)
      }
  }, [n])

  return {todos, loading};
}

function App() {
  const {todos, loading} = useTodos(5);

  if(loading) {
    return <div> loading... </div>
  }

  return (
    <>
      {todos.map(todo => <Track todo={todo} />)}
    </>
  )
}

function Track({ todo }) {
  return <div>
    {todo.title}
    <br />
    {todo.description}
  </div>
}

export default App
