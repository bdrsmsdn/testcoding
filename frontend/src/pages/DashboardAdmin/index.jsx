import React from 'react';
import { Navbar, SidebarAdmin } from '../../components';

const DashboardAdmin = () => {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <SidebarAdmin />
        <div className="ml-[50px] py-6">
          <h1 className="text-2xl font-semibold mb-4 text-left">Halo</h1>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
