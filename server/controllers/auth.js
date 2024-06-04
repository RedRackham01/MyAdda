import jwt from "jsonwebtoken";
import userModel from "../models/User.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";

/* REGISTER USER */
export const registerController = async (req, res) => {
  try {
    const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;

    //validations
    if (!firstName) {
      return res.send({ error: "First Name is Required" });
    }
    if (!lastName) {
      return res.send({ error: "Last Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }

    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).json({ error: "Already Registerd. Please Login." });
    }

    //register new user
    const hashedPassword = await hashPassword(password);
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({msg: "Invalid email or password"});
    }
    //check user
    const user = await userModel.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
    
    //token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{expiresIn:"3d"});
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
