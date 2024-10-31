import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import {
  getAboutUser,
  loginUser,
  registerUser,
} from "@/config/action/authAction";
import { emptyMessage } from "@/config/reducer/authReducer";
import BackButton from "@/Components/Backbutton";
import Spinner from "@/Components/Spinner";
import { setFlashMessage } from "@/config/reducer/flashMessage";

export default function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authState.loggenIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(getAboutUser());
      router.push("/dashboard");
    }
  });

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  const handleRegister = async () => {
    if (!name || !username || !password || !email) {
      dispatch(
        setFlashMessage({
          message: "All fields are required.",
          type: "error",
        })
      );
      return; 
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    dispatch(
      setFlashMessage({
        message: "Please enter a valid email address.",
        type: "error",
      })
    );
    return;
  }
  
    if (password.length < 6) {
      dispatch(
        setFlashMessage({
          message: "Password must be at least 6 characters long.",
          type: "error",
        })
      );
      return;}
  
    setIsLoading(true);
    try {
      await dispatch(registerUser({ username, password, email, name }));
      dispatch(
        setFlashMessage({ message: "Successfully Registered", type: "success" })
      );
    } catch (error) {
      const errorMessage = error.message || "Registration failed. Please try again.";
      dispatch(setFlashMessage({ message: errorMessage, type: "error" }));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await dispatch(loginUser({ email, password }));
      await dispatch(getAboutUser());
    } catch (error) {
      const errorMessage = error.message || "Login failed. Please try again.";
      dispatch(setFlashMessage({ message: errorMessage, type: "error" }));
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (authState.message) {
      dispatch(
        setFlashMessage({
          message: authState.message.message,
          type: authState.message.type || "error",
        })
      );
    }
  }, [authState.message, dispatch]);

  return (
    <UserLayout>
      <div>
        <nav className={styles.navBar}>
          <img
          src="images/conclogo"
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push("/");
            }}
          >
           
          </img>

          <div className={styles.navBarOptionContainer}>
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoinNav}
            >
              <p>Be a part</p>
            </div>
          </div>
        </nav>

        <div
          className={styles.container}
          style={{ opacity: isLoading ? 0.5 : 1, cursor:isLoading?"progress": "pointer" }}
        >
          <div className={styles.cardContainer}>
            <BackButton />
            <div className={styles.cardContainer_left}>
              <p className={styles.cardleft_heading}>
                {userLoginMethod ? "Sing In" : "Sign Up"}
              </p>

              <p
                style={{
                  color: authState.isError ? "red" : "green",
                  paddingBottom: "5px",
                }}
              >
                {authState.message ? authState.message.message : ""}
              </p>

              <div className={styles.inputContainer}>
                <div className={styles.inputRow}>
                  {isLoading && <Spinner />}
                  {!userLoginMethod && (
                    <>
                      {" "}
                      <input
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles.inputField}
                        type="text"
                        placeholder="Username"
                      />
                      <input
                        onChange={(e) => setName(e.target.value)}
                        className={styles.inputField}
                        type="text"
                        placeholder="Full Name"
                      />
                    </>
                  )}
                </div>
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputField}
                    type="email"
                    placeholder="Email"
                  />
                </div>
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputField}
                    type="password"
                    placeholder="Password"
                  />
                </div>

                <div
                  onClick={() => {
                    if (userLoginMethod) {
                      handleLogin();
                    } else {
                      handleRegister();
                    }
                  }}
                  className={styles.buttonWithOutline}
                >
                  {userLoginMethod ? "Sing In" : "Sign Up"}
                </div>
              </div>
            </div>
            <div className={styles.cardContainer_right}>
              <div>
                {userLoginMethod ? (
                  <p className={styles.rightMessage}>Don't Have an Account</p>
                ) : (
                  <p className={styles.rightMessage}>Already Have an Account</p>
                )}
              </div>
              <div
                onClick={() => {
                  setUserLoginMethod(!userLoginMethod);
                }}
                className={styles.buttonWithOutlineRight}
              >
                {userLoginMethod ? "Sing Up" : "Sign In"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
