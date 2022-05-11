import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentAboutPage from "./StudentAboutPage";
import StudentHomePage from "./StudentHomePage";
import StudentLogout from "./StudentLogout";
import StudentNavBar from "./StudentNavBar";
const Student = () => {
  return (
    <>
      <StudentNavBar />

      <Routes>
        <Route
          exact
          path="/api/v1/students/homepage"
          element={<StudentHomePage />}
        />
        <Route path="/api/v1/students/about" element={<StudentAboutPage />} />
        <Route path="/api/v1/students/logout" element={<StudentLogout />} />
      </Routes>
    </>
  );
};

export default Student;
