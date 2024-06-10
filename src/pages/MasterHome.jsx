import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserLock, faUser } from '@fortawesome/free-solid-svg-icons';
import Logo from '../assets /img/logo.png'
import '../assets /styles/core.css'
 const MasterHome = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleAdminLogin = () => {
    if (username === 'admin' && password === 'admin') {
      setAuthenticated(true);
      window.location.href = '/admin/dashboard';  
    } else {
      setErrorMessage('Incorrect username or password');
    }
  };

  return (
    <>
<div className="container">
      <div className=' text-center mt-5 mb-5'>
        <img src={Logo} height={100}/>
        <h2 className='mt-5'><span className='text-danger'>INVINCIO 2.0</span> E-Scoring Portal</h2>
      </div>
      <div className='d-flex align-items-center justify-content-center '>
      <div className="row">
        {!authenticated && (
          <div className="col-md-6 mb-4 d-flex justify-content-center">
            <div className="card shadow-lg" style={{ width: '24rem' }}>
              <div className="card-body p-4 text-center">
                <FontAwesomeIcon icon={faUserLock} className="fs-1 mb-3" />
                <h5 className="card-title fs-3 mb-3">
                  Admin Login
                </h5>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <button onClick={handleAdminLogin} className="btn btn-secondary fw-bolder">Login</button>
              </div>
            </div>
          </div>
        )}
        <div className="col-md-6 mb-4 d-flex justify-content-center">
          <div className="card shadow-lg" style={{ width: '24rem' }}>
            <div className="card-body p-4 text-center">
              <FontAwesomeIcon icon={faUser} className="fs-1 mb-3" />
              <h5 className="card-title fs-3 mb-3">
                Scorer Dashboard
              </h5>
              <a href="/scorer/dashboard" className="btn btn-secondary fw-bolder">Go to Dashboard</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default MasterHome;
