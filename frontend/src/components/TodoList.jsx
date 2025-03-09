import { useState, useEffect } from "react";
import axios from "axios";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";


const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date()); // State for current time

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get-tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  // Update the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Format the time to display in HH:MM:SS format
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Use 12-hour format (AM/PM)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-4xl font-bold text-center text-white mb-8">
      My To-Do List
    </h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Side: Todo Form and Real-Time Clock */}
      <div className="col-span-1 lg:col-span-1 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 h-[400px] overflow-auto">
        {/* Real-Time Clock */}
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-purple-400 mt-2">
            {formatTime(currentTime)}
          </p>
        </div>

        {/* Todo Form */}
        <h2 className="text-2xl font-semibold text-white mb-6">
          Add New Task
        </h2>
        <TodoForm fetchTasks={fetchTasks} />
      </div>

      {/* Right Side: Task List */}
      <div className="col-span-1 lg:col-span-2 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Your Tasks
        </h2>
        <ul className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TodoItem key={task._id} task={task} fetchTasks={fetchTasks} />
            ))
          ) : (
            <p className="text-gray-400 text-center py-6">
              No tasks yet. Add one to get started!
            </p>
          )}
        </ul>
      </div>
    </div>
  </div>
</div>
  );
};

export default TodoList;