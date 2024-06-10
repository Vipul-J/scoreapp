import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../../components/Scorer/Footer';
import Navbar from '../../components/Scorer/Navbar';

const Scoring = () => {
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [facultyCoordinator, setFacultyCoordinator] = useState('');
  const [selectedRound, setSelectedRound] = useState('');
  const [scoresSubmitted, setScoresSubmitted] = useState(false);

  useEffect(() => {
    fetchTeams();
    fetchEvents();
  }, []);

  useEffect(() => {
    setScoresSubmitted(false); // Reset scoresSubmitted whenever selectedEvent or selectedRound changes
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
      console.log('Fetched events:', response.data);
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Error fetching events');
    }
  };

  const fetchFacultyCoordinator = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:3001/faculty-coordinator/${eventId}`);
      console.log('Fetched faculty coordinator:', response.data);
      setFacultyCoordinator(response.data.coordinator || '');
    } catch (error) {
      console.error('Error fetching faculty coordinator:', error);
      toast.error('Error fetching faculty coordinator');
    }
  };

  const calculateOutOfFiftyScore = (teamScore) => {
    return Math.round((teamScore / 100) * 50);
  };

  const handleScoreChange = (event, teamId) => {
    const updatedTeams = teams.map((team) => {
      if (team.id === teamId) {
        return { ...team, score: parseInt(event.target.value) };
      }
      return team;
    });
    setTeams(updatedTeams);
  };

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);
    if (eventId) {
      fetchFacultyCoordinator(eventId);
    } else {
      setFacultyCoordinator('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !selectedRound) {
      toast.error('Please select an event and a round.');
      return;
    }
    if (teams.some((team) => !team.score)) {
      toast.error('Please enter scores for all teams.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/score', {
        eventId: selectedEvent,
        selectedRound,
        teams: teams.map(({ id, score }) => ({ id, score })),
      });
      console.log('Score submitted successfully:', response.data);
      toast.success('Scores submitted successfully');
      setScoresSubmitted(true);
      // If needed, you can reset the teams' scores here
    } catch (error) {
      console.error('Error submitting score:', error);
      toast.error('Error submitting score, maybe already recorded. Kindly report to ADMIN');
    }
  };

  if (!teams.length || !events.length) {
    return <div>Loading...</div>;
  }

  return (
<>
<Navbar />
<div className="container mt-5">
      <div className="row mb-3">
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
              onChange={(e) => setSelectedRound(e.target.value)}
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
      <h2>Team Scores</h2>
      {scoresSubmitted ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Team Score</th>
              <th>Out of 50 Score</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td>{team.name}</td>
                <td>{team.score}</td>
                <td>{calculateOutOfFiftyScore(team.score)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <form onSubmit={handleSubmit}>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Team Score</th>
                <th>Out of 50 Score</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td>{team.name}</td>
                  <td>
                    <input
                      type="number"
                      value={team.score || 0}
                      onChange={(e) => handleScoreChange(e, team.id)}
                      disabled={scoresSubmitted} // Disable input if scores are already submitted
                    />
                  </td>
                  <td>{calculateOutOfFiftyScore(team.score || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='d-flex justify-content-center align-items-center mb-5'>
          <button type="submit" className="btn btn-success fw-bolder" disabled={scoresSubmitted}>
            Submit Scores
          </button>
          </div>
        </form>
      )}
      <ToastContainer />
    </div>
<Footer />
</>
  );
};

export default Scoring;
