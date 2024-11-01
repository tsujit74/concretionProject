import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/reducer/authReducer";
import FlagMessage from "../Flashmessage";
import { setFlashMessage } from "@/config/reducer/flashMessage";
import Image from 'next/image';
import { useEffect } from "react";

function NavBarComponent() {
  const router = useRouter();

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <img
        src="/images/conclogo.png" alt="" 
          style={{ cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
        >
        
        </img>
<FlagMessage/>
        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched && (
            <div>
              <div style={{ display: "flex", gap: "1.2rem" }}>
                <p className={styles.navname}> {authState.user.userId.name} </p>
                <p
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                  onClick={() => {
                    router.push("/profile");
                  }}
                >
                  Profile
                </p>
                <p
                  onClick={() => {
                    localStorage.removeItem("token");
                    dispatch(reset());
                    router.push("/login");
                    dispatch(setFlashMessage({message:"SucessFully Logged Out", type:"success"}))
                  }}
                  style={{ fontWeight: "500", cursor: "pointer", color: "red" }}
                >
                  Logout
                </p>
              </div>
            </div>
          )}

          {!authState.profileFetched && (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavBarComponent;
