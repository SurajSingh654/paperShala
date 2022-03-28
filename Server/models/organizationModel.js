const mongoose = require("mongoose");
const organizationSchema = new mongoose.Schema(
  {
    organizationHead: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      unique: [true, "You are able to add only one organization"],
    },
    organizationName: {
      type: String,
      trim: true,
      required: [true, "Organization name must be present"],
      unique: true,
    },
    district: {
      type: String,
      trim: true,
      required: [true, "District must be present"],
    },
    state: {
      type: String,
      trim: true,
      required: [true, "State must be present"],
    },
    country: {
      type: String,
      trim: true,
      required: [true, "Country must be present"],
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
    photo: String,
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

organizationSchema.pre("save", function (next) {
  const capitalize = (val) => {
    return val
      .replace(/[^A-Za-z]+/g, " ")
      .split(" ")
      .map((el) => el.charAt(0).toUpperCase() + "" + el.slice(1).toLowerCase())
      .join(" ");
  };
  this.organizationName = capitalize(this.organizationName);
  this.district = capitalize(this.district);
  this.state = capitalize(this.state);
  this.country = capitalize(this.country);
  next();
});

// GET ALL THE DETAILS OF ORGANIZATIONS OF CURRENT USER
const Organization = mongoose.model("Organization", organizationSchema);
module.exports = Organization;
