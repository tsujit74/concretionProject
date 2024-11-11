import {
  getAboutUser,
  getMyConnectionsRequest,
} from "@/config/action/authAction";
import DashboardLayout from "@/layout/DashbordLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { BASE_URL, clientServer } from "@/config";
import { getAllPosts } from "@/config/action/postAction";
import { useRouter } from "next/router";
import BackButton from "@/Components/Backbutton";
import FlagMessage from "@/Components/Flashmessage";
import Spinner from "@/Components/Spinner";
import { setFlashMessage } from "@/config/reducer/flashMessage";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
    dispatch(getMyConnectionsRequest({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    setUserProfile(authState.user);
    if (authState.user && authState.profile_fetched) {
      let post = postState.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });
      setUserPosts(post);
    }
  }, [authState.user, postState.posts]);

  const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    try {
      setIsLoading(true);
      const response = await clientServer.post(
        "api/users/update_profile_picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
        dispatch(
          setFlashMessage({ message: "Profile Photo uploaded", type: "sucess" })
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      dispatch(setFlashMessage({ message: error, type: "error" }));
    }
  };

  return (
    <UserLayout>
      <FlagMessage />
      <DashboardLayout>
        <div style={{ display: "flex", alignItems: "center" }}>
          <BackButton />{" "}
          <div style={{ margin: "0 auto", fontWeight: "bold" }}>
            {userProfile.userId ? <p>{userProfile.userId.name}</p>:<p></p>}
          </div>
        </div>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <label
                htmlFor="uploadProfilePic"
                className={styles.backDrop_overlay}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </label>
              <input
                onChange={(e) => {
                  uploadProfilePicture(e.target.files[0]);
                }}
                type="file"
                id="uploadProfilePic"
                hidden
              />
              {userProfile.userId.profilePicture === "default.jpg" ? (
                <div>
                  <img
                    src="images/default.jpg"
                    alt="user"
                    className={styles.profileImage}
                  />
                </div>
              ) : (
                <img
                  src={userProfile.userId.profilePicture}
                  alt={`${userProfile.userId.username}'s profile`}
                  className={styles.profileImage}
                />
              )}
            </div>

            <div className={styles.profileContainer_details}>
              {isLoading && <Spinner />}
              <div
                style={{justifyContent:"space-between", gap: "0.7rem",alignItems:"center" }}
                className={styles.details}
              >
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "fit-content",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <div>
                    <h2>{userProfile.userId.name}</h2>
                    <p style={{ color: "gray" }}>
                      @{userProfile.userId.username}
                    </p>
                    </div>
                  </div>
                  <div>
                    <button
                      className={styles.editBtn}
                      onClick={() => router.push("/form")}
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* <div
                  style={{ flex: "0.2" }}
                  className={styles.recentActivityContainer}
                >
                  <h3 className={styles.recentActivityTitle}>Recent</h3>
                  {userPosts.map((post) => (
                    <div key={post._id} className={styles.PostCard}>
                      <div className={styles.card}>
                        <div className={styles.cardProfileContainer}>
                          {post.media !== "" ? (
                            <img
                              src={`${BASE_URL}/${post.media}`}
                              alt="post media"
                            />
                          ) : null}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  ))}
                </div> */}
              </div>
            </div>

            <div className={styles.myNetwork}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "2px",
                }}
              >
                <div>
                  <h4
                    onClick={() => {
                      router.push("/myconnection");
                    }}
                  >
                    Friends
                  </h4>
                  <p>{authState.connectionRequest.length} friends</p>
                </div>
                <div>
                  <p
                    onClick={() => {
                      router.push("/discover");
                    }}
                    style={{ color: "darkblue" }}
                  >
                    Find Friends
                  </p>
                </div>
              </div>
              {authState.connectionRequest &&
              authState.connectionRequest.length !== 0 ? (
                authState.connectionRequest
                  .filter((connection) => connection.status_accepted !== null)
                  .map((user) => (
                    <div
                      key={user._id}
                      onClick={() => {
                        router.push(`/view_profile/${user.userId.username}`);
                      }}
                      className={styles.userProfileCard_friend}
                    >
                      {user.userId.profilePicture === "default.jpg" ? (
                        <img
                          src="images/default.jpg"
                          alt="You"
                          className={styles.profileImage_friend}
                        />
                      ) : (
                        <img
                          src={user.userId.profilePicture}
                          alt={`${user.userId.username}'s profile`}
                          className={styles.profileImage_friend}
                        />
                      )}
                      <div className={styles.cardContent}>
                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p>No Friends found</p>
              )}
            </div>

            {/* Education Section */}
            <div className={styles.userDetails}>
              {/* Bio Section */}
              <div className={styles.bio}>
                <h2 className={styles.sectionTitle}>Bio</h2>
                <p className={styles.bioText}>
                  {userProfile.bio || "No bio available."}
                </p>
              </div>

              {/* Work Experience Section */}
              <div className={styles.postWork}>
                <h2 className={styles.sectionTitle}>Work Experience</h2>
                {userProfile.postWork.length > 0 ? (
                  <div className={styles.workList}>
                    {userProfile.postWork.map((work) => (
                      <div className={styles.workCard} key={work._id}>
                        <h3 className={styles.position}>{work.position}</h3>
                        <p className={styles.company}>{work.company}</p>
                        <p className={styles.years}>{work.years} years</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.placeholder}>
                    No work experience listed.
                  </p>
                )}
              </div>

              {/* Education Section */}
              <div className={styles.education}>
                <h2 className={styles.sectionTitle}>Education</h2>
                {userProfile.education.length > 0 ? (
                  <div className={styles.educationList}>
                    {userProfile.education.map((edu) => (
                      <div className={styles.educationCard} key={edu._id}>
                        <h3 className={styles.school}>{edu.school}</h3>
                        <p className={styles.degree}>
                          {edu.degree} in {edu.fieldOfStudy}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.placeholder}>
                    No education details available.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
