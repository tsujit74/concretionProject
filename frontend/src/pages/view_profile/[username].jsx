import { BASE_URL, clientServer } from "@/config";
import UserLayout from "@/layout/UserLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Dashboard from "../dashboard";
import DashboardLayout from "@/layout/DashbordLayout";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { getAllPosts } from "@/config/action/postAction";
import { useDispatch, useSelector } from "react-redux";
import {
  getAboutUser,
  getConnectionsRequest,
  getMyConnectionsRequest,
  sendConnectionRequest,
} from "@/config/action/authAction";
import BackButton from "@/Components/Backbutton";

export default function ViewProfilePage({ userProfile }) {
  const searchParamers = useSearchParams();

  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUserPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(
      getConnectionsRequest({ token: localStorage.getItem("token") })
    );
    await getMyConnectionsRequest({ token: localStorage.getItem("token") });
  };

  useEffect(() => {
    let post = postState.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(post);
  }, [postState.posts]);

  useEffect(() => {
    if (
      authState.connections &&
      authState.connections.some(
        (user) => user.connectionId._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connections.find(
          (user) => user.connectionId._id === userProfile.userId._id
        ).status_accepted === true
      ) {
        setIsConnectionNull(false);
      }
    }
  }, [authState.connections]);

  useEffect(() => {
    getUserPost();
  }, []);

  const handleDownload = async () => {
    try {
      const response = await clientServer.get(
        `api/users/download_resume?id=${userProfile.userId._id}`
      );
      window.open(`${BASE_URL}/${response.data.message}`, "_blank");
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert("An error occurred while downloading the resume. Please try again later.");
    }
  };
  

  return (
    <UserLayout>
      <DashboardLayout>
        <BackButton/>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
          {userProfile.userId.profilePicture === "default.jpg" ? (
                <img
                  src="/images/default.jpg"
                  alt="You"
                  className={styles.profileImage}
                />
              ) : (
                <img
                  src={userProfile.userId.profilePicture}
                  alt={`${userProfile.userId.username}'s profile`}
                  className={styles.profileImage}
                />
              )}
          </div>

          <div className={styles.profileContainer_details}>
            <div
              style={{ display: "flex", gap: "0.7rem" }}
              className={styles.details}
            >
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "gray" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>
                {authState.profileFetched ? (
                  <div
                    className={styles.allButton}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1em",
                    }}
                  >
                    {userProfile.userId._id !== authState.user.userId._id && // Check if the user profile being viewed is not the authenticated user
                      (isCurrentUserInConnection ? (
                        <div>
                          <button className={styles.connectedButton}>
                            {isConnectionNull ? "Pending" : "Friends"}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            dispatch(
                              sendConnectionRequest({
                                token: localStorage.getItem("token"),
                                user_id: userProfile.userId._id,
                              })
                            );
                          }}
                          className={styles.connectionBtn}
                        >
                          Add Friend
                        </button>
                      ))}
                    {/* <div
                      onClick={() => {
                        handleDownload();
                      }}
                    >
                      <svg
                        style={{ height: "1.2em", cursor: "pointer" }}
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
                          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                    </div> */}
                  </div>
                ) : (
                  <></>
                )}
              </div>

              <div
                style={{ flex: "0.2" }}
                className={styles.recentActivityContainer}
              >
                <h3 className={styles.recentActivityTitle}>Recent</h3>
                {userPosts.slice(0, 1).map((post) => (
                  <div key={post._id} className={styles.PostCard}>
                    <div className={styles.card}>
                      <div className={styles.cardProfileContainer}>
                        {post.media !== "" ? (
                          <img
                            src={post.media}
                            alt="post media"
                          />
                        ) : null}
                      </div>
                      <p>{post.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                <p className={styles.placeholder}>No work experience listed.</p>
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
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const request = await clientServer.get(
    "api/users/get_profile_based_on_username",
    {
      params: {
        username: context.query.username,
      },
    }
  );

  const response = await request.data;
  console.log(response);

  return { props: { userProfile: request.data.Profile } };
}
