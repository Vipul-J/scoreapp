import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddTeam from "./pages/Admin/Teams/AddTeam";
import GetTeams from "./pages/Admin/Teams/GetTeams";
import MasterHome from "./pages/MasterHome";
import ScorerDashboard from "./pages/Scorer/Dashboard";
// import AdminDashboard from "./pages/Admin/Events/AddSubEve";

import Scoring from "./pages/Scorer/Scoring";
import Dashboard from "./pages/Admin/Teams/Dashboard";
import AddEvents from "./pages/Admin/Events/AddEvents";
import GetEvents from "./pages/Admin/Events/GetEvents";
import AddUsers from "./pages/Admin/Users/AddUsers";
import GetUsers from "./pages/Admin/Users/GetUsers";
import GetScores from "./pages/Admin/Scores/GetScores";
import TwoRoundsScores from "./pages/Admin/Scores/TwoRoundsScores";
import ScoreReport from "./pages/Admin/Scores/ScoreReport";
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<MasterHome />} />
        <Route exact path="/admin/dashboard" element={<Dashboard />} />

        {/* <Route exact path="/admin/dashboard" element={<AdminDashboard />} /> */}
        <Route exact path="/admin/getTeams" element={<GetTeams />} />
        <Route exact path="/admin/postTeams" element={<AddTeam />} />

        <Route exact path="/admin/postEvents" element={<AddEvents />} />
        <Route exact path="/admin/getEvents" element={<GetEvents />} />

        <Route exact path="/admin/postUsers" element={<AddUsers />} />
        <Route exact path="/admin/getUsers" element={<GetUsers />} />

        <Route exact path="/admin/getScores" element={<GetScores />} />
        <Route exact path="/admin/cumScores" element={<TwoRoundsScores />} />
        <Route exact path="/admin/scoreReport" element={<ScoreReport />} />



        <Route exact path="/scorer/dashboard" element={<ScorerDashboard />} />
        <Route exact path="/scorer/postScores" element={<Scoring />} /> 
      </Routes>
    </Router>
  );
}

export default App;
