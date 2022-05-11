import React from "react";
import { NavLink } from "react-router-dom";
const StudentNavBar = () => {
  return (
    <div>
      <div>
        <div>
          <h1>paperShala</h1>
        </div>
        <ul>
          <li>
            <NavLink to="/api/v1/students/homepage"> Student Home</NavLink>
          </li>
          <li>
            <NavLink to="/api/v1/students/about">Student About</NavLink>
          </li>
          <li>
            <NavLink to="/api/v1/students/logout">Student Logout</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StudentNavBar;
