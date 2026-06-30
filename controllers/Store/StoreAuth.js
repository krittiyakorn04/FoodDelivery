const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1 Validate body
    if (!email) {
        return res.status(400).json("Email is require!!!")
    }
    if (!password) {
        return res.status(400).json("password is require!!!")
    }

    // Step 2 Check Email in DB already ?
    

    console.log(email,password)
    res.send("Hello Restau Register");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.login = (req, res) => {
  try {
    res.send("Hello Restau Login");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.currentRestau = (req, res) => {
  try {
    res.send("Hello Current Restau");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
