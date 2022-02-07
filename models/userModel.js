const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  addressStreet: {
    type: String,
    required: [true, "Address must be present"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "City must be required"],
    trim: true,
  },
  state: {
    type: String,
    required: [true, "State must be required"],
    trim: true,
  },
  pinCode: {
    type: Number,
    required: [true, "Pincode must be required"],
    validate: {
      validator: function (value) {
        return value.toString().length === 6;
      },
      message: "pinCode must be of 6 digits",
    },
  },
  country: {
    type: String,
    required: [true, "Country must be present"],
    trim: true,
  },
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "FirstName must be present"],
    trim: true,
  },
  middleName: {
    type: String,
    default: "",
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "LastName must be present"],
    trim: true,
  },
  emailId: {
    type: String,
    required: [true, "EmailId must be present"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "please provide valid emailId"],
  },
  phoneNumber: {
    type: Number,
    required: [true, "PhoneNumber must be present"],
    unique: true,
    validate: {
      validator: function (value) {
        // if use this keyword then this only use to current doc on NEW DOCUMENT CREATION
        return value.toString().length === 10;
      },
      message: "phoneNumber must be of 10 digits",
    },
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false, //NOT FETCH PASSWORD WITH ALL USER DATA
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // THIS ONLY WORKS ON CREATE and SAVE!!!!!
      // NOT WORK WITH REGULAR UPDATE
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not same",
    },
  },
  address: addressSchema,
  gender: {
    type: String,
    required: [true, "Gender must be present"],
    trim: true,
    enum: {
      values: ["Male", "Female", "Others"],
      message: "Gender should be: Male, Female or Others",
    },
  },
  category: {
    type: String,
    required: [true, "category must be required"],
    trim: true,
    enum: {
      values: ["Teacher", "Student", "Admin", "Others"],
      message: "Category should be: Teacher,Student,Admin or Others",
    },
  },
});

// Mongoose Document Middleware
userSchema.pre("save", async function (next) {
  // RUN ONLY WHEN PASSWORD IS UPDATED or USER SIGNUP
  if (!this.isModified("password")) return next();
  // ENCRYPT THE PASSWORD
  this.password = await bcrypt.hash(this.password, 12);
  // NO NEED TO PERSIST confirmPassword in DATABASE
  this.confirmPassword = undefined;
});

// INSTANCE METHOD
userSchema.methods.checkPasswordMatch = function (
  candidatePassword,
  userPassword
) {
  // NOT USE this.password as, {select:false} in schema
  return bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
