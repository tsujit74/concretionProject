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
  const [isLoading,setIsLoading] = useState(false);
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
      setIsLoading(true)
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
    }finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [router]);
  if (error) return <p>{error}</p>;

  const handleDeleteUser = async (userId) => {
    if (window.confirm(`Are you sure you want to delete this user? ${userId}`)) {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("token");
        await axios.delete(`${BASE_URL}/api/admin/delete_user/${userId}`, {
          headers: {
            Authorization: token,
          },
        });
        fetchUsers();
      } catch (err) {
        setError(err);
      }finally{
        setIsLoading(false)
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
      setIsLoading(true)
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
    }finally{
      setIsLoading(false)
    }
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setFormData({ name: "", username: "", email: "", role: "" });
  };

  return (
    <AdminLayout>
      <div className={styles.admin_container}>
        <BackButton/>
        <h1 className={styles.admin_heading}>Admin Dashboard</h1>

        <div className={styles.user_management}>
          <h3>User Management</h3>
          <div className={styles.user_count}>Total Users: {users.length}</div>
        </div>

        <table className={styles.userTable}>
          {isLoading && <Spinner/>}
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
    </AdminLayout>
  );
}
