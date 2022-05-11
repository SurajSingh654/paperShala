import React from "react";
import { Route, Routes } from "react-router-dom";
import TeacherAboutPage from "./TeacherAboutPage";
import TeacherAddExamPaper from "./TeacherAddExamPaper";
import TeacherHomePage from "./TeacherHomePage";
import TeacherLogout from "./TeacherLogout";
import TeacherNavBar from "./TeacherNavBar";
const Teacher = () => {
  return (
    <>
      <TeacherNavBar />

      <Routes>
        <Route
          exact
          path="/api/v1/teachers/homepage"
          element={<TeacherHomePage />}
        />
        <Route path="/api/v1/teachers/about" element={<TeacherAboutPage />} />
        <Route
          path="/api/v1/teachers/addExamPaper"
          element={<TeacherAddExamPaper />}
        />
        <Route path="/api/v1/teachers/logout" element={<TeacherLogout />} />
      </Routes>
    </>
  );
};

export default Teacher;
