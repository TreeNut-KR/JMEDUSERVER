import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserPermissions() {
  const [teachers, setTeachers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newAdminLevel, setNewAdminLevel] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/server/user_permissions`);
        if (response.data.success) {
          setTeachers(response.data.teachers);
        } else {
          console.error('Failed to fetch data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (index, currentAdminLevel) => {
    setEditingIndex(index);
    setNewAdminLevel(currentAdminLevel);
  };

  const handleSaveClick = async (teacherPk) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/server/user_permissions`, {
        teacher_pk: teacherPk,
        admin_level: newAdminLevel,
      });
      if (response.data.success) {
        setTeachers((prevTeachers) => 
          prevTeachers.map((teacher, index) => 
            index === editingIndex ? { ...teacher, admin_level: newAdminLevel } : teacher
          )
        );
        setEditingIndex(null);
        setNewAdminLevel("");
      } else {
        console.error('Failed to save data:', response.data.message);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div>
      <p>여기에 편집 페이지 내용을 추가하세요.</p>
      <table>
        <thead>
          <tr>
            <th>Teacher Name</th>
            <th>Admin Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.length > 0 ? (
            teachers.map((teacher, index) => (
              <tr key={index}>
                <td>{teacher.name}</td>
                <td>
                  {editingIndex === index ? (
                    <input 
                      type="text" 
                      value={newAdminLevel} 
                      onChange={(e) => setNewAdminLevel(e.target.value)} 
                    />
                  ) : (
                    teacher.admin_level
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <button onClick={() => handleSaveClick(teacher.teacher_pk)}>Save</button>
                  ) : (
                    <button onClick={() => handleEditClick(index, teacher.admin_level)}>Edit</button>
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
