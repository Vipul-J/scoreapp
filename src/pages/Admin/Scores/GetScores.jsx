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

const GetScores = () => {
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedEventName, setSelectedEventName] = useState('');
  const [facultyCoordinator, setFacultyCoordinator] = useState('');
  const [selectedRound, setSelectedRound] = useState('');
  const [teamScores, setTeamScores] = useState([]);
  const [editingScoreId, setEditingScoreId] = useState(null);
  const [newScore, setNewScore] = useState('');

  useEffect(() => {
    fetchTeams();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent && selectedRound) {
      fetchTeamScores(selectedEvent, selectedRound);
    }
  }, [selectedEvent, selectedRound]);

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

  const fetchTeamScores = async (eventId, round) => {
    try {
      const response = await axios.get(`http://localhost:3001/team-scores/${eventId}/${round}`);
      const scores = response.data.map(team => ({
        ...team,
        scoreOutOf50: (team.score / 100) * 50
      }));
      setTeamScores(scores || []);
      toast.success('Team scores fetched successfully');
    } catch (error) {
      console.error('Error fetching team scores:', error);
      toast.error('Error fetching team scores');
    }
  };

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    const eventName = e.target.options[e.target.selectedIndex].text;
    setSelectedEvent(eventId);
    setSelectedEventName(eventName);
    if (eventId) {
      fetchFacultyCoordinator(eventId);
    } else {
      setFacultyCoordinator('');
    }
  };

  const handleRoundChange = (e) => {
    const round = e.target.value;
    setSelectedRound(round);
  };

  const handleEditClick = (teamId, score) => {
    setEditingScoreId(teamId);
    setNewScore(score);
  };

  const handleUpdateScore = async (teamId) => {
    try {
      await axios.put(`http://localhost:3001/updateScore/${selectedEvent}/${selectedRound}/${teamId}`, { score: newScore });
      toast.success('Score updated successfully');
      fetchTeamScores(selectedEvent, selectedRound);
      setEditingScoreId(null);
      setNewScore('');
    } catch (error) {
      console.error('Error updating score:', error);
      toast.error('Error updating score');
    }
  };

  const handleDeleteScore = async (teamId) => {
    try {
      await axios.delete(`http://localhost:3001/deleteScore/${selectedEvent}/${selectedRound}/${teamId}`);
      toast.success('Score deleted successfully');
      fetchTeamScores(selectedEvent, selectedRound);
    } catch (error) {
      console.error('Error deleting score:', error);
      toast.error('Error deleting score');
    }
  };

  const downloadExcel = () => {
    if (!selectedEvent || !selectedRound) {
      toast.error('Please select an event and a round before downloading.');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      teamScores.map(team => ({
        'Team Name': team.team_name,
        Score: team.score,
        'Score Out of 50': team.scoreOutOf50,
      }))
    );
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `TeamScores_Event_${selectedEventName}_Round_${selectedRound}.xlsx`);
    toast.success('Excel file downloaded successfully');
  };

  return (
    <>
      <Navbar />
      <div className="container">
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
          <div className="col-lg-4">
            <div className="form-floating">
              <select
                className="form-select"
                value={selectedRound}
                onChange={handleRoundChange}
                id="selectRound"
              >
                <option value="">Select Round</option>
                <option value="ROUND 1">ROUND 1</option>
                <option value="ROUND 2">ROUND 2</option>
                <option value="ROUND 3">ROUND 3</option>
              </select>
              <label htmlFor="selectRound">Select Round</label>
            </div>
          </div>
        </div>
        {teamScores.length > 0 ? (
          <div>
            <div className=" border-bottom border-1">
              <div className="row">
                <div className="col pt-4 pb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <h2>Team Scores for <span className='text-danger text-uppercase text-decoration-underline'>{selectedEventName}</span> - {selectedRound}</h2>
                    <button onClick={downloadExcel} className="btn btn-success mb-3">Download as Excel</button>
                    <a href='/admin/cumScores' className="btn btn-secondary mb-3">Cumulative Scores</a>

                  </div>
                </div>
              </div>
            </div>
            <table className="table table-striped mt-5 mb-5">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Score</th>
                  <th>Score Out of 50</th>
                  <th>Actions</th>
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
                        team.score
                      )}
                    </td>
                    <td>{team.scoreOutOf50}</td>
                    <td>
                      {editingScoreId === team.team_id ? (
                        <>
                          <button className="btn btn-success me-2" onClick={() => handleUpdateScore(team.team_id)}><FontAwesomeIcon icon={faSave} size='lg' /></button>
                          <button className="btn btn-secondary" onClick={() => setEditingScoreId(null)}><FontAwesomeIcon icon={faTimes} size='lg' /></button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-warning me-2" onClick={() => handleEditClick(team.team_id, team.score)}><FontAwesomeIcon icon={faEdit} size='lg' /></button>
                          <button className="btn btn-danger" onClick={() => handleDeleteScore(team.team_id)}><FontAwesomeIcon icon={faTrash} size='lg' /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-5 text-center">No team scores found for the selected event and round.</p>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default GetScores;