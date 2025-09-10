import "./App.css";
import Navbar from "./components/Navbar";
import ProjectProposalForm from "./forms/ProjectProposalForm";

function App() {
  return (
    <div className="min-h-screen bg-green-950 text-white">
      <Navbar />
      <ProjectProposalForm />
    </div>
  );
}

export default App;
