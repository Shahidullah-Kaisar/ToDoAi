import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Default styles for the date picker

const TodoItem = ({ task, fetchTasks }) => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);
  const [newAlarmTime, setNewAlarmTime] = useState(task.alarmTime ? new Date(task.alarmTime) : null);

  // Function to format the alarm time
  const formatDate = (dateString) => {
    if (!dateString) return "No alarm set";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Function to play the alarm sound for one minute
  const playAlarmSound = () => {
    const audio = new Audio("/sounds/alarm.wav"); // Path to your sound file
    audio.loop = true; // Loop the sound

    // Play the sound
    audio.play()
      .then(() => {
        console.log("Alarm sound started playing");

        // Show SweetAlert2 notification
        Swal.fire({
          title: "Alarm!",
          text: `It's time for: ${task.text}`,
          icon: "info",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            // Stop the sound if the user clicks "OK"
            audio.pause();
            audio.currentTime = 0; // Reset the audio to the beginning
            console.log("Alarm sound stopped by user");
          }
        });

        // Stop the sound after one minute (60,000 milliseconds)
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0; // Reset the audio to the beginning
          console.log("Alarm sound stopped after one minute");
        }, 60000); // 60,000 milliseconds = 1 minute
      })
      .catch((error) => console.error("Error playing alarm sound:", error));
  };

  // Alarm logic
  useEffect(() => {
    if (!task.alarmTime) return;

    const alarmTime = new Date(task.alarmTime).getTime();
    const now = new Date().getTime();
    const timeUntilAlarm = alarmTime - now;

    console.log("Alarm Time:", new Date(task.alarmTime));
    console.log("Current Time:", new Date(now));
    console.log("Time Until Alarm (ms):", timeUntilAlarm);

    if (timeUntilAlarm > 0) {
      const timeout = setTimeout(() => {
        playAlarmSound(); // Play the alarm sound
      }, timeUntilAlarm);

      return () => clearTimeout(timeout); // Cleanup on unmount
    }
  }, [task.alarmTime, task.text]);

  const toggleComplete = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/update-task/${task._id}`, {
        completed: !task.completed,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
    setLoading(false);
  };

  const deleteTask = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/delete-task/${task._id}`);
        fetchTasks();
        Swal.fire({
          title: "Deleted!",
          text: "Your task has been deleted.",
          icon: "success",
        });
      } catch (error) {
        console.error("Error deleting task:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the task. Please try again.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const updateTask = async () => {
    if (!newText.trim()) return;

    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/update-task/${task._id}`, {
        text: newText,
        alarmTime: newAlarmTime || null,
      });
      fetchTasks();
      setIsEditing(false);
      Swal.fire({
        title: "Edit Done!",
        icon: "success",
        draggable: true,
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
    setLoading(false);
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between p-4 mb-4 bg-gray-700 rounded-lg shadow-md ${
        task.completed ? "line-through text-gray-400" : "text-white"
      } ${loading ? "opacity-50" : ""}`}
    >
      {/* Task Text or Edit Input */}
      {isEditing ? (
        <div className="flex flex-col w-full space-y-4">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="w-full p-2 border border-gray-500 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-purple-500"
            placeholder="Edit task"
          />
          {/* Custom Date and Time Picker */}
          <div className="flex flex-col space-y-2">
            <p className="text-white">Set Alarm Time</p>
            <DatePicker
              selected={newAlarmTime}
              onChange={(date) => setNewAlarmTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full p-2 border border-gray-500 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-purple-500"
              placeholderText="Select date and time"
            />
          </div>
          {/* Save and Cancel Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={updateTask}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full sm:w-auto">
          <span
            onClick={toggleComplete}
            className="cursor-pointer text-lg sm:text-base w-full sm:w-auto text-center sm:text-left"
          >
            {task.text}
          </span>
          {/* Display the task creation time and alarm time */}
          <p className="text-sm text-gray-400 mt-1">
            Added on: {formatDate(task.createdAt)}
          </p>
          <p className="text-sm text-red-500 mt-1">
            Alarm: {formatDate(task.alarmTime)}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {!isEditing && (
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-400 hover:text-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={deleteTask}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;