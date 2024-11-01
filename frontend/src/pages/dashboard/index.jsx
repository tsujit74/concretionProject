import { getAboutUser, getAllUsers } from "@/config/action/authAction";
import {
  createPost,
  deletePost,
  getAllComments,
  getAllPosts,
  incrementLike,
  postComment,
} from "@/config/action/postAction";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashbordLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { BASE_URL } from "@/config";
import { resetPostId } from "@/config/reducer/postReducer";
import BackButton from "@/Components/Backbutton";
import Spinner from "@/Components/Spinner";
import FlagMessage from "@/Components/Flashmessage";
import { setFlashMessage } from "@/config/reducer/flashMessage";

export default function Dashboard({ children }) {
  const router = useRouter();

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const postState = useSelector((state) => state.posts);

  useEffect(() => {
    // Check if token is there and not loading posts
    if (authState.isTokenThere && !authState.all_posts_fetched) {
      setIsLoading(true);
      dispatch(getAllPosts())
        .catch((error) => console.error("Error fetching posts:", error))
        .finally(() => setIsLoading(false));
    }
  
    // Fetch user profile information if token is present
    if (authState.isTokenThere && !authState.user_fetched) {
      setIsLoading(true);
      dispatch(getAboutUser({ token: localStorage.getItem("token") }))
        .catch((error) => console.error("Error fetching user profile:", error))
        .finally(() => setIsLoading(false));
    }
  
    // Fetch all user profiles if they haven’t been fetched yet
    if (!authState.all_profiles_fetched) {
      setIsLoading(true);
      dispatch(getAllUsers())
        .catch((error) => console.error("Error fetching user profiles:", error))
        .finally(() => setIsLoading(false));
    }
  }, [authState.isTokenThere, authState.all_posts_fetched, authState.user_fetched, authState.all_profiles_fetched]);
  

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handUpload = async () => {
    setIsLoading(true);

    try {
      await dispatch(
        createPost({ file: fileContent, body: postContent })
      ).unwrap();
      dispatch(
        setFlashMessage({
          message: "Post created successfully!",
          type: "success",
        })
      );

      setFileContent(null);
      setPostContent("");

      await dispatch(getAllPosts()).unwrap();
    } catch (error) {
      const errorMessage =
        error.message || "Failed to upload post. Please try again.";
      console.error("Error uploading post:", errorMessage);

      dispatch(setFlashMessage({ message: errorMessage, type: "error" }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    setIsLoading(true);

    try {
      await dispatch(deletePost({ post_id: postId }));
      dispatch(
        setFlashMessage({
          message: "Post deleted successfully!",
          type: "success",
        })
      );

      await dispatch(getAllPosts());
    } catch (error) {
      const errorMessage =
        error.message || "Failed to delete post. Please try again.";
      console.error("Error deleting post:", errorMessage);
      dispatch(setFlashMessage({ message: errorMessage, type: "error" }));
    } finally {
      setIsLoading(false);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return "Just now";
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <FlagMessage />
          {isLoading && <Spinner />}
          {authState.profileFetched && authState.user ? (
            <div className={styles.postContainer}>
              <div className={styles.createPostComponent}>
                {authState.user.userId.profilePicture === "default.jpg" ? (
                  <img
                    src="/images/default.jpg"
                    alt="user"
                    className={styles.profileImage}
                  />
                ) : (
                  <img
                    src={authState.user.userId.profilePicture}
                    alt={`${authState.user.userId.username}'s profile`}
                    className={styles.profileImage}
                  />
                )}
                <div className={styles.inputContainer}>
                  <textarea
                    onChange={(e) => setPostContent(e.target.value)}
                    value={postContent}
                    className={styles.textArea}
                    placeholder="What's on your mind?"
                  ></textarea>
                </div>
                <label htmlFor="fileUpload" className={styles.fileLabel}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </label>
              </div>
              {postContent.length > 0 && (
                <div className={styles.uploadOptions}>
                  <input
                    type="file"
                    id="fileUpload"
                    className={styles.fileInput}
                    style={{ display: "none" }}
                    onChange={(e) => setFileContent(e.target.files[0])}
                  />
                  <div
                    style={{ zIndex: 9 }}
                    onClick={handUpload}
                    className={styles.uploadButton}
                  >
                    Post
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Spinner />
          )}

          {authState.profileFetched && authState.user ? (
            <div
              className={styles.postsContainer}
              style={{ opacity: isLoading ? 0.5 : 1 }}
            >
              {postState.posts.map((post) => (
                <div key={post._id} className={styles.postCard}>
                  <div className={styles.postHeader}>
                    {post.userId ? (
                      post.userId.profilePicture === "default.jpg" ? (
                        <img
                          src="/images/default.jpg"
                          alt="user"
                          className={styles.profileImage}
                        />
                      ) : (
                        <img
                          src={post.userId.profilePicture}
                          alt={`${post.userId.username || "User"}'s profile`}
                          className={styles.profileImage}
                        />
                      )
                    ) : (
                      <img
                        src="/images/default.jpg"
                        alt="user"
                        className={styles.profileImage}
                      />
                    )}
                    <div className={styles.postUserInfo}>
                      {post.userId ? (
                        <>
                          <h4 className={styles.username}>
                            {post.userId.name}
                          </h4>
                          <div>
                            <p className={styles.name}>
                              {post.userId.username}
                            </p>
                            <p className={styles.timestamp}>
                              {timeAgo(post.createdAt)}
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className={styles.username}>User</p>
                      )}
                    </div>

                    {post.userId &&
                      post.userId._id &&
                      authState.user &&
                      authState.user.userId &&
                      post.userId._id === authState.user.userId._id && (
                        <div
                          onClick={async () => {
                            handleDeletePost(post._id);
                          }}
                          className={styles.trash}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="red"
                            width="24"
                            height="24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </div>
                      )}
                  </div>

                  <p className={styles.postDescription}>{post.body}</p>

                  {post.media && (
                    <img src={post.media} alt="" className={styles.postImage} />
                  )}

                  <div
                    style={{ padding: "6px", fontSize: "12px" }}
                    className={styles.count}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      className={styles.count}
                    >
                      <p>{post.likes}</p>
                      {/* <p>{postState.comments.length}</p> */}
                      <p></p>
                    </div>
                  </div>
                  <hr />
                  <div className={styles.postActions}>
                    <div
                      onClick={async () => {
                        await dispatch(incrementLike({ post_id: post._id }));
                        dispatch(getAllPosts());
                      }}
                      className={styles.actionButton}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="black"
                        width="24"
                        height="24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                        />
                      </svg>
                    </div>

                    <div
                      onClick={async () => {
                        await dispatch(getAllComments({ post_id: post._id }));
                      }}
                      className={styles.actionButton}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="black"
                        width="24"
                        height="24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                        />
                      </svg>
                    </div>

                    <div
                      onClick={() => {
                        const text = encodeURIComponent(post.body);
                        const url = encodeURIComponent("tsujit.in");

                        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                        window.open(twitterUrl, "_blank");
                      }}
                      className={styles.actionButton}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="black"
                        width="24"
                        height="24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>data loading...</p>
          )}
        </div>
      </DashboardLayout>

      {postState.postId !== "" && (
        <div
          onClick={() => {
            dispatch(resetPostId());
          }}
          className={styles.commentContainer}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={styles.allCommentsContainer}
          >
            <div className={styles.postedComment}>
              {postState.comments.length > 0 ? (
                postState.comments.map((postComment) => (
                  <div
                    key={postComment._id}
                    className={
                      postComment.userId.username ===
                      authState.user.userId.username
                        ? `${styles.commentItem} ${styles.commentRight}`
                        : `${styles.commentItem} ${styles.commentLeft}`
                    }
                  >
                    <p>
                      <strong>
                        {postComment.userId.username ===
                        authState.user.userId.username
                          ? `You (${authState.user.userId.name})`
                          : postComment.userId.username}
                        :
                      </strong>
                    </p>
                    <p>{postComment.body}</p>
                  </div>
                ))
              ) : (
                <h3>No comments</h3>
              )}
            </div>

            <div className={styles.postCommentContainer}>
              <input
                type="text"
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Comment"
              />
              <div
                onClick={async () => {
                  await dispatch(
                    postComment({
                      post_id: postState.postId,
                      body: commentText,
                    })
                  );
                  await dispatch(getAllComments({ post_id: postState.postId }));
                  setCommentText("");
                }}
                className={styles.commentContainer_button}
              >
                <p>Comment</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
