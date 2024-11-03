import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js'


dotenv.config();
const uri = process.env.ATLAS_DB;


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin",adminRoutes);

// app.use(express.static("uploads"));


const start = async () => {
  try {

    await mongoose.connect(uri, {
      
    });
    console.log(`MongoDB Connected`);

    const PORT = process.env.PORT || 5500;
    app.listen(PORT, () => {
      console.log(`App listening at port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});


start();
