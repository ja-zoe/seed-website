import SEEDlogo from "@/assets/SEEDlogo.png";

const Navbar = () => {
  return (
    <div className="flex items-center gap-5">
      <div className="">
        <img src={SEEDlogo} alt="Seed Logo" className="w-18" />
      </div>

      <div className="">
        <p className="font-bold text-2xl">Project Proposal Form</p>
      </div>
    </div>
  );
};

export default Navbar;
