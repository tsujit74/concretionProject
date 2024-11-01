import { Router } from "express";
import {
  activeCheck,
  createPost,
  delete_comment_of_user,
  deletePost,
  get_comments_by_post,
  increment_likes,
} from "../controllers/posts.controller.js";
import multer from "multer";
import { getAllPosts } from "../controllers/posts.controller.js";
import { postStorage } from "../cloudConfig.js";
const router = Router();

const upload = multer({ storage:postStorage }).single("media");

router.post(
  "/post",
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
  createPost
);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delte_comments").post(delete_comment_of_user);
router.route("/increment_post_likes").post(increment_likes);

export default router;
