import React from "react";
import User from "../components/User";
const Users = (props) => {
  return (
    <ul>
      {props.users.map((user) => (
        <User
          key={user.emailId}
          firstName={user.firstName}
          emailId={user.emailId}
        />
      ))}
    </ul>
  );
};

export default Users;
