import { clientServer } from "@/config";
import DashboardLayout from "@/layout/DashbordLayout";
import UserLayout from "@/layout/UserLayout";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import BackButton from "@/Components/Backbutton";
import Search from "@/Components/Search";
import Spinner from "@/Components/Spinner";

export default function Serch() {
  const router = useRouter();
  const { q } = router.query;
  const [result, setResult] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (q) {
        try {
            setLoading(true);
          const response = await clientServer.get(
            `api/users/search?q=${encodeURIComponent(q)}`
          );
          setResult(response.data);
          setLoading(false)
        } catch (error) {
          console.error("Error fetching search results:", error);
        }finally{
            setLoading(false);
        }
      }
    };
    fetchResults();
  }, [q]);

  return (
    <UserLayout>
      <DashboardLayout>
        {loading && <Spinner/>}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position:"sticky",
            top:"0",
            backgroundColor:"white"
          }}
        >
          <BackButton />
          <Search />
        </div>
        <h3>Search Results for "{q}"</h3>
        <ul>
          {result.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "10%" }}>
              No result Found!
            </p>
          )}

          {result.length !== 0 && (
            <div className={styles.container}>
              {result.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    router.push(`/view_profile/${user.username}`);
                  }}
                  className={styles.userProfileCard}
                >
                  {user.profilePicture === "default.jpg" ? (
                    <img
                      src="images/default.jpg"
                      alt="You"
                      className={styles.profileImage}
                    />
                  ) : (
                    <img
                      src={user.profilePicture}
                      alt={`${user.username}'s profile`}
                      className={styles.profileImage}
                    />
                  )}
                  <div className={styles.userInfo}>
                    <h3>{user.name}</h3>
                    <p>@{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ul>
      </DashboardLayout>
    </UserLayout>
  );
}
