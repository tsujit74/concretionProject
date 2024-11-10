import dotenv from "dotenv";

dotenv.config();
import nodemailer from "nodemailer";

import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";
import Comment from "../models/comments.model.js";
import Post from "../models/posts.model.js";
import { connections } from "mongoose";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Running" });
};

const convertUserDataTOPDF = async (userData) => {
  if (!userData || !userData.userId) {
    throw new Error("User data is not available.");
  }

  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

  if (userData.userId.profilePicture) {
    doc.image(`uploads/${userData.userId.profilePicture}`, {
      align: "center",
      width: 100,
      x: 50,
      y: 40,
    });
    doc.moveDown(5);
  } else {
    console.warn("Profile picture not available.");
  }
  doc.moveTo(500, 200);
  doc.fontSize(14).text(`Name: ${userData.userId.name || "N/A"}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username || "N/A"}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email || "N/A"}`);
  doc.fontSize(14).text(`Bio: ${userData.userId.bio || "N/A"}`);
  doc
    .fontSize(14)
    .text(`Current Position: ${userData.userId.postWork || "N/A"}`);

  if (Array.isArray(userData.postWork) && userData.postWork.length > 0) {
    doc.fontSize(14).text("Past Work");
    userData.postWork.forEach((work, index) => {
      doc.fontSize(14).text(`Company Name: ${work.company || "N/A"}`);
      doc.fontSize(14).text(`Position: ${work.position || "N/A"}`);
      doc.fontSize(14).text(`Years: ${work.years || "N/A"}`);
    });
  } else {
    doc.fontSize(14).text("No past work information available.");
  }

  doc.end();

  return outputPath;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Thank You for Registering!",
      text: `Welcome ${name},\nThank you for joining CONCERTION! We’re thrilled to have you in our community. Your choice to be a part of our platform means a lot to us, and we’re committed to providing you with an exceptional experience.\nWhether you're here to network, build friendships, or share experiences, we're excited to accompany you on this journey of connection. If you have any questions or need assistance, please don’t hesitate to reach out.\nWelcome to the CONCERTION family! Let’s create meaningful connections together!\n\nBest Regards,\nThe CONCERTION Team`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      message: "User registered successfully and email sent!",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Welcome Back!",
      text: `Welcome back, ${email}!\nWe're glad to see you again! If you haven’t changed your password recently, we encourage you to do so for added security. Your account safety is important to us!\nIf you have any questions or need assistance, feel free to reach out.\n\nBest Regards,\nThe CONCERTION Team`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ token, user: {
      username: user.username,
      email: user.email,
      name:user.name,
      profilePicture,
    }, });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    user.profilePicture = req.file.path;
    await user.save();

    return res.json({ message: "Profile picture updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { email, token, ...newUserData } = req.body;

    // Validate token and get user ID

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      // If no profile, create one
      const newProfile = new Profile({ userId: user._id, ...newUserData });
      await newProfile.save();
      return res.json({ message: "Profile created and user updated" });
    }

    // Update existing profile
    Object.assign(profile, newUserData);
    await profile.save();
    return res.json({ message: "Profile updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture role"
    );

    return res.json(userProfile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;
    const userProfile = await User.findOne({ token: token });
    if (!userProfile) {
      return res.status(404).json({ message: "User not Found" });
    }
    const profile_to_update = await Profile.findOne({
      userId: userProfile._id,
    });

    Object.assign(profile_to_update, newProfileData);

    await profile_to_update.save();
    return res.json("Profile Updated Sucessfully");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json(profiles);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;
    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name email username profilePicture bio currentPost"
    );
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found." });
    }
    const outputPath = await convertUserDataTOPDF(userProfile);
    return res.json({ message: outputPath });
  } catch (error) {
    console.error("Error generating profile PDF:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while generating the PDF." });
  }
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection User not Found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request Already sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();
    return res.json({ message: "Request Sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnectionRequest = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");

    return res.json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const whatAreMyConnections = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({ connectionId: user._id })
      .populate("userId", "name username email profilePicture") // Populates the sender's details
      .populate("connectionId", "name username email profilePicture"); // Populates the recipient's details

    return res.json(connections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const connection = await ConnectionRequest.findOne({ _id: requestId });
    if (!connection) {
      return res.status(404).json({ message: "Connection not Found" });
    }

    connection.status_accepted = action_type === "true";
    await connection.save();

    return res.json({ message: "Request Accepted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: post_id }); // Await and Post model
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!commentBody) {
      return res.status(400).json({ message: "Comment body is required" });
    }

    const comment = new Comment({
      userId: user._id,
      postId: post_id,
      body: commentBody,
    });

    await comment.save();
    return res.status(200).json({ message: "Comment added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserProfileAndUserBasedOneUsername = async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.staus(404).json({ message: "User Not found" });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );

    return res.json({ Profile: userProfile });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Please fill in all the fields." });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Contact from ${name}`,
    text: message,
    replyTo: email,
  };

  const userReplyOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Thank you for contacting us, ${name}`,
    text: `Dear ${name},\n\nThank you for reaching out. We have received your message and will get back to you shortly.\n\n\nBest regards,\nApna Video Team`,
  };

  try {
    await transporter.sendMail(mailOptions);

    await transporter.sendMail(userReplyOptions);
    return res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(404)
      .json({ message: "Error sending message. Please try again.." });
  }
};

export const search = async (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    return res.status(400).json({ message: "Search query is required" });
  }

  const searchReg = new RegExp(searchQuery, "i");

  try {
    const users = await User.find({
      $or: [{ username: searchReg }, { name: searchReg }],
    }).select("username name profilePicture");
    return res.status(200).json(users);
  } catch (err) {
    console.error("Error during user search:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// export const editUser = async (req,res) => {
//   const {name,email,token,...userData} = req.body;

//   const user = await User.findOne({token:token})

// }
