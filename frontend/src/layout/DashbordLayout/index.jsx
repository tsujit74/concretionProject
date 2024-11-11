import React, { useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { reset, setTokenIsThere } from "@/config/reducer/authReducer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setFlashMessage } from "@/config/reducer/flashMessage";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [activeOption, setActiveOption] = useState("");

  useEffect(() => {
    const { pathname } = router;

    // Set active option based on the current URL
    if (pathname === "/dashboard") {
      setActiveOption("scroll");
    }
    if (pathname === "/discover") {
      setActiveOption("search");
    }
    if (pathname === "/myconnection") {
      setActiveOption("connection");
    }
    if (pathname === "/contact") {
      setActiveOption("contact");
    }
  }, [router.pathname]);

  const handleNavigation = (path) => {
    setActiveOption(path);
    router.push(path);
  };

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }
    dispatch(setTokenIsThere());
  });

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.homeContainer}>
          <div className={styles.homeContainer_leftBar}>
            <div
              onClick={() => {
                handleNavigation("/dashboard");
              }}
              className={`${styles.sideBarOption} ${
                activeOption === "scroll" ? styles.active : ""
              }`}
            >
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
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              Scroll
            </div>
            <div
              onClick={() => {
                handleNavigation("/discover");
              }}
              className={`${styles.sideBarOption} ${
                activeOption === "search" ? styles.active : ""
              }`}
            >
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
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              Search
            </div>
            <div
              onClick={() => {
                handleNavigation("/myconnection");
              }}
              className={`${styles.sideBarOption} ${
                activeOption === "connection" ? styles.active : ""
              }`}
            >
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
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              My Connectioins
            </div>
            <div
              onClick={() => {
                handleNavigation("/contact");
              }}
              className={`${styles.sideBarOption} ${
                activeOption === "contact" ? styles.active : ""
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
</svg>

              Contact
            </div>
          </div>
          <div className={styles.homeContainer_feedBar}> {children}</div>
          <div className={styles.extraContainer}>
            <h4>Top Profiles </h4>
            {authState.all_profiles_fetched &&
              authState.all_users
                .filter((profile) => profile.userId && profile.userId.name) // Ensure userId and userId.name exist
                .slice(0, 5)
                .map((profile) => {
                  return (
                    <div
                      key={profile._id}
                      className={styles.extraContainer_profile}
                      onClick={() => {
                        router.push(`/view_profile/${profile.userId.username}`);
                      }}
                    >
                      <p>{profile.userId.name}</p>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      <div className={styles.mobileNavbar}>
        <div
          onClick={() => {
            router.push("/dashboard");
          }}
          className={styles.mobileNavoption}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            height={25}
            width={25}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </div>
        <div
          onClick={() => {
            router.push("/discover");
          }}
          className={styles.mobileNavoption}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            height={25}
            width={25}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <div
          onClick={() => {
            router.push("/myconnection");
          }}
          className={styles.mobileNavoption}
        >
          <img src="/images/user.png" alt="" />
        </div>
        <div
          onClick={() => {
            router.push("/profile");
          }}
          className={styles.mobileNavoption}
        >
          {authState.profileFetched && authState.user ? (
            <>
              {authState.user.userId.profilePicture === "default.jpg" ? (
                <img
                  src="/images/default.jpg"
                  alt="user"
                  className={styles.profileImage}
                  onClick={() => router.push("/profile")}
                />
              ) : (
                <img
                  src={authState.user.userId.profilePicture}
                  alt={`${authState.user.userId.username}'s profile`}
                  className={styles.profileImage}
                  onClick={() => router.push("/profile")}
                />
              )}
            </>
          ) : (
            <>
              {" "}
              <img
                src="/images/default.jpg"
                alt="user"
                className={styles.profileImage}
                onClick={() => router.push("/profile")}
              />
            </>
          )}
        </div>

        <div className={styles.iconContainer}>
          <div
            onClick={() => setShowModal(!showModal)}
            className={styles.mobileNavoption}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 threeDot"
              width={32}
              height={32}
              style={{ marginRight: "25px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </div>
          {showModal && (
            <div
              className={styles.modalOverlay}
              onClick={() => setShowModal(false)}
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                {authState.user &&
                  authState.user.userId &&
                  authState.user.userId.role === "admin" && (
                    <div
                      onClick={() => {
                        router.push("/admin");
                      }}
                      className={styles.modalOption}
                    >
                      Admin
                    </div>
                  )}

                <div
                  onClick={() => {
                    router.push("/profile");
                    setShowModal(false);
                  }}
                  className={styles.modalOption}
                >
                  Profile
                </div>

                <div
                  onClick={() => {
                    router.push("/contact");
                    setShowModal(false);
                  }}
                  className={styles.modalOption}
                >
                  Contact
                </div>

                <div
                  onClick={() => {
                    localStorage.removeItem("token");
                    dispatch(reset());
                    router.push("/login");
                    dispatch(
                      setFlashMessage({
                        message: "Successfully Logged Out",
                        type: "success",
                      })
                    );
                    setShowModal(false);
                  }}
                  style={{ color: "red" }}
                  className={styles.modalOption}
                >
                  Logout
                </div>
                {/* <div
                  onClick={() => {
                    router.push("/contact");
                    setShowModal(false);
                  }}
                  className={styles.modalOption}
                >
                  Contact
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
