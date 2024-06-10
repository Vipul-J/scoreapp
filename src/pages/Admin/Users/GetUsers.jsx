import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../../components/Admin/Footer';
import Navbar from '../../../components/Admin/Navbar';

const GetUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      console.log(response.data); // Log the response data
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  

  const handleUpdate = async (id) => {
    const confirmed = window.confirm('Are you sure you want to update this user?');
    if (confirmed) {
      try {
        await axios.put(`http://localhost:3001/updateUser/${id}`, { 
          username: newUserName,
          password: newPassword 
        });
        setNewUserName('');
        setNewPassword('');
        setEditUserId(null);
        fetchUsers();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:3001/deleteUser/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleView = (id) => {
    // Implement view logic here
    console.log(`View details for user id: ${id}`);
  };

  return (
   <>
   <Navbar />
    <div className="container">
      <div className=" border-bottom border-1">
        <div className="row">
          <div className="col pt-4 pb-2">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="text-center fw-bold mt-3">All Users</h3>
              <a className='btn btn-dark fw-bold btn-md' href='/admin/postUsers'>Add New Users</a>
            </div>
          </div>
        </div>
      </div>
      <table className='table table-striped mt-5 mb-5'>
        <thead>
          <tr>
            <th>Sl</th>
            <th>Username</th>
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>
                {editUserId === user.id ? (
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>
                {editUserId === user.id ? (
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                ) : (
                  user.password
                )}
              </td>
              <td>
                    <a
                      className='me-3 text-danger'
                      href='#'
                      onClick={() => handleDelete(user.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} size='lg' />
                    </a>
                  
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Footer />
   </>
  );
};

export default GetUsers;
