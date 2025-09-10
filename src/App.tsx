import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import ProjectProposalForm from "./forms/ProjectProposalForm";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProposalDetail from "./pages/ProposalDetail";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main form route */}
        <Route path="/" element={
          <div className="min-h-screen bg-green-950 text-white">
            <Navbar />
            <ProjectProposalForm />
          </div>
        } />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/proposal/:id" element={<ProposalDetail />} />
      </Routes>
    </Router>
  );
}

export default App;