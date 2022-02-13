const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "FirstName must be present"],
      trim: true,
      // lowercase: true,
    },
    middleName: {
      type: String,
      default: "",
      trim: true,
      // lowercase: true,
    },
    lastName: {
      type: String,
      required: [true, "LastName must be present"],
      trim: true,
      // lowercase: true,
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
      // required: [true, "PhoneNumber must be present"],
      // unique: true,
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    address: {
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
    },
    gender: {
      type: String,
      // required: [true, "Gender must be present"],
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
        values: ["Teacher", "Student", "Admin", "OrganizationHead"],
        message:
          "Category should be: Teacher,Student,OrganizationHead or Admin",
      },
    },
    organizations: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Organization",
      },
    ],
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL PROPERTIES
// 1) NEVER PERSIST IN DATABASE
// 2) WORK IN GET METHOD
// 3) CAN'T QUERY WITH THESE PROPERTIES
// 4) VIRTUAL PROPERTY CREATE EACH TIME WHEN WE GET SOME DATA FROM THE DATABASE
// 5) VIRTUAL FUNCTION ALWAYS USE REGULAR FUNCTION{NOT ARROW FUNCTION} CALL AS IT USE THE <this> KEYWORD OF JAVASCRIPT
userSchema.virtual("fullName").get(function () {
  if (!this.middleName) return `${this.firstName} ${this.lastName}`;
  else {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  }
});

// Note: If you specify schema.pre('remove'), Mongoose will register this middleware for doc.remove() by default. If you want to your middleware to run on Query.remove() use schema.pre('remove', { query: true, document: false }, fn).

// Mongoose Document Middleware

// THIS MIDDLEWARE RUN ONLY ON .save() and .create()
userSchema.pre("save", function (next) {
  this.firstName =
    this.firstName.charAt(0).toUpperCase() +
    "" +
    this.firstName.slice(1).toLowerCase();
  this.middleName =
    this.middleName.charAt(0).toUpperCase() +
    "" +
    this.middleName.slice(1).toLowerCase();
  this.lastName =
    this.lastName.charAt(0).toUpperCase() +
    "" +
    this.lastName.slice(1).toLowerCase();
  const capitalize = (val) => {
    return val
      .replace(/[^A-Za-z]+/g, " ")
      .split(" ")
      .map((el) => el.charAt(0).toUpperCase() + "" + el.slice(1).toLowerCase())
      .join(" ");
  };
  this.address.state = capitalize(this.address.state);
  this.address.city = capitalize(this.address.city);
  this.address.country = capitalize(this.address.country);
  next();
});

// PASSWORD ENCRYPTION MIDDLEWARE
userSchema.pre("save", async function (next) {
  // RUN ONLY WHEN PASSWORD IS UPDATED or USER SIGNUP
  if (!this.isModified("password")) return next();
  // ENCRYPT THE PASSWORD
  this.password = await bcrypt.hash(this.password, 12);
  // NO NEED TO PERSIST confirmPassword in DATABASE
  this.confirmPassword = undefined;
});

// CREATE PASSWORD CHANGED PROPERTY
userSchema.pre("save", function (next) {
  // USE isNew PROPERTY TO KNOW WHETHER DOCUMENT IS NEWLY CREATED OR NOT
  if (!this.isModified("password") || !this.isNew) return next();
  // SUBTRACT 1 SEC B'COZ SOMETIMES THERE IS A DELAY TO SAVE PROPERTY IN DATABASE
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// REMOVE ALL THE USERS WHO ARE NOT ACTIVE
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// ADD ALL THE ORGANIZATIONS TO CORRESPONDING USERS
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "organizations",
    select: "-__v  -district  -state -pinCode",
  });
  next();
});

// -------------------------AGGREGATION MIDDLEWARE------------------

userSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { active: { $ne: false } } });
  next();
});
// INSTANCE METHODS

// MATCH YOUR PASSWORD WITH THE PASSWORD SAVE IN DATABASE
userSchema.methods.checkPasswordMatch = function (
  candidatePassword,
  userPassword
) {
  // NOT USE this.password as, {select:false} in schema
  return bcrypt.compare(candidatePassword, userPassword);
};

// CHECK PASSWORD CHANGED TIME
userSchema.methods.checkPasswordChangedAt = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

// CREATE TOKEN WHEN PASSWORD IS RESET
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
