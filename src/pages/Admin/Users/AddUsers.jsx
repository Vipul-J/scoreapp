import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../../components/Admin/Footer';
import Navbar from '../../../components/Admin/Navbar';

const AddUsers = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await axios.post('http://localhost:3001/register', {
          username,
          password
        });
        toast.success('Registered successfully!');
        setUsername('');
        setPassword('');
      } catch (error) {
        console.error('Error registering:', error);
        toast.error('Failed to register');
      }
    }
  };

  return (
    <>
    <Navbar />
      <div className='container'>
        <div className="border-bottom border-1">
          <div className="row">
            <div className="col pt-4 pb-2">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="text-center fw-bold mt-3">Add Users</h3>
                {/* Add a link to redirect to login */}
                <a className='btn btn-dark fw-bold btn-md' href='/admin/getUsers'>Get All Users</a>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-lg mt-5 mb-5" style={{ width: '24rem', margin: '24px auto' }}>
          <div className="card-body">
            <h5 className="card-title fs-2 text-center mb-3 mt-3">Register</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <div className="text-danger">{errors.username}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className="text-danger">{errors.password}</div>}
              </div>
              <button type="submit" className="btn btn-secondary fw-bolder">Register</button>
            </form>
          </div>
          <ToastContainer />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddUsers;
