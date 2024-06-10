// AddTeam.js
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../../components/Admin/Footer';
import Navbar from '../../../components/Admin/Navbar';

const AddTeam = () => {
  const [teamName, setTeamName] = useState('');
  const [errors, setErrors] = useState('');

  const validate = () => {
    if (!teamName) {
      setErrors('Team name is required');
      return false;
    }
    setErrors('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await axios.post('http://localhost:3001/postTeam', { name: teamName });
        toast.success('Team added successfully!');
        setTeamName('');
      } catch (error) {
        console.error('Error adding team:', error);

        toast.error('Failed to add team');
      }
    }
  };

  return (
    <>
    <Navbar />
    <div className='container'>
    <div className=" border-bottom border-1">
          <div className="row">
            <div className="col pt-4 pb-2">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="text-center fw-bold mt-3">Add Team</h3>
                <a className='btn btn-dark fw-bold btn-md' href='/admin/getTeams'>Get All Teams</a>
              </div>
            </div>
          </div>
        </div>

    <div className="card shadow-lg mt-5" style={{ width: '24rem', margin: '24px auto' }}>
      <div className="card-body">
        <h5 className="card-title fs-2 text-center mb-3 mt-3">Add Team</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="teamName" className="form-label">Team Name</label>
            <input
              type="text"
              className="form-control"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            {errors && <div className="text-danger">{errors}</div>}
          </div>
          <button type="submit" className="btn btn-secondary fw-bolder">Add Team</button>
        </form>
      </div>
      <ToastContainer />
    </div>
    </div>
    <Footer />
    </>
  );
};

export default AddTeam;
