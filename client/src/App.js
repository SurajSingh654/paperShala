import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import BasicTable from "./components/TableComponents/BasicTable";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Student from "./components/StudentComponents/Student";
import OrganizationHead from "./components/OrganizationHeadComponents/OrganizationHead";
import Admin from "./components/AdminComponents/Admin";
import Parent from "./components/ParentComponents/Parent";
import Teacher from "./components/TeacherComponents/Teacher";
import Users from "./components/Users";
const App = () => {
  const [users, setusers] = useState([]);
  const onSaveUserDataHandler = (userData) => {
    console.log(userData);
    setusers((prev) => {
      return [...prev, userData];
    });
    console.log(users);
  };
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Signup onSaveUserData={onSaveUserDataHandler} /> <Login />
            </>
          }
        />

        <Route path="/api/v1/teachers/homepage/*" element={<Teacher />} />
        <Route path="/api/v1/students/homepage/*" element={<Student />} />
        <Route
          path="/api/v1/organizationHeads/homepage/*"
          element={<OrganizationHead />}
        />
        <Route path="/api/v1/admins/homepage/*" element={<Admin />} />
        <Route path="/api/v1/parents/homepage/*" element={<Parent />} />
      </Routes>
      <Users users={users} />
      <BasicTable users={users} />
    </>
  );
};

export default App;
