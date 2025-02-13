import { ChakraProvider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import Billers from "./admin/pages/biller/Biller";
import { default as Attendance, default as BillerProfile } from "./admin/pages/billerProfile/BillerProfile";
import ChatScreen from "./admin/pages/ChatScreen";
import Clients from "./admin/pages/client/Client";
import Jobs from "./admin/pages/job/Job";
import NotFoundPage from "./admin/pages/NotFoundPage";
import Overview from "./admin/pages/profile";
import ReportScreen from "./admin/pages/report";
import Support from "./admin/pages/support/Support";
import Task from "./admin/pages/task/Task";
import SideBar from "./components/common/sidebarHeader";
import Footer from "./components/footer/footer";
import Register from "./components/SignIn/Register";
import SignIn from "./components/SignIn/SignIn";
import theme from "./styles/theme";
import NotificationsMenu from "./admin/pages/notification/NotificationsMenu";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "isUserLoggedIn") {
        setIsLoggedIn(event.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    const userIsLoggedIn = localStorage.getItem("isUserLoggedIn");
    setIsLoggedIn(userIsLoggedIn === "true");
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const [sideBarWidth, setSideBarWidth] = useState("large");

  const handleSidebarWidth = () => {
    setSideBarWidth((prevWidth) => (prevWidth === "small" ? "large" : "small"));
  };

  return (
    <ChakraProvider theme={theme}>
      {isLoggedIn ? (
        <>
          {
            <SideBar
              sideBarWidth={sideBarWidth}
              handleSidebarWidth={handleSidebarWidth}
            />
          }
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<AdminDashboardPage sideBarWidth={sideBarWidth} />} />
            <Route path="/billers" element={<Billers sideBarWidth={sideBarWidth} />} />
            <Route path="/jobs" element={<Jobs sideBarWidth={sideBarWidth} />} />
            <Route path="/clients" element={<Clients sideBarWidth={sideBarWidth} />} />
            <Route path="/biller/profile/:userId" element={<BillerProfile sideBarWidth={sideBarWidth} />} />
            <Route path="/reports" element={<ReportScreen sideBarWidth={sideBarWidth} />} />
            {/* <Route path="/attendance" element={<AttendanceList sideBarWidth={sideBarWidth} />} /> */}
            <Route path="/billerprofile" element={<Attendance sideBarWidth={sideBarWidth} />} />
            <Route path="/chat" element={<ChatScreen sideBarWidth={sideBarWidth} handleSidebarWidth={handleSidebarWidth} />} />
            <Route path="/profile" element={<Overview sideBarWidth={sideBarWidth} />} />
            <Route path="/support" element={<Support sideBarWidth={sideBarWidth} />} />
            <Route path='/notifications' element={<NotificationsMenu />} />
            {/* <Route path="/resumeupload" element={<ResumeUpload sideBarWidth={sideBarWidth} />} /> */}
            {/* <Route path="/resumechat" element={<Chatbot sideBarWidth={sideBarWidth} />} /> */}
            {/* <Route path="/form" element={<Form sideBarWidth={sideBarWidth} />} /> */}
            {/* <Route path="/resume" element={<Resume sideBarWidth={sideBarWidth} />} /> */}
            {/* <Route path="/payroll" element={<Payroll sideBarWidth={sideBarWidth} />} /> */}
            <Route path="/task" element={<Task sideBarWidth={sideBarWidth} />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </>
      ) : (
        <Routes>
          {/* <Route path="*"   element={<NotFoundPage />} /> */}
          <Route path="/" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </ChakraProvider>
  );
}
