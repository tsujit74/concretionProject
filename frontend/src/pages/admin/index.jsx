import NavBarComponent from "@/Components/Navbar";
import AdminLayout from "@/layout/AdminLayout";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BASE_URL } from "@/config";
import styles from "./style.module.css";
import { useDispatch } from "react-redux";
import {
  getAboutUser,
  getAllUsers,
  getConnectionsRequest,
} from "@/config/action/authAction";
import { getAllPosts } from "@/config/action/postAction";
import axios from "axios";
import BackButton from "@/Components/Backbutton";
import Spinner from "@/Components/Spinner";

export default function Admin() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    role: "user",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllUsers());
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/api/admin/get_users`, {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Access denied.");
        router.push("/");
      } else {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [router]);
  if (error) return <p>{error}</p>;

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(`Are you sure you want to delete this user? ${userId}`)
    ) {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        await axios.delete(`${BASE_URL}/api/admin/delete_user/${userId}`, {
          headers: {
            Authorization: token,
          },
        });
        fetchUsers();
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/admin/edit_user/${editingUser}`,
        formData,
        {
          headers: { Authorization: token },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === editingUser ? { ...user, ...formData } : user
        )
      );
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      setError(error.response?.data?.message || "Error updating user.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setFormData({ name: "", username: "", email: "", role: "" });
  };

  return (
    <AdminLayout>
      <div className={styles.admin_container}>
        <BackButton />
        <h1 className={styles.admin_heading}>Admin Dashboard</h1>

        <div className={styles.user_management}>
          <h3>User Management</h3>
          <div className={styles.user_count}>Total Users: {users.length}</div>
        </div>

        <table className={styles.userTable}>
          {isLoading && <Spinner />}
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users
              .sort((a, b) =>
                a.role === "admin" ? -1 : b.role === "admin" ? 1 : 0
              ) // Sort to show admins first
              .map((user) => (
                <tr
                  key={user._id}
                  className={user.role === "admin" ? styles.adminRow : ""}
                >
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className={styles.edit}
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.delete}
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {editingUser && (
          <div className={styles.model_overlay}>
            <div className={styles.modal_content}>
              <button className={styles.modal_close} onClick={handleCloseModal}>
                &times;
              </button>
              <h2>Edit User</h2>
              <form onSubmit={handleUpdateUser}>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <br />
                <label>
                  Username:
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </label>
                <br />
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </label>
                <br />
                <label htmlFor="role">
                  ROLE:
                  <select
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="user">USER</option>
                    <option value="admin">ADMIN</option>
                  </select>
                </label>
                <button className={styles.updateBtn} type="submit">
                  Update
                </button>
              </form>
            </div>
          </div>
        )}
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
            router.push("/profile");
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
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
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
      </div>
    </AdminLayout>
  );
}
