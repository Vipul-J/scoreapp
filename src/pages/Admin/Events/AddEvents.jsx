import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../../components/Admin/Footer';
import Navbar from '../../../components/Admin/Navbar';

const AddEvents = () => {
  const [eventName, setEventName] = useState('');
  const [facultyCoordinator, setFacultyCoordinator] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!eventName) newErrors.eventName = 'Event name is required';
    if (!facultyCoordinator) newErrors.facultyCoordinator = 'Faculty coordinator is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await axios.post('http://localhost:3001/postEvents', {
          eventName,
          facultyCoordinator
        });
        toast.success('Event added successfully!');
        setEventName('');
        setFacultyCoordinator('');
      } catch (error) {
        console.error('Error adding event:', error);
        toast.error('Failed to add event');
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
                <h3 className="text-center fw-bold mt-3">Add Event</h3>
                <a className='btn btn-dark fw-bold btn-md' href='/admin/getEvents'>Get All Events</a>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-lg mt-5" style={{ width: '24rem', margin: '24px auto' }}>
          <div className="card-body">
            <h5 className="card-title fs-2 text-center mb-3 mt-3">Add Event</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="eventName" className="form-label">Event Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="eventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
                {errors.eventName && <div className="text-danger">{errors.eventName}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="facultyCoordinator" className="form-label">Faculty Coordinator</label>
                <input
                  type="text"
                  className="form-control"
                  id="facultyCoordinator"
                  value={facultyCoordinator}
                  onChange={(e) => setFacultyCoordinator(e.target.value)}
                />
                {errors.facultyCoordinator && <div className="text-danger">{errors.facultyCoordinator}</div>}
              </div>
              <button type="submit" className="btn btn-secondary fw-bolder">Add Event</button>
            </form>
          </div>
          <ToastContainer />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddEvents;
