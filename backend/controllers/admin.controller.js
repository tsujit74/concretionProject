import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Admin page running" });
};

export const getUsers = async (req, res) => {
  if (!req.isAdmin) {
    return res.status(500).json({ message: "Acess denied" });
  }
  try {
    const users = await User.find({}, "name username email role");
    return res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Some thng went worng" });
  }
};

export const deleteUser = async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    await Profile.deleteOne({ userId: userId });
    res.status(200).json({ message: "User deleted Sucessfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const editUser = async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  try {
    const { name, username, email, role } = req.body;
    const userId = req.params.id;

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { name, username, email,role },
      { new: true }
    );
    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updateUser });
  } catch (error) {
    return res.status(500).json({ message: "Not Updated" });
  }
};
