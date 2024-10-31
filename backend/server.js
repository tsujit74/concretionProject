import express from "express";

import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import postRoutes from './routes/posts.routes.js'
import userRoutes from './routes/user.routes.js'
const uri = process.env.ATLAS_DB;

const app = express();
app.use(cors())
app.use(express.json());


app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use(express.static("uploads"));


const start = async () => {
  try {
    await mongoose.connect(uri, {
    });
    console.log(`MongoDB Connected`);
    app.listen(5500, () => {
      console.log("App listening at port 5500");
    });
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

start();

