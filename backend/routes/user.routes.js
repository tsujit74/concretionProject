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
import { userStorage } from "../cloudConfig.js";

const router = Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); 
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

const upload = multer({ storage: userStorage }).single("profile_picture");

router.post(
  "/update_profile_picture",
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res
          .status(500)
          .json({ message: "Multer upload error", error: err.message });
      } else if (err) {
        console.error("Unknown error:", err.message);
        return res
          .status(500)
          .json({ message: err.message, error: err.message });
      }
      next();
    });
  },
 uploadProfilePicture
);


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
