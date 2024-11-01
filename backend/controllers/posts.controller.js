import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Running" });
};

export const createPost = async (req, res) => {
  const { token, body } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body,
      media: req.file ? req.file.path : '', 
      fileType: req.file ? req.file.mimetype.split('/')[1] : '',
    });

    await post.save();
    return res.status(200).json({ message: "Post created successfully", post });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create post", error: error.message });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    // Fetch user using the token and await the result
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User Not found" });
    }

    // Fetch the post using the Post model and await the result
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post Not found" });
    }

    // Check if the user is the owner of the post
    if (post.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete the post
    await Post.deleteOne({ _id: post_id });
    return res.json({ message: "Post Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.query;

  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ postId: post_id }).populate(
      "userId",
      "username name"
    );

    return res.json(comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const delete_comment_of_user = async (req, res) => {
  const { token, comment_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User Not found" });
    }

    const comment = await Comment.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(404).json({ message: "Comment Not found" });
    }
    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(404).json({ message: "Unauthorized" });
    }

    await comment.deleteOne({ _id: comment_id });
    return res.status(200).json({ message: "Comment Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const increment_likes = async (req, res) => {
  const { post_id } = req.body;
  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not Found" });
    }

    post.likes = post.likes + 1;
    await post.save();
    return res.json({ message: "Liked" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
