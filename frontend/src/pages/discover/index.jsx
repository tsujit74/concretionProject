import { getAboutUser, getAllUsers } from "@/config/action/authAction";
import DashboardLayout from "@/layout/DashbordLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";
import BackButton from "@/Components/Backbutton";
import { setFlashMessage } from "@/config/reducer/flashMessage";
import FlagMessage from "@/Components/Flashmessage";
import Search from "@/Components/Search";

export default function DiscoverPage() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
    if (authState.isTokenThere) {
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }, []);

  const router = useRouter();

  return (
    <UserLayout>
       <FlagMessage/>
      <DashboardLayout>
        <div className={styles.discover_head}>
         
          <BackButton />
          <Search/>
        </div>
        {/* <div className={styles.pageHeader}>
          <h1>Discover</h1>
        </div> */}

        <div className={styles.allUserProfile}>
          {authState.profileFetched ? (
            <>
              {authState.all_users
                .filter((user) => authState.user.userId._id === user.userId._id)
                .map((user) => (
                  <div
                    key={user._id}
                    onClick={() => {
                      if (
                        authState.user.userId.username === user.userId.username
                      ) {
                        router.push("/profile");
                      } else {
                        router.push(`/view_profile/${post.userId.username}`);
                      }
                    }}
                    className={styles.userProfileCard}
                  >
                    {user.userId.profilePicture === "default.jpg" ? (
                      <img
                        src="images/default.jpg"
                        alt="You"
                        className={styles.profileImage}
                      />
                    ) : (
                      <img
                        src={user.userId.profilePicture}
                        alt={`${user.userId.username}'s profile`}
                        className={styles.profileImage}
                      />
                    )}
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>@{user.userId.username}</p>
                    </div>
                  </div>
                ))}

              {authState.all_profiles_fetched &&
                authState.all_users
                  .filter(
                    (user) => user.userId._id !== authState.user.userId._id
                  )
                  .map((user) => (
                    <div
                      key={user._id}
                      onClick={() => {
                        router.push(`/view_profile/${user.userId.username}`);
                      }}
                      className={styles.userProfileCard}
                    >
                      {user.userId.profilePicture === "default.jpg" ? (
                        <img
                          src="images/default.jpg"
                          alt="You"
                          className={styles.profileImage}
                        />
                      ) : (
                        <img
                          src={user.userId.profilePicture}
                          alt={`${user.userId.username}'s profile`}
                          className={styles.profileImage}
                        />
                      )}
                      <div className={styles.userInfo}>
                        <h3>{user.userId.name}</h3>
                        <p>@{user.userId.username}</p>
                      </div>
                    </div>
                  ))}
            </>
          ) : (
            <>Loading</>
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
