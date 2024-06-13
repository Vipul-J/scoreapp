import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../../../components/Admin/Footer';
import Navbar from '../../../components/Admin/Navbar';
import { faEdit, faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TwoRoundsScores = () => {
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedEventName, setSelectedEventName] = useState('');
  const [facultyCoordinator, setFacultyCoordinator] = useState('');
  const [teamScores, setTeamScores] = useState([]);
  const [editingScoreId, setEditingScoreId] = useState(null);
  const [newScore, setNewScore] = useState('');

  useEffect(() => {
    fetchTeams();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchTeamScores(selectedEvent);
    }
  }, [selectedEvent]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:3001/teams');
      setTeams(response.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Error fetching teams');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/events');
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Error fetching events');
    }
  };

  const fetchFacultyCoordinator = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:3001/faculty-coordinator/${eventId}`);
      setFacultyCoordinator(response.data.coordinator || '');
    } catch (error) {
      console.error('Error fetching faculty coordinator:', error);
      toast.error('Error fetching faculty coordinator');
    }
  };

  const fetchTeamScores = async (eventId) => {
    try {
      const responseRound1 = await axios.get(`http://localhost:3001/team-scores/${eventId}/ROUND 1`);
      const responseRound2 = await axios.get(`http://localhost:3001/team-scores/${eventId}/ROUND 2`);

      const scoresRound1 = responseRound1.data.reduce((acc, team) => {
        acc[team.team_id] = { ...team, round1: team.score };
        return acc;
      }, {});

      const combinedScores = responseRound2.data.reduce((acc, team) => {
        if (acc[team.team_id]) {
          acc[team.team_id].round2 = team.score;
        } else {
          acc[team.team_id] = { ...team, round2: team.score };
        }
        return acc;
      }, scoresRound1);

      const teamScores = Object.values(combinedScores).map(team => ({
        ...team,
        total: team.round1 + team.round2,
        scoreOutOf50: ((team.round1 + team.round2) / 100) * 50
      }));

      setTeamScores(teamScores || []);
      console.log("Team scores:", teamScores); // Add this line to check if team scores are being set correctly

      toast.success('Team scores fetched successfully');
    } catch (error) {
      console.error('Error fetching team scores:', error);
      toast.error('Error fetching team scores');
    }
  };

 // Inside the handleEventChange function
const handleEventChange = (e) => {
  const eventId = e.target.value;
  const eventName = e.target.options[e.target.selectedIndex].text;
  console.log("Selected event:", eventId); // Add this line to check the selected event
  setSelectedEvent(eventId);
  setSelectedEventName(eventName);
  if (eventId) {
    fetchFacultyCoordinator(eventId);
    console.log("Fetching team scores for event:", eventId); // Add this line to check if team scores are being fetched
  } else {
    setFacultyCoordinator('');
  }
};


  const handleEditClick = (teamId, score) => {
    setEditingScoreId(teamId);
    setNewScore(score);
  };

  const handleUpdateScore = async (teamId) => {
    try {
      await axios.put(`http://localhost:3001/updateScore/${selectedEvent}/${teamId}`, { score: newScore });
      toast.success('Score updated successfully');
      fetchTeamScores(selectedEvent);
      setEditingScoreId(null);
      setNewScore('');
    } catch (error) {
      console.error('Error updating score:', error);
      toast.error('Error updating score');
    }
  };

  const handleDeleteScore = async (teamId) => {
    try {
      await axios.delete(`http://localhost:3001/deleteScore/${selectedEvent}/${teamId}`);
      toast.success('Score deleted successfully');
      fetchTeamScores(selectedEvent);
    } catch (error) {
      console.error('Error deleting score:', error);
      toast.error('Error deleting score');
    }
  };

  const downloadExcel = () => {
    if (!selectedEvent) {
      toast.error('Please select an event before downloading.');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      teamScores.map(team => ({
        'Team Name': team.team_name,
        'Round 1 Score': team.round1 || 0,
        'Round 2 Score': team.round2 || 0,
        Total: team.total || 0,
        'Score Out of 50': team.scoreOutOf50 || 0,
      }))
    );
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `TeamScores_Event_${selectedEventName}.xlsx`);
    toast.success('Excel file downloaded successfully');
  };

  return (
    <>
      <Navbar />
      <div className="container">
      <h1 className='text-center mb-2 mt-4'><span className='text-danger'>Cumulative</span> Scores</h1>

        <div className="row mb-3 mt-5">
          <div className="col-lg-4">
            <div className="form-floating">
              <select
                className="form-select"
                value={selectedEvent}
                onChange={handleEventChange}
                id="selectEvent"
              >
                <option value="">Select Event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id} className="fw-bolder">
                    {event.eventName}
                  </option>
                ))}
              </select>
              <label htmlFor="selectEvent">Select Event</label>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Faculty Coordinator"
                value={facultyCoordinator}
                readOnly
                id="facultyCoordinator"
              />
              <label htmlFor="facultyCoordinator">Faculty Coordinator</label>
            </div>
          </div>
        </div>
        {teamScores.length > 0 ? (
          <div>
            <div className=" border-bottom border-1">
              <div className="row">
                <div className="col pt-4 pb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <h2>Team Scores for <span className='text-danger text-uppercase text-decoration-underline'>{selectedEventName}</span></h2>
                    <button onClick={downloadExcel} className="btn btn-success mb-3">Download as Excel</button>
                  </div>
                </div>
              </div>
            </div>
            <table className="table table-striped mt-5 mb-5">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Round 1 Score</th>
                  <th>Round 2 Score</th>
                  <th>Total</th>
                  <th>Score Out of 50</th>
                </tr>
              </thead>
              <tbody>
                {teamScores.map((team) => (
                  <tr key={team.team_id}>
                    <td>{team.team_name}</td>
                    <td>
                      {editingScoreId === team.team_id ? (
                        <input
                          type="number"
                          className="form-control"
                          value={newScore}
                          onChange={(e) => setNewScore(e.target.value)}
                        />
                      ) : (
                        team.round1 || 0
                      )}
                    </td>
                    <td>
                      {editingScoreId === team.team_id ? (
                        <input
                          type="number"
                          className="form-control"
                          value={newScore}
                          onChange={(e) => setNewScore(e.target.value)}
                        />
                      ) : (
                        team.round2 || 0
                      )}
                    </td>
                    <td>{team.total || 0}</td>
                    <td>{team.scoreOutOf50 || 0}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      ) : (
      <p className="mt-5 text-center">No team scores found for the selected event.</p>
             )}
    </div >
           <Footer />
           <ToastContainer />
         </>
       );
     };


export default TwoRoundsScores;
