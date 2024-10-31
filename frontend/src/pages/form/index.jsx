import { getAboutUser } from "@/config/action/authAction";
import DashboardLayout from "@/layout/DashbordLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import styles from "./style.module.css";
import { clientServer } from "@/config";
import { useRouter } from "next/router";
import BackButton from "@/Components/Backbutton";
import { setFlashMessage } from "@/config/reducer/flashMessage";
import FlagMessage from "@/Components/Flashmessage";

export default function FromPage() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    bio: "",
    profilePicture: "",
    postWork: [{ company: "", position: "", years: "" }],
    education: [{ school: "", degree: "", fieldOfStudy: "" }],
  });

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }, [dispatch]);

  useEffect(() => {
    if (authState && authState.profileFetched) {
      const { userId, bio, postWork, education } = authState.user;
      setFormData({
        email: userId.email || "",
        bio: bio || "",
        postWork: postWork.length
          ? postWork
          : [{ company: "", position: "", years: "" }],
        education: education.length
          ? education
          : [{ school: "", degree: "", fieldOfStudy: "" }],
      });
    }
  }, [authState]);

  const handleChange = (e, section, index) => {
    const { name, value } = e.target;

    if (section === "postWork") {
      const updatedPostWork = [...formData.postWork];
      updatedPostWork[index] = { ...updatedPostWork[index], [name]: value };
      setFormData({ ...formData, postWork: updatedPostWork });
    } else if (section === "education") {
      const updatedEducation = [...formData.education];
      updatedEducation[index] = { ...updatedEducation[index], [name]: value };
      setFormData({ ...formData, education: updatedEducation });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const updatedFields = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== authState.user[key]) {
          updatedFields[key] = formData[key];
        }
      });
  
      const response = await clientServer.post(
        "api/users/update_profile_data",
        {
          token: localStorage.getItem("token"),
          ...updatedFields,
        }
      );
  
      const data = response.data;
      console.log("Profile updated:", data.message);
  
      dispatch(setFlashMessage({ message: "Successfully Updated", type: "success" }));
      router.push("/profile");
  
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error updating profile:", errorMessage);
      dispatch(setFlashMessage({ message: errorMessage, type: "error" }));
    }
  };
  
 


  return (
    <UserLayout>
      <DashboardLayout>
        <BackButton/>
        <FlagMessage/>
        <form onSubmit={handleSubmit} className={styles.update_profile_form}>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className={styles.field}>
            <label>Bio</label>
            <textarea  name="bio" value={formData.bio ? formData.bio: ""} onChange={handleChange} />
          </div>

          <h3>Work Experience</h3>
          {formData.postWork.map((work, index) => (
            <div key={index} className={styles.work_experience}>
              <label>
                Company:
                <input
                  type="text"
                  name="company"
                  value={work.company}
                  onChange={(e) => handleChange(e, "postWork", index)}
                />
              </label>
              <label>
                Position:
                <input
                  type="text"
                  name="position"
                  value={work.position}
                  onChange={(e) => handleChange(e, "postWork", index)}
                />
              </label>
              <label>
                Years:
                <input
                  type="text"
                  name="years"
                  value={work.years}
                  onChange={(e) => handleChange(e, "postWork", index)}
                />
              </label>
            </div>
          ))}

          <h3>Education</h3>
          {formData.education.map((edu, index) => (
            <div key={index} className={styles.education_experience}>
              <label>
                School:
                <input
                  type="text"
                  name="school"
                  value={edu.school}
                  onChange={(e) => handleChange(e, "education", index)}
                />
              </label>
              <label>
                Degree:
                <input
                  type="text"
                  name="degree"
                  value={edu.degree}
                  onChange={(e) => handleChange(e, "education", index)}
                />
              </label>
              <label>
                Field of Study:
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleChange(e, "education", index)}
                />
              </label>
            </div>
          ))}

          <button type="submit">Update Profile</button>
        </form>
      </DashboardLayout>
    </UserLayout>
  );
}
