import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../../components/Admin/Footer';
import Navbar from '../../../components/Admin/Navbar';

const GetEvents = () => {
    const [Events, setEvents] = useState([]);
    const [newEventName, setNewEventName] = useState('');
    const [editEventId, setEditEventId] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:3001/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching Events:', error);
        }
    };
 

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this Event?');
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:3001/deleteEvent/${id}`);
                fetchEvents();
            } catch (error) {
                console.error('Error deleting Event:', error);
            }
        }
    };
 

    return (
       <>
       <Navbar />
        <div className="container">
            <div className=" border-bottom border-1">
                <div className="row">
                    <div className="col pt-4 pb-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <h3 className="text-center fw-bold mt-3">All Events</h3>
                            <a className='btn btn-dark fw-bold btn-md' href='/admin/postEvents'>Add New Events</a>
                        </div>
                    </div>
                </div>
            </div>
            <table className='table table-striped mt-5 mb-5'>
                <thead>
                    <tr>
                        <th>Sl</th>
                        <th>Event Name</th>
                        <th>Faculty Coordinators</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Events.map((Event, index) => (
                        <tr key={Event.id}>
                            <td>{index + 1}</td>
                            <td>{Event.eventName}</td>
                            <td>{Event.facultyCoordinator}</td> {/* Display faculty coordinator */}
                            <td>
                                
                                        <a
                                            className='me-3 text-danger'
                                            href='#'
                                            onClick={() => handleDelete(Event.id)}
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

export default GetEvents;
