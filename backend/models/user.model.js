import mongoose from "mongoose";
import Profile from "./profile.model.js";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "default.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  token: {
    type: String,
    default: "",
  },
  role: { type: String, default: 'user' }
});

UserSchema.pre('remove', async function (next) {
  try {
    await Profile.findOneAndDelete({ userId: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const User  = mongoose.model("User",UserSchema);
export default User;
