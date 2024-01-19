import React from 'react';
import { getMenuLinksData } from '../Constants';
import { useUser } from "../Redux/UserContext";
import { useNavigate } from 'react-router-dom';
import "../Stylesheets/Global.css"

const SidebarSection = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const menuLinks = getMenuLinksData(userData);

  const handleNavigation = (link) => {
    navigate(link.Onclick);
  };

  return (
    <div className="p-4 h-full bg-black sticky top-0 shadow-xl border-r-2 border-gray-100 w-full">
      <div className="flex p-0 items-center justify-center mb-6 space-x-5">
        <h1 className="text-4xl px-4 py-1 textFlex text-white">S.</h1>
      </div>
      <div className="w-full">
        {menuLinks.map((link, index) => (
          <div className="NavLinks w-full space-y-5 flex items-center justify-center cursor-pointer" key={index}>
            <div onClick={() => handleNavigation(link)} className="iconFlex flex items-center justify-center text-white text-xl py-6">
              {link.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarSection;
