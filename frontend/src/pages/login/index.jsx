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
import FlagMessage from "@/Components/Flashmessage";
import { clientServer } from "@/config";

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
  const [modal, setModal] = useState(false);
  const [resetPasswod, setResetPassword] = useState(false);
  const [code,setCode] = useState("")

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
    if (name === "" || username === "" || password === "" || email === "") {
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
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(registerUser({ username, password, email, name }));
      dispatch(
        setFlashMessage({ message: "Successfully Registered", type: "success" })
      );
      setUserLoginMethod(true);
    } catch (error) {
      const errorMessage =
        error.message || "Registration failed. Please try again.";
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

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      handleLogin();
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

  const sendCode = async () => {
    if (!email) {
      dispatch(
        setFlashMessage({
          message: "Email required.",
          type: "error",
        })
      );
      return;
    }

    try {
      setIsLoading(true);
      const response = await clientServer.post("api/users/forget_password", {
        email: email,
      });

      if (response.status === 200) {
        dispatch(
          setFlashMessage({
            message: "Reset code sent to your email.",
            type: "success",
          })
        );
      } else {
        dispatch(
          setFlashMessage({
            message: "Failed to send reset code. Please try again.",
            type: "error",
          })
        );
      }
      setResetPassword(true)
      setIsLoading(false)
    } catch (error) {
      dispatch(
        setFlashMessage({
          message: error.message,
          type: "error",
        })
      );
      console.error("Error sending reset code:", error.message);
    }finally{
      setIsLoading(false)
    }
  };

  const updatePassword = async () => {
    if (!email || !code || !password) {
      dispatch(
        setFlashMessage({
          message: "All field required.",
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
      return;
    }

    if (code.length !== 6) {
      dispatch(
        setFlashMessage({
          message: "Password must be 6 characters long only.",
          type: "error",
        })
      );
      return;
    }

    try {
      setIsLoading(true);
      const response = await clientServer.post("api/users/reset_password", {
        email: email,
        code:code,
        password:password,
      });

      if (response.status === 200) {
        dispatch(
          setFlashMessage({
            message: "Password Updated.",
            type: "success",
          })
        );
        setEmail(""); 
      } else {
        dispatch(
          setFlashMessage({
            message: "Some Error Please try again.",
            type: "error",
          })
        );
      }
      setIsLoading(false)
      setModal(false);
    } catch (error) {
      dispatch(
        setFlashMessage({
          message: error.message,
          type: "error",
        })
      );
      console.error("Passsword Not Changed:", error.message);
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <UserLayout>
      <div>
        <FlagMessage />
        <nav className={styles.navBar}>
          <img
            src="/images/conclogo.png"
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push("/");
            }}
          ></img>

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
          style={{
            opacity: isLoading ? 0.5 : 1,
            cursor: isLoading ? "progress" : "pointer",
          }}
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
                        onKeyDown={handleKeyDown}
                      />
                      <input
                        onChange={(e) => setName(e.target.value)}
                        className={styles.inputField}
                        type="text"
                        placeholder="Full Name"
                        onKeyDown={handleKeyDown}
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
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputField}
                    type="password"
                    placeholder="Password"
                    onKeyDown={handleKeyDown}
                  />
                </div>
                {userLoginMethod && (
                  <div
                    style={{ textAlign: "left", color: "darkblue" }}
                    onClick={() => {
                      setModal(true)
                    }}
                  >
                    <p>Forget Password</p>
                  </div>
                )}

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

      {modal && (
        <div
          className={styles.reset_password_container}
          onClick={() => {
            setModal(false), setResetPassword(false);
          }}
        >
          {isLoading && <Spinner/>}
          <div
            className={styles.reset_password}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className={styles.inputRow}>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className={styles.reset_inputField}
                type="email"
                placeholder="Enter Your Email"
                onKeyDown={handleKeyDown}
              />
            </div>

            {resetPasswod && (
              <>
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setCode(e.target.value)}
                    className={styles.reset_inputField}
                    type="text"
                    placeholder="Code"
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.reset_inputField}
                    type="password"
                    placeholder="Password"
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </>
            )}

            <div className={styles.reset_buttonWithOutlineRight}
            >
              {!resetPasswod ? (
                <p
                  onClick={() => {
                    sendCode()
                  }}
                >
                  Send Code
                </p>
              ) : (
                <p onClick={()=>{updatePassword()}}>Update</p>
              )}
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
