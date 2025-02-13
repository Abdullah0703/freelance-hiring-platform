// src/components/dashboard/AdminDashboard.js
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getDashbaordData } from "../../../API/adminDashboard";
import { getClientDashboardData } from "../../../API/client";
import { getAllJobs } from "../../../API/job";
import Loading from "../../../components/Loading/Loading";
import "../../../styles/global.css";
import AdminCard from "./AdminCards";
import AnnouncementCard from "./AnnouncementCard";
import BillerCard from "./BillerCard";
import BillerProductivityDetails from "./billerComponents/BillerProductivityDetails";
import BillerProductivityReport from "./billerComponents/BillerProductivityReport";
import ClientCard from "./ClientCard";
import DataTable from "./billerComponents/DataTable";
import Reports from "./Reports";
import CardItem from "./clientComponents/Cards";
import ChartComponent from "./clientComponents/ChartComponent";
import ClientJobData from "./clientComponents/ClientJobData";
import RadialBarChart from "./clientComponents/RadialBarChart";
import { getAllTickets } from "../../../API/ticket";


const BillerAttendanceData = [
  {
    title: "Assignment Management",
    values: ["260", "15", "5"],
    texts: ["Current", "New", "Status"],
  },
]
const announcementData = {
  text: "Notifications",
  subText: [
    {
      title: "Office Management Meeting",
      date: "Mar 21, 2:00 PM",
      color: "green",
    },
    {
      title: "Team Leader Meeting",
      date: "April 22, 8:00 PM",
      color: "red",
    },
    {
      title: "Staff Meeting",
      date: "Mar 21, 2:00 PM",
      color: "green",
    },
    {
      title: "Client Meeting",
      date: "Mar 21, 2:00 PM",
      color: "orange",
    },
  ],
  avatarUrl: "", // Pass avatar URL if needed, otherwise leave empty
};

const TaskData = [
  {
    taskId: "1",
    name: "Task 1",
    estimatedTime: "5 hours",
    deadline: "2023-12-01",
  },
  {
    taskId: "2",
    name: "Task 2",
    estimatedTime: "8 hours",
    deadline: "2023-12-05",
  },
  {
    taskId: "3",
    name: "Task 3",
    estimatedTime: "3 hours",
    deadline: "2023-12-10",
  },
  {
    taskId: "4",
    name: "Task 4",
    estimatedTime: "6 hours",
    deadline: "2023-12-15",
  },
];

const billers = [
  {
    name: "Biller Name 1",
    contact: "biller1@example.com",
    assignedClients: ["Client Name 1", "Client Name 2"],
    hoursWorked: 160,
    performanceMetrics: "Excellent",
    status: "Active",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    workLog: [
      { date: "May 14", hoursWorked: 8, tasksCompleted: 10 },
      { date: "May 13", hoursWorked: 7, tasksCompleted: 8 }
    ]
  },
  {
    name: "Biller Name 2",
    contact: "biller2@example.com",
    assignedClients: ["Client Name 1"],
    hoursWorked: 120,
    performanceMetrics: "Good",
    status: "Pending",
    avatarUrl: "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    workLog: [
      { date: "May 12", hoursWorked: 6, tasksCompleted: 6 },
      { date: "May 11", hoursWorked: 5, tasksCompleted: 4 }
    ]
  },
];

const billerreportData = {
  title: 'Productivity Report',
  totalHoursWorked: 5,
  tasksCompleted: 45,
  tat: 95,
  clientFeedback: 4.8,
  supportTickets: [
    { id: '1234', issue: 'Issue with task assignment', status: 'Open' },
    { id: '1233', issue: 'Payment not reflected', status: 'Resolved' }
  ]
};

const clientreportData = {
  title: "Monthly Report",
  TotalBilling: '$5000',
  tat: '95%',
  ClientSatisfaction: '4.8/5'
}

const clients = [
  {
    name: "Client Name 1",
    contact: "client1@example.com",
    jobRequirements: "Requirements",
    assignedBillers: ["Biller Name 1", "Biller Name 2"],
    paymentStatus: "Pending",
    status: "Active",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Client Name 2",
    contact: "client2@example.com",
    jobRequirements: "Requirements",
    assignedBillers: ["Biller Name 3", "Biller Name 5"],
    paymentStatus: "Pending",
    status: "Active",
    avatarUrl: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];
const billingData = {
  amountDue: "$1500",
  dueDate: "May 30",
  paymentHistory: [
    { date: "May 10", amount: "$2000", status: "Paid" },
    { date: "April 30", amount: "$1800", status: "Paid" },
  ],
  supportTickets: [
    { id: "1234", issue: "Issue with billing report", status: "Open" },
    { id: "1233", issue: "Payment not reflected", status: "Resolved" },
  ],
  monthlyReport: {
    month: "May",
    totalBilling: "$5000",
    tat: "95%",
    clientSatisfaction: "4.8/5"
  }
};

const assignmentData = {
  currentAssignments: [
    "Client Name 1 | Biller Name 1 | Due Date: May 20",
    "Client Name 2 | Biller Name 2 | Due Date: May 25",
  ],
  newAssignments: [
    "Create New Assignment",
    "Select Client: [Dropdown List]",
    "Select Biller: [Dropdown List]",
  ],
  interviewScheduling: [
    "Schedule Interview",
    "Select Client: [Dropdown List]",
    "Select Biller: [Dropdown List]",
    "Date & Time: [Date & Time Picker]",
  ],
  assignmentStatus: [
    "Client Name 1 | Biller Name 1 | Status: Active",
    "Client Name 2 | Biller Name 2 | Status: Completed",
  ],
};

const invoicesData = [
  { invoiceId: "123", clientName: "Client Name 1", amount: "$1,500", status: "Pending" },
  { invoiceId: "124", clientName: "Client Name 2", amount: "$2,000", status: "Paid" },
];

const paymentsData = [
  { clientName: "Client Name 1", totalDue: "$1,500", paid: "$0", due: "$1,500" },
  { clientName: "Client Name 2", totalDue: "$2,000", paid: "$2,000", due: "$0" },
];

const supportData = {
  liveChatLink: "/live-chat",
  faqsAndResources: [
    {
      title: "How to Submit Productivity Report",
      link: "/faq/productivity-report",
    },
    {
      title: "Understanding Your Performance Metrics",
      link: "/faq/performance-metrics",
    },
  ],
};

const workLogs = [
  { date: 'May 14', hoursWorked: 8 },
  { date: 'May 13', hoursWorked: 7 },
];

const dailyTasks = [
  { name: 'Task 1', description: 'Verify insurance claims', status: 'Completed' },
  { name: 'Task 2', description: 'Submit billing report', status: 'Pending' },
];

const AdminDashboard = ({ sideBarWidth }) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [DashboardData, setDashboardData] = useState(null)
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const fetchDashboardData = async () => {
    try {
      const Data = await getDashbaordData();
      console.log("Dashboard data fetched: ", Data);
      return Data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return null;
    }
  };

  const fetchTickets = async () => {
    try {
      const Data = await getAllTickets();
      console.log("Tickets data fetched: ", Data.raisedTickets);
      return Data.raisedTickets; // Make sure this matches the structure of your response
    } catch (error) {
      console.log("Error fetching support tickets in admin dashboard: ", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        let TempDashboardData;
        let TempTicketsData;

        if (userData.role === "ADMIN") {
          const { dashboardData } = await fetchDashboardData();
          TempDashboardData = dashboardData;
          const ticketsData = await fetchTickets();
          TempTicketsData = ticketsData;
        } else if (userData.role === "CLIENT") {
          const { dashboardData } = await getClientDashboardData(userData.userId);
          console.log("Getting data for client dashboard", dashboardData);
          setChartData({
            labels: ['Jobs Posted', 'Jobs Completed', 'Jobs Aborted'],
            datasets: [
              {
                data: [
                  dashboardData.jobsPosted,
                  dashboardData.jobsCompleted,
                  dashboardData.jobsAborted,
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'],
                borderColor: '#fff',
                borderWidth: 2,
              },
            ],
          });

          setChartOptions({
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
                align: 'center',
                labels: {
                  boxWidth: 12,
                  font: {
                    size: 12,
                  },
                  padding: 20,
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed !== null) {
                      label += `${context.parsed}`;
                    }
                    return label;
                  },
                },
              },
            },
            elements: {
              arc: {
                borderWidth: 2,
              },
            },
          });
          TempDashboardData = dashboardData;
        } else if (userData.role === "BILLER") {
          const billerdata = await getAllJobs();
          const data = billerdata;
          console.log("fetched the biller dashboard data: ", data);
          console.log("fetched the biller dashboard data jobs:", data.jobs);
          console.log("fetched the biller dashboard data clients:", data.clients);
          TempDashboardData = data;
        }
        if (userData.role === "ADMIN") {
          setDashboardData({
            ...TempDashboardData,
            tickets: TempTicketsData
          });
        } else {
          setDashboardData(TempDashboardData);
        }
        setUser(userData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  if (loading) {
    return <Loading />;
  }

  // Render based on user role
  if (!user) {
    return <Box>Please log in to access the dashboard.</Box>;
  }

  const role = user.role;
  const AttendanceData = [
    {
      title: "Overview Section",
      values: [
        DashboardData?.totalClientsCount || 0,
        DashboardData?.totalBillersCount || 0
      ],
      texts: ["Clients", "Billers"],
    },
    {
      title: "Assignment Management",
      values: [
        DashboardData?.totalJobsCount || 0,
        DashboardData?.interviewSchedulingCount || 0
      ],
      texts: ["Current", "New"],
    },
  ];

  return (
    <Box bg={bgColor} py={8} w="auto" minH="100vh">
      <Container maxW="container.xxl">
        <Box
          ml={{ base: 0, lg: sideBarWidth === "small" ? 14 : 60 }}
          transition="margin 0.3s ease-in-out"
        >
          <Heading as="h1" size="xl" mb={4}>
            Dashboard
          </Heading>
          {role === "ADMIN" && (
            <>
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                {/* <UserProfile
                  name={user?.userName}
                  jobTitle={user?.designation}
                  avatarUrl={`https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                /> */}
                {/* {AttendanceData.map((data, index) => (
                  <AttendanceCard
                    key={index}
                    title={data.title}
                    values={data.values}
                    texts={data.texts}
                  />
                ))} */}
                <AdminCard title="Total Billers" value={DashboardData.totalBillersCount} iconColor="green.500" linktext="View Billers" />
                <AdminCard title="Total Clients" value={DashboardData.totalClientsCount} iconColor="green.500" linktext="View Clients" />
                <AdminCard title="Total Jobs" value={DashboardData.totalJobsCount} iconColor="green.500" linktext="View Jobs" />
                <AdminCard title="Support Tickets" value={DashboardData.tickets} iconColor="green.500" linktext="View Tickets" />
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} py={4}>
                <BillerCard
                  data={DashboardData?.lastTwoBillers}
                  heading="Biller List"
                  onAddNew={() => { }}
                  onAssign={() => { }}
                />
                <ClientCard
                  data={DashboardData?.lastTwoClients}
                  heading="Client List"
                  onAddNew={() => { }}
                  onAssign={() => { }}
                />
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} >
                {/* <AssignmentManagementCard
                  assignmentsData={assignmentData}
                  heading="Assignment Management"
                /> */}
              </SimpleGrid>
              <Reports clientReport={DashboardData?.clientReportCount} totalHours={DashboardData?.totalHours} averageRating={DashboardData?.averageRating} TotalClient={DashboardData?.totalClientsCount} TotalBillers={DashboardData?.totalBillersCount} />
              {/* <InvoicesPayments
                invoicesData={invoicesData}
                paymentsData={paymentsData}
                /> */}
            </>
          )}
          {/* Biller here */}
          {role === "BILLER" && (
            <>
              <SimpleGrid columns={{ base: 1, }} spacing={4} mb={4}>
                <BillerProductivityReport />
                {/* <UserProfile
                  name={user?.userName}
                  jobTitle={user?.designation}
                  avatarUrl={`https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                /> */}
                <Box width="100%">
                  <DataTable
                    title="My Jobs"
                    buttonLabel="View All"
                  // tasks={DashboardData.jobs}
                  />
                </Box>
                {/* <DataTable
                  tasks={TaskData}
                  title="Current Assignments"
                  buttonLabel="View All"
                /> */}
              </SimpleGrid>
              <AnnouncementCard
              // text={announcementData.text}
              // subText={announcementData.subText}
              // avatarUrl={announcementData.avatarUrl}
              />
              <SimpleGrid spacing={4} py={4}>
                <ClientCard data={DashboardData.clients}
                  heading="Client List"
                // onAddNew={() => { }}
                // onAssign={() => { }}
                />
                <BillerProductivityDetails dailyTasks={dailyTasks} />
              </SimpleGrid>
            </>
          )}
          {role === "CLIENT" && (
            <>
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                <CardItem title="Jobs Posted" value={DashboardData?.jobsPosted} iconColor="teal.500" linktext="Add new Job" />
                <CardItem title="Jobs Completed" value={DashboardData?.jobsCompleted} iconColor="green.500" linktext="View Details" />
                <CardItem title="Jobs Aborted" value={DashboardData?.jobsAborted} iconColor="red.500" linktext="View Details" />
                <CardItem title="Productivity" iconColor="purple.500" linktext="View Details" />
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} py={4}>
                <ChartComponent />
                <RadialBarChart data={chartData} options={chartOptions} />
              </SimpleGrid>
              <SimpleGrid spacing={4}>
                {/* <DataTable
                  tasks={TaskData}
                  title="Current Projects"
                  buttonLabel="View All"
                /> */}
                <ClientJobData title="Jobs" buttonLabel="Add Job" />
                {/* <BillerCard
                  data={billers}
                  heading="Biller List"
                  userRole={"CLIENT"} />
                <ClientBillingSummary data={billingData} /> */}
              </SimpleGrid>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
