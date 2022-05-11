import React from "react";
import { NavLink } from "react-router-dom";
const TeacherNavBar = () => {
  return (
    <div>
      <div>
        <div>
          <h1>paperShala</h1>
        </div>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/">Logout</NavLink>
          </li>
          <li>
            <NavLink to="/addExamPaper">Add ExamPaper</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherNavBar;
