// src/components/ScoreReport.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../../components/Admin/Navbar';
import Footer from '../../../components/Admin/Footer';
import * as XLSX from 'xlsx'; // Import xlsx library

const ScoreReport = () => {
    const [eventScores, setEventScores] = useState([]);

    useEffect(() => {
        fetchEventScores();
    }, []);

    const fetchEventScores = async () => {
        try {
            const response = await axios.get('http://localhost:3001/event-scores');
            setEventScores(response.data);
        } catch (error) {
            console.error('Error fetching event scores:', error);
        }
    };

    const renderEventScores = () => {
        // Create an object to group scores by event name
        const groupedScores = {};

        // Group event scores by event name
        eventScores.forEach(eventScore => {
            const { eventName, team_name, round1_score, round2_score, round3_score } = eventScore;

            if (!groupedScores[eventName]) {
                groupedScores[eventName] = [];
            }

            groupedScores[eventName].push({
                team_name,
                round1_score,
                round2_score,
                round3_score,
                total_score: parseInt(round1_score) + parseInt(round2_score) + parseInt(round3_score)
            });
        });

        // Render rows based on grouped scores
        const renderedRows = [];

        for (const eventName in groupedScores) {
            if (groupedScores.hasOwnProperty(eventName)) {
                const scores = groupedScores[eventName];
                let rowspanCount = scores.length;

                scores.forEach((score, index) => {
                    renderedRows.push(
                        <tr key={`${eventName}-${index}`}>
                            {index === 0 && (
                                <td rowSpan={rowspanCount}>{eventName}</td>
                            )}
                            <td>{score.team_name}</td>
                            <td>{score.round1_score}</td>
                            <td>{score.round2_score}</td>
                            <td>{score.round3_score}</td>
                            <td>{score.total_score}</td>
                        </tr>
                    );
                });
            }
        }

        return renderedRows;
    };

    const downloadExcel = () => {
      const data = eventScores.map(eventScore => ({
          'Event Name': eventScore.eventName,
          'Team Name': eventScore.team_name,
          'ROUND 1': eventScore.round1_score,
          'ROUND 2': eventScore.round2_score,
          'ROUND 3': eventScore.round3_score,
          'Total': eventScore.total_score
      }));
  
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Event Scores');
      XLSX.writeFile(wb, 'event_scoresreport.xlsx');
  };
  

    return (
        <>
            <Navbar />
            <div className='container'>
            <div className=" border-bottom border-1">
              <div className="row">
                <div className="col pt-4 pb-2">
                  <div className="d-flex justify-content-between align-items-center">
                  <h2 className='text-center mt-5'>Overall Event Scores Report</h2>                
                  <button className="btn btn-success fw-bold" onClick={downloadExcel}>Download as Excel</button>
                  </div>
                </div>
              </div>
            </div>
              

                <table className="table table-striped mt-5 mb-5">
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Team Name</th>
                            <th>ROUND 1</th>
                            <th>ROUND 2</th>
                            <th>ROUND 3</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderEventScores()}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    );
};

export default ScoreReport;
