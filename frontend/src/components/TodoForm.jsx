import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Default styles for the date picker

const TodoForm = ({ fetchTasks }) => {
  const [text, setText] = useState("");
  const [showAlarmPicker, setShowAlarmPicker] = useState(false); // Toggle for alarm picker
  const [alarmTime, setAlarmTime] = useState(null); // State for alarm time

  const addTask = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post("http://localhost:5000/add-task", {
        text,
        alarmTime: alarmTime || null, // Send alarm time to the backend
      });
      setText("");
      setAlarmTime(null); // Reset alarm time input
      setShowAlarmPicker(false); // Hide the alarm picker
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <form onSubmit={addTask} className="space-y-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a new task"
        className="w-full p-2 border border-gray-500 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-purple-500"
      />
      {/* Toggle for alarm */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setShowAlarmPicker(!showAlarmPicker)}
          className="bg-purple-900 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          {showAlarmPicker ? "Cancel Alarm" : "Set with Alarm"}
        </button>
      </div>
      {/* Custom alarm picker (conditionally rendered) */}
      {showAlarmPicker && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg shadow-md">
          <p className="text-white mb-2">Select Date and Time</p>
          <DatePicker
            selected={alarmTime}
            onChange={(date) => setAlarmTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full p-2 border border-gray-500 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-purple-500"
            placeholderText="Select date and time"
          />
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg mt-10 hover:bg-purple-900 transition-colors"
      >
        Add Task
      </button>
    </form>
  );
};

export default TodoForm;