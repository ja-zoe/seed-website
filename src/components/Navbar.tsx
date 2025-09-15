import SEEDlogo from "@/assets/SEEDlogo.png";
import { Button } from "./ui/button";
import { Shield } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="">
          <a href="/">
            <img src={SEEDlogo} alt="Seed Logo" className="w-18" />
          </a>
        </div>
        <div className="">
          <p className="font-bold text-2xl">Project Proposal Form</p>
        </div>
      </div>

      <a href="/admin">
        <Button
          variant="outline"
          className="border-green-600 text-green-200 bg-green-700/50 hover:text-green-200 hover:bg-green-800"
        >
          <Shield className="h-4 w-4 mr-2" />
          Admin Panel
        </Button>
      </a>
    </div>
  );
};

export default Navbar;
