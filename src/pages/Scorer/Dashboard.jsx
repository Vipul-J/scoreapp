import React,{useState} from 'react';
import Login  from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faPaintBrush, faLaptopCode, faComments, faGamepad } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../components/Scorer/Footer';
import Navbar from '../../components/Scorer/Navbar';

const Dashboard = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
    window.location.href = 'http://localhost:3000/scorer/postScores'; // or '/scorer/getScores'
  };

  return (
  <>
  <Navbar />
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card p-3">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faCode} className="fs-1 mb-3"  />
              <h5 className="card-title mb-3">Coding</h5>
              <button className="btn btn-secondary me-2" onClick={() => setShowLogin(true)}>Mark Scores</button>
             </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card p-3">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faPaintBrush} className="fs-1 mb-3" />
              <h5 className="card-title mb-3">Designing</h5>
              <button className="btn btn-secondary me-2" onClick={() => setShowLogin(true)}>Mark Scores</button>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card p-3">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faLaptopCode} className="fs-1 mb-3" />
              <h5 className="card-title mb-3">Hackathon</h5>
              <button className="btn btn-secondary me-2" onClick={() => setShowLogin(true)}>Mark Scores</button>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card p-3">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faComments} className="fs-1 mb-3" />
              <h5 className="card-title mb-3">Communication</h5>
              <button className="btn btn-secondary me-2" onClick={() => setShowLogin(true)}>Mark Scores</button>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card p-3">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faGamepad} className="fs-1 mb-3"  />
              <h5 className="card-title mb-3">Gaming</h5>
              <button className="btn btn-secondary me-2" onClick={() => setShowLogin(true)}>Mark Scores</button>
            </div>
          </div>
        </div>
      </div>
      <Login show={showLogin} handleClose={() => setShowLogin(false)} handleLoginSuccess={handleLoginSuccess} />

    </div>
    <Footer />
  </>
  );
};

export default Dashboard;
