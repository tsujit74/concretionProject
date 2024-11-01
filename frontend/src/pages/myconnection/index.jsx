import DashboardLayout from "@/layout/DashbordLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptConnection,
  getMyConnectionsRequest,
} from "@/config/action/authAction";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";
import BackButton from "@/Components/Backbutton";

export default function MyConnectionsPage() {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(getMyConnectionsRequest({ token: localStorage.getItem("token") }));
  }, []);

  // useEffect(() => {
  //   if (authState.connectionRequest.length !== 0) {
  //     console.log(authState.connectionRequest,"from con")
  //   }
  // }, [authState.connectionRequest]);

  return (
    <UserLayout>
      <DashboardLayout>
        <BackButton />
        <div className={styles.connectionContainer}>
          <div className={styles.connectionRequests}>
            <h3>My Connections</h3>
            {authState.connectionRequest &&
            authState.connectionRequest.length !== 0 ? (
              authState.connectionRequest
                .filter((connection) => connection.status_accepted === null)
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
                    <div className={styles.cardContent}>
                      <div className={styles.userInfo}>
                        <h3>{user.userId.name}</h3>
                        <p>@{user.userId.username}</p>
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            acceptConnection({
                              token: localStorage.getItem("token"),
                              connectionId: user._id,
                              action: "true",
                            })
                          );
                          dispatch(
                            getMyConnectionsRequest({
                              token: localStorage.getItem("token"),
                            })
                          );
                        }}
                        className={styles.confirmBtn}
                      >
                        <button>Confirm</button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p>No connections found</p>
            )}
          </div>

          <div className={styles.myNetwork}>
            <h4>My Network</h4>
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
                    <div className={styles.cardContent}>
                      <div className={styles.userInfo}>
                        <h3>{user.userId.name}</h3>
                        <p>@{user.userId.username}</p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p>No Friends found</p>
            )}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
