import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../../../components/Admin/Footer';
import Navbar from '../../../components/Admin/Navbar';

const GetScores = () => {
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedEventName, setSelectedEventName] = useState('');
  const [facultyCoordinator, setFacultyCoordinator] = useState('');
  const [selectedRound, setSelectedRound] = useState('');
  const [teamScores, setTeamScores] = useState([]);

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
      setTeams(response.data || []); // Ensure teams is an array
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Error fetching teams');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/events');
      setEvents(response.data || []); // Ensure events is an array
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Error fetching events');
    }
  };

  const fetchFacultyCoordinator = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:3001/faculty-coordinator/${eventId}`);
      setFacultyCoordinator(response.data.coordinator || ''); // Ensure faculty coordinator is a string
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
      setTeamScores(scores || []); // Ensure team scores is an array
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
                    <h2>Team Scores for <span className='text-danger text-uppercase text-decoration-underline'>{selectedEventName}</span> -  {selectedRound}</h2>
                    <button onClick={downloadExcel} className="btn btn-success mb-3">Download as Excel</button>
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
                </tr>
              </thead>
              <tbody>
                {teamScores.map((team) => (
                  <tr key={team.team_id}>
                    <td>{team.team_name}</td>
                    <td>{team.score}</td>
                    <td>{team.scoreOutOf50}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='text-center fw-bolder fs-4 mt-4 mb-5'>No scores available for the selected event and round.</div>
        )}
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default GetScores;
