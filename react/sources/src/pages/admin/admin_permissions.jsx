import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPermissions() {
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newLevel, setNewLevel] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/server/admin_permissions`);
        if (response.data.success) {
          setTasks(response.data.teachers);
        } else {
          console.error('Failed to fetch data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (index, currentLevel) => {
    setEditingIndex(index);
    setNewLevel(currentLevel);
  };

  const handleSaveClick = async (taskName) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/server/admin_permissions`, {
        task_name: taskName,
        level: newLevel,
      });
      if (response.data.success) {
        setTasks((prevTasks) => 
          prevTasks.map((task, index) => 
            index === editingIndex ? { ...task, level: newLevel } : task
          )
        );
        setEditingIndex(null);
        setNewLevel("");
      } else {
        console.error('Failed to save data:', response.data.message);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div>
      <p>작업별 요구 권한 레벨을 설정하세요.</p>
      <table>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.task_name}</td>
                <td>
                  {editingIndex === index ? (
                    <input 
                      type="text" 
                      value={newLevel} 
                      onChange={(e) => setNewLevel(e.target.value)} 
                    />
                  ) : (
                    task.level
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <button onClick={() => handleSaveClick(task.task_name)}>Save</button>
                  ) : (
                    <button onClick={() => handleEditClick(index, task.level)}>Edit</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
