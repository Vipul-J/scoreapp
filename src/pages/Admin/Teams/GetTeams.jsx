import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../../components/Admin/Footer';
import Navbar from '../../../components/Admin/Navbar';

const GetTeams = () => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [editTeamId, setEditTeamId] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:3001/teams');
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleUpdate = async (id) => {
    const confirmed = window.confirm('Are you sure you want to update this team?');
    if (confirmed) {
      try {
        await axios.put(`http://localhost:3001/updateTeam/${id}`, { name: newTeamName });
        setNewTeamName('');
        setEditTeamId(null);
        fetchTeams();
      } catch (error) {
        console.error('Error updating team:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this team?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:3001/deleteTeam/${id}`);
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const handleView = (id) => {
    // Implement view logic here
    console.log(`View details for team id: ${id}`);
  };

  return (
<>
<Navbar />
<div className="container">
      <div className=" border-bottom border-1">
          <div className="row">
            <div className="col pt-4 pb-2">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="text-center fw-bold mt-3">All Teams</h3>
                <a className='btn btn-dark fw-bold btn-md' href='/admin/postTeams'>Add New Teams</a>
              </div>
            </div>
          </div>
        </div>
       <table className='table table-striped mt-5 mb-5'>
        <thead>
          <tr>
            <th>Sl</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody >
          {teams.map((team, index) => (
            <tr key={team.id}>
              <td>{index + 1}</td>
              <td>
                {editTeamId === team.id ? (
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                ) : (
                  team.name
                )}
              </td>
              <td>
                {editTeamId === team.id ? (
                  <>
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleUpdate(team.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditTeamId(null);
                        setNewTeamName('');
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                   <a
                      className='me-3 text-primary'
                      href='#'
                      onClick={() => handleView(team.id)}
                    >
                      <FontAwesomeIcon icon={faEye} size='lg' />
                    </a>
                    <a
                      className='me-3 text-primary'
                      href='#'
                      onClick={() => {
                        setEditTeamId(team.id);
                        setNewTeamName(team.name);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} size='lg' />
                    </a>
                    <a
                      className='me-3 text-danger'
                      href='#'
                      onClick={() => handleDelete(team.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} size='lg' />
                    </a>
                   
                  </>
                )}
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

export default GetTeams;
