import React from "react";

const User = (props) => {
  return (
    <li>
      <h1>{props.firstName}</h1>
      <h4>{props.emailId}</h4>
    </li>
  );
};

export default User;
