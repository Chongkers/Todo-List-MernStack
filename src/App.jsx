import axios from 'axios';
import { useEffect, useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClipboardOutline } from "react-icons/io5";

function App() {

  const [newtodo, setnewtodo] = useState("");
  const [todos, settodos] = useState ([]);
  const [editingtodo, seteditingtodo] = useState(null);
  const [editedtext, seteditedtext] = useState();

  const addtodo = async (e) => {
    e.preventDefault();
    if (!newtodo.trim()) return;
    try {
      const response = await axios.post("/api/todos", {text: newtodo})
      settodos([...todos, response.data])
      setnewtodo('')
    } catch (error) {
      console.log("Error adding todo:", error)
    }
  };

  const fetchtodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      console.log(response.data)
      settodos(response.data)
    } catch (error) {
      console.log("Error fetching todos:", error)
    }
  }

  useEffect (() => {
    fetchtodos();
  }, [])

  const startediting = (todo) => {
    seteditingtodo(todo._id);
    seteditedtext(todo.text);
  };

  const saveedit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedtext
      })
      settodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      seteditingtodo(null);
    } catch (error) {
      console.log("Error updating todo.", error)
    }
  };

  const deletetodo = async (id) => {
    try{
      await axios.delete(`/api/todos/${id}`);
      settodos(todos.filter((todo) => todo._id !== id))
    } catch (error) {
      console.log("Error deleting todo.", error)
    }
  };

  const toggletodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id)
      const response = await axios.patch(`/api/todos/${id}`,{ completed : !todo.completed})
      settodos(todos.map((t) => t._id === id ? response.data : t))
    } catch (error) {
      console.log("Error toggle todo", error)
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-black flex items-center justify-center">
      <div className="bg-gray-950 rounded-md shadow-gray-950 p-15 h-150 w-350 items-center justify-center">
        <div className="justify-center">
          <h1 className="text-5xl font-mono font-bold text-amber-50 text-balance">To-do List</h1>
          <h2 className="text-2xl font-mono font-semibold text-gray-500 text-justify m-1">Cram well, Isaac!</h2>
        </div>
        <form onSubmit={addtodo} className="flex items-center gap-2 shadow-2xl border-gray-600 p-2 px-1 rounded-3xl">
          <button type="submit" className="bg-gray-600 text-amber-50 hover:bg-gray-600 px-6 h-10  rounded-md font-medium cursor-pointer">Add Task</button>
          <input className="flex-1/4 outline-none px-4 py-2 bg-gray-600 text-gray-3 00 placeholder-gray-400 rounded-md"type="text" value={newtodo} onChange={(e) => setnewtodo(e.target.value)} placeholder="Ano ic-cram mo ngayon ?" required>
          </input>
        </form>
        <div className='mt-4'>
          {todos.length === 0 ? (
            <div></div>
          ) : (
            <div className='flex flex-col gap-4'>
              {todos.map((todo) => (
                <div key={todo._id}>
                  {editingtodo === todo._id ? (
                    <div className="flex items-center gap-x-3">
                      <input className="flex-1 p-3 border rounded-lg border-black-200 outline-none focus:ring-2" type="text" value={editedtext} onChange={(e) => seteditedtext(e.target.value)}/>
                      <div className="flex gap-x-2">
                      <button onClick={() => saveedit(todo._id)} className="px-4 py-2 bg-green-300 text-white rounded-lg hover:bg-green-500 cursor-pointer">
                        <MdOutlineDone/>
                      </button>
                      <button className="px-4 py-2 bg-red-300 text-white rounded-lg hover:bg-red-500 cursor-pointer"onClick={()=> seteditingtodo(null)}>
                        <IoClose/>
                        </button>
                        </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-4">
                          <button onClick={() => toggletodo(todo._id)} className={`h-6 w-6 border rounded-full flex items-center justify-center ${todo.completed ? "bg-green-500 border-green-500" : "border-gray-500  hover:border-blue-400"}`}>
                            {todo.completed &&
                            <MdOutlineDone/> }
                          </button>
                        <span className="text-gray-200 font-mono">{todo.text}</span>
                        </div>
                       <div className="flex gap-x-2">
                         <button className="p-2 text-blue-400 hover:to-blue-600" onClick = {() => startediting(todo)}>
                          <MdModeEditOutline></MdModeEditOutline>
                        </button>
                        <button onClick={() => deletetodo(todo._id)} className="p-2 text-red-500 hover:to-red-600 rounded-lg">
                          <FaTrash/>
                        </button>
                       </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
    </div>
  )
}

export default App