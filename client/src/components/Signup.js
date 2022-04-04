import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import signpic from "../images/signup.svg";

const Signup = () => {
  const history = useHistory();
  const [user, setUser] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    emailId: "",
    phoneNumber: "",
    category: "",
    gender: "",
    address: {
      addressstreet: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
    },
    // addressstreet: "",
    // city: "",
    // state: "",
    // country: "",
    // pinCode: "",
    image: "",
    password: "",
    confirmPassword: "",
  });

  let name, value;

  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const PostData = async (e) => {
    //e.preventDefault();

    const {
      firstName,
      middleName,
      lastName,
      emailId,
      phoneNumber,
      category,
      gender,
      address,
      // addressstreet,
      // city,
      // state,
      // country,
      // pinCode,
      image,
      password,
      confirmPassword,
    } = user;
    console.log(user);
    const res = await fetch("/api/v1/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        middleName,
        lastName,
        emailId,
        phoneNumber,
        category,
        gender,
        address,
        // addressstreet,
        // city,
        // state,
        // country,
        // pinCode,
        image,
        password,
        confirmPassword,
      }),
    });

    const data = await res.json();

    // I need to change the data to res
    if (data.status === 422 || !data) {
      window.alert("Invalid Registration");
      console.log("Invalid Registration");
    } else {
      window.alert(" Registration Successfull");
      console.log("Successfull Registration");

      history.push("/login");
    }
  };

  return (
    <>
      <section className="signup">
        <div className="container mt-5">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title">Sign up</h2>
              <form method="POST" className="register-form" id="register-form">
                <div className="form-group">
                  <label htmlFor="firstName">
                    <i className="zmdi zmdi-account material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    autocomplete="off"
                    value={user.firstName}
                    onChange={handleInputs}
                    placeholder="Your FirstName"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="middleName">
                    <i className="zmdi zmdi-account material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    id="middleName"
                    autocomplete="off"
                    value={user.middleName}
                    onChange={handleInputs}
                    placeholder="Your MiddleName"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">
                    <i className="zmdi zmdi-account material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    autocomplete="off"
                    value={user.lastName}
                    onChange={handleInputs}
                    placeholder="Your LastName"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emailId">
                    <i className="zmdi zmdi-email material-icons-name"></i>
                  </label>
                  <input
                    type="emailId"
                    name="emailId"
                    id="emailId"
                    autoComplete="off"
                    value={user.emailId}
                    onChange={handleInputs}
                    placeholder="Your Email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    <i className="zmdi zmdi-phone-in-talk material-icons-name"></i>
                  </label>
                  <input
                    type="number"
                    name="phoneNumber"
                    id="phoneNumber"
                    autoComplete="off"
                    value={user.phoneNumber}
                    onChange={handleInputs}
                    placeholder="Your Phone"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">
                    <i className="zmdi zmdi-slideshow material-icons-name"></i>
                  </label>
                  <select name="category" id="category" onChange={handleInputs}>
                    <option value={user.category}>Teacher</option>
                    <option value={user.category}>Student</option>
                    <option value={user.category}>Head</option>
                    <option value={user.category}>Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="gender">
                    <i className="zmdi zmdi-slideshow material-icons-name"></i>
                  </label>
                  <select name="gender" id="gender" onChange={handleInputs}>
                    <option value={user.gender}>Male</option>
                    <option value={user.gender}>Female</option>
                    <option value={user.gender}>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="address">
                    <i className="zmdi zmdi-lock material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    autoComplete="off"
                    value={user.address.addressstreet}
                    onChange={handleInputs}
                    placeholder="Your Address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">
                    <i className="zmdi zmdi-lock material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    autoComplete="off"
                    value={user.address.city}
                    onChange={handleInputs}
                    placeholder="Your city"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">
                    <i className="zmdi zmdi-lock material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    autoComplete="off"
                    value={user.address.state}
                    onChange={handleInputs}
                    placeholder="Your State"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">
                    <i className="zmdi zmdi-lock material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    autoComplete="off"
                    value={user.address.country}
                    onChange={handleInputs}
                    placeholder="Your Country"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pinCode">
                    <i className="zmdi zmdi-lock material-icons-name"></i>
                  </label>
                  <input
                    type="number"
                    name="pinCode"
                    id="pinCode"
                    autoComplete="off"
                    value={user.address.pinCode}
                    onChange={handleInputs}
                    placeholder="Your Pincode"
                  />
                </div>
                {/* ---------------------- */}
                <div className="form-group">
                  <label htmlFor="password">
                    <i className="zmdi zmdi-lock material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    name="password"
                    id="password"
                    autoComplete="off"
                    value={user.password}
                    onChange={handleInputs}
                    placeholder="Your Password"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <i className="zmdi zmdi-lock material-icons-name"></i>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    autoComplete="off"
                    value={user.confirmPassword}
                    onChange={handleInputs}
                    placeholder="Confirm Your Password"
                  />
                </div>

                <div className="form-group form-button">
                  <input
                    type="submit"
                    name="signup"
                    id="signup"
                    className="form-submit"
                    value="signup"
                    onClick={PostData}
                  />
                </div>
              </form>
            </div>

            <div className="signup-image">
              <figure>
                <img src={signpic} alt="registration pic" />
              </figure>
              <NavLink to="/login" className="signup-image-link">
                I am already register
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
