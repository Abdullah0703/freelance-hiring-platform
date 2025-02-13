import React from "react";
import "../../styles/global.css";
import AdminDashboard from '../components/dashboard/AdminDashboard';

const AdminDashboardPage = ({ sideBarWidth }) => {

  return (
    <>
      <AdminDashboard sideBarWidth={sideBarWidth} />
    </>
  );
};

export default AdminDashboardPage;