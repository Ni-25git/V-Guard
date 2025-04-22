import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const addForm = () => {
    console.log('button clicked');
    navigate('/form');
  };

  return (
    <div className="bg-black py-4 px-6 flex flex-col md:flex-row items-center justify-between">
      {/* Left Section: Logo and Heading */}
      <div className="flex items-center space-x-4">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAlGEBad_1Lj1epvMbXIekGC-QSUwlc1zKwQ&s"
          alt="Logo"
          className="h-14 w-auto object-contain"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-orange-300">
          Welcome to Safety Dashboard of V-Guard Roorkee
        </h1>
      </div>

      {/* Right Section: Button */}
      <button
        onClick={addForm}
        className="mt-4 md:mt-0 text-black font-semibold px-5 py-2 rounded bg-orange-300 hover:bg-orange-400 transition"
      >
        Add Data
      </button>
    </div>
  );
};

export default Header;
