import "./App.css";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ProjectProposalForm from "./forms/ProjectProposalForm";
import AdminApp from "./components/AdminApp";
import { Button } from "./components/ui/button";
import { Shield, FileText } from "lucide-react";

function App() {
  const [currentView, setCurrentView] = useState<'form' | 'admin'>('form');

  if (currentView === 'admin') {
    return <AdminApp />;
  }

  return (
    <div className="min-h-screen bg-green-950 text-white">
      <div className="flex items-center justify-between px-6 py-3">
        <Navbar />
        <Button
          onClick={() => setCurrentView('admin')}
          variant="outline"
          className="border-green-600 text-green-100 hover:bg-green-800"
        >
          <Shield className="h-4 w-4 mr-2" />
          Admin Panel
        </Button>
      </div>
      <ProjectProposalForm />
    </div>
  );
}

export default App;
