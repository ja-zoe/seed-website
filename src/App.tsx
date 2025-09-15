import "./App.css";
import ProjectProposalForm from "./forms/ProjectProposalForm";
import AdminApp from "./components/AdminApp";
import { Routes, Route } from "react-router";

function App() {
  return (
    <div className="min-h-screen bg-green-950 text-white">
      <Routes>
        <Route path="/" element={<ProjectProposalForm />} />
        <Route path="/admin" element={<AdminApp />} />
      </Routes>
    </div>
  );
}

export default App;
