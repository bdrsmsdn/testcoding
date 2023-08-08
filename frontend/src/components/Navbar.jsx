import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState({
    nama: '',
    role: '',
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));

    if (storedData) {
      const role = storedData.level == 0 ? 'Administrator' : 'User';
      setData({
        nama: storedData.name,
        role,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    window.location.href = '/';
  };

  return (
    <div className="bg-white text-black shadow-sm pb-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold">Logo</span>
        </div>
        <div className="flex items-center space-x-12">
          <span className="text-lg text-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </span>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm">{data.nama}</p>
              <p className="text-xs">{data.role}</p>
            </div>
            <div className="relative group">
              <button className="text-lg text-black" onClick={() => setShowDropdown(!showDropdown)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              {showDropdown && (
                <ul className="absolute right-0 mt-2 bg-white border rounded-lg py-2 px-4 shadow-md">
                  <li className="px-4 py-2 hover:bg-blue-100 cursor-pointer">Profile</li>
                  <li className="px-4 py-2 hover:bg-blue-100 cursor-pointer">Settings</li>
                  <li onClick={handleLogout} className="px-4 py-2 hover:bg-blue-100 cursor-pointer">
                    Logout
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
