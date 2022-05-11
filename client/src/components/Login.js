import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = (props) => {
  const navigate = useNavigate();
  const [emailId, setemailId] = useState("");
  const [password, setpassword] = useState("");
  const [category, setcategory] = useState("Student");

  const emailIdChangeHandler = (event) => {
    setemailId(event.target.value);
  };
  const passwordChangeHandler = (event) => {
    setpassword(event.target.value);
  };
  const categoryChangeHandler = (event) => {
    setcategory(event.target.value);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const baseURL = `/api/v1/${
      category[0].toLowerCase() + category.slice(1) + "s"
    }`;
    const res = await fetch(`${baseURL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailId,
        password,
      }),
    });
    const data = await res.json();
    if (data.status === "success") {
      console.log("User LoggedIn Successfully!");
      navigate(`${baseURL}/homepage`);
    } else {
      console.log("User Registration UnSuccessfull!");
      navigate(`/`);
    }
    console.log(data);

    const user = {
      emailId,

      password,
    };
    console.log(user);

    // Lifting the state-up
    // setemailId("");
    // setpassword("");
  };

  return (
    <div>
      <form method="POST" onSubmit={formSubmitHandler}>
        <h1>Login Form</h1>
        <div>
          <label htmlFor="loginemail">EmailId</label>
          <input
            type="text"
            id="loginemail"
            name="loginemail"
            placeholder="your_emailID"
            required
            onChange={emailIdChangeHandler}
            value={emailId}
          ></input>
        </div>
        <div>
          <label htmlFor="loginpassword">Password</label>
          <input
            type="password"
            id="loginpassword"
            name="loginpassword"
            placeholder="your_password"
            required
            onChange={passwordChangeHandler}
            value={password}
          ></input>
        </div>
        <div>
          <label htmlFor="logincategory">Category</label>
          <select
            name="logincategory"
            id="logincategory"
            onChange={categoryChangeHandler}
            value={category}
          >
            <option value="OrganizationHead">OrganizationHead</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
          </select>
        </div>

        <div>
          <button>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
