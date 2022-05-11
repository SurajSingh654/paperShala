import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Signup = (props) => {
  const navigate = useNavigate();
  const [firstName, setfirstName] = useState("");
  const [middleName, setmiddleName] = useState("");
  const [lastName, setlastName] = useState("");
  const [emailId, setemailId] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [category, setcategory] = useState("Student");
  const [gender, setgender] = useState("Male");
  const [password, setpassword] = useState("");
  const [confirmPassword, setcpassword] = useState("");
  const [image, setimage] = useState("");
  const [address, setaddress] = useState({
    // addressStreet: "",
    city: "",
    state: "",
    country: "",
    pinCode: 0,
  });

  const firstNameChangeHandler = (event) => {
    setfirstName(event.target.value);
  };
  const middleNameChangeHandler = (event) => {
    setmiddleName(event.target.value);
  };
  const lastNameChangeHandler = (event) => {
    setlastName(event.target.value);
  };
  const emailIdChangeHandler = (event) => {
    setemailId(event.target.value);
  };
  const phoneNumberChangeHandler = (event) => {
    setphoneNumber(event.target.value);
  };
  const categoryChangeHandler = (event) => {
    setcategory(event.target.value);
  };
  const genderChangeHandler = (event) => {
    setgender(event.target.value);
  };
  const passwordChangeHandler = (event) => {
    setpassword(event.target.value);
  };
  const cpasswordChangeHandler = (event) => {
    setcpassword(event.target.value);
  };
  const imageChangeHandler = (event) => {
    setimage(event.target.value);
  };
  const addressChangeHandler = (event) => {
    setaddress((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const baseURL = `/api/v1/${
      category[0].toLowerCase() + category.slice(1) + "s"
    }`;
    const res = await fetch(`${baseURL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        middleName,
        emailId,
        password,
        confirmPassword,
        phoneNumber,
        category,
        gender,
        address,
      }),
    });
    const data = await res.json();
    if (data.status === "success") {
      console.log("User Registered Successfully!");
      navigate(`${baseURL}/homepage`);
    } else {
      console.log("User Registration UnSuccessfull!");
      navigate(`/`);
    }
    console.log(data);

    const user = {
      firstName,
      middleName,
      lastName,
      emailId,
      phoneNumber,
      category,
      gender,
      password,
      confirmPassword,
      address,
      image,
    };
    console.log(user);

    // Lifting the state-up
    props.onSaveUserData(user);
    // setfirstName("");
    // setmiddleName("");
    // setlastName("");
    // setemailId("");
    // setphoneNumber("");
    // setcategory("Student");
    // setgender("Male");
    // setpassword("");
    // setcpassword("");
    // setimage("");
    // setaddress({addressStreet: "",
    // city: "",
    // state: "",
    // country: "",
    // pinCode: 0,})
  };

  return (
    <div>
      <form method="POST" onSubmit={formSubmitHandler}>
        <h1>Signup Form</h1>
        <div>
          <label htmlFor="firstName">FirstName</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="your_firstname"
            required
            onChange={firstNameChangeHandler}
            value={firstName}
          ></input>
        </div>
        <div>
          <label htmlFor="middleName">MiddleName</label>
          <input
            type="text"
            id="middleName"
            name="middleName"
            placeholder="your_middlename"
            onChange={middleNameChangeHandler}
            value={middleName}
          ></input>
        </div>
        <div>
          <label htmlFor="lastName">LastName</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="your_lastname"
            required
            onChange={lastNameChangeHandler}
            value={lastName}
          ></input>
        </div>
        <div>
          <label htmlFor="email">EmailId</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="your_emailID"
            required
            onChange={emailIdChangeHandler}
            value={emailId}
          ></input>
        </div>
        <div>
          <label htmlFor="phoneNumber">PhoneNumber</label>
          <input
            type="number"
            id="phoneNumber"
            name="phoneNumber"
            maxLength="10"
            minLength="10"
            min="1000000000"
            max="9999999999"
            placeholder="your_phonenumber"
            required
            onChange={phoneNumberChangeHandler}
            value={phoneNumber}
          ></input>
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id="category"
            onChange={categoryChangeHandler}
            value={category}
          >
            <option value="OrganizationHead">OrganizationHead</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
          </select>
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <select
            name="gender"
            id="gender"
            onChange={genderChangeHandler}
            value={gender}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="your_password"
            required
            onChange={passwordChangeHandler}
            value={password}
          ></input>
        </div>
        <div>
          <label htmlFor="confirmPassword">ConfirmPassword</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="your_confirmpassword"
            required
            onChange={cpasswordChangeHandler}
            value={confirmPassword}
          ></input>
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <label htmlFor="street">Street</label>
          <input
            type="text"
            id="street"
            name="street"
            required
            onChange={addressChangeHandler}
            value={address.addressStreet}
            placeholder="street"
          ></input>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            required
            onChange={addressChangeHandler}
            value={address.city}
            placeholder="city"
          ></input>
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            required
            onChange={addressChangeHandler}
            value={address.state}
            placeholder="state"
          ></input>
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            required
            onChange={addressChangeHandler}
            value={address.country}
            placeholder="country"
          ></input>
          <label htmlFor="pinCode">PinCode</label>
          <input
            type="number"
            id="pinCode"
            name="pinCode"
            required
            onChange={addressChangeHandler}
            value={address.pinCode}
            placeholder="pinCode"
          ></input>
        </div>
        <div>
          <label htmlFor="photo">Image</label>

          <input
            type="file"
            id="photo"
            name="photo"
            required
            onChange={imageChangeHandler}
            value={image}
          ></input>
        </div>

        <div>
          <button>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
