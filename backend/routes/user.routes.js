import { Router } from "express";
import {
  acceptConnectionRequest,
  commentPost,
  downloadProfile,
  getAllUserProfile,
  getMyConnectionRequest,
  getUserAndProfile,
  getUserProfileAndUserBasedOneUsername,
  login,
  register,
  sendConnectionRequest,
  updateUserProfile,
  uploadProfilePicture,
  whatAreMyConnections,
} from "../controllers/user.controller.js";
import multer from "multer";
import path from "path";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateUserProfile);
router.route("/get_all_users").get(getAllUserProfile);
router.route("/comment").post(commentPost)
router.route("/download_resume").get(downloadProfile);
router.route("/send_connection_request").post(sendConnectionRequest);
router.route("/getConnectionRequest").get(getMyConnectionRequest);
router.route("/user_connection_request").get(whatAreMyConnections);
router.route("/accept_connection_request").post(acceptConnectionRequest);
router.route("/get_profile_based_on_username").get(getUserProfileAndUserBasedOneUsername);

export default router;
