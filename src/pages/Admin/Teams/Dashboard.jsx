import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarAlt, faClipboardList, faUserCog } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../../components/Admin/Footer';
import Navbar from '../../../components/Admin/Navbar';

const Dashboard = () => {
  return (
    <>
    <Navbar />
        <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faUsers} className="fs-1 mb-3" />
              <h5 className="card-title mb-3">Manage Teams</h5>
              <a href='/admin/getTeams' className="btn btn-secondary">Manage</a>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="fs-1 mb-3" />
              <h5 className="card-title mb-3">Manage Events</h5>
              <a href='/admin/getEvents' className="btn btn-secondary">Manage</a>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faClipboardList} className="fs-1 mb-3" />
              <h5 className="card-title mb-3">Manage Scores</h5>
              <a href='/admin/getScores' className="btn btn-secondary">Manage</a>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faUserCog} className="fs-1 mb-3" />
              <h5 className="card-title mb-3">Manage Accounts</h5>
              <a href='/admin/getUsers' className="btn btn-secondary">Manage</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>

  );
};

export default Dashboard;
