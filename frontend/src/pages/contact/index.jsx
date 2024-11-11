import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { setFlashMessage } from "@/config/reducer/flashMessage";
import { BASE_URL, clientServer } from "@/config";
import FlagMessage from "@/Components/Flashmessage";
import Spinner from "@/Components/Spinner";
import BackButton from "@/Components/Backbutton";

export default function Contact() {
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendMsg = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!name || !email || !message) {
      setErrorMessage("All field Required!");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    if (!validateEmail(email)) {
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    setLoading(true);

    try {
      const result = await clientServer.post("api/users/send_message", {
        name: name,
        email: email,
        message: message,
      });

      setName("");
      setEmail("");
      setMessage("");
      setSuccessMessage("Message Sent Successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to send message. Please try again."
      );
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      
      <div className={styles.contactContainer}>
      <BackButton />
        <section className={styles.introSection}>
          <div style={{ display: "flex" }}>
            <h3>Contact Us</h3>
          </div>
          <p>
            We’d love to hear from you! Whether you have a question, feedback,
            or simply want to get in touch, feel free to reach out. Our team is
            here to help.
          </p>
        </section>

        <div className={styles.mainContact}>
          <div className={styles.mainContact_left}>
            {loading && <Spinner />}
            <section
              className={styles.formSection}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              <h3>Send Us a Message</h3>
              {successMessage && (
                <p className={styles.successMessage}>{successMessage}</p>
              )}
              {errorMessage && (
                <p className={styles.errorMessage}>{errorMessage}</p>
              )}
              <form className={styles.contactForm} onSubmit={handleSendMsg}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </section>
          </div>
          <div className={styles.mainContact_right}>
            <img src="/images/contact.svg" alt="contact" />
          </div>
        </div>

        <section className={styles.contactInfo}>
          {/* <p>
            Email us directly at{" "}
            <a href="mailto:support@concretion.com">support@concretion.com</a>
          </p> */}
          <p>Or reach out on our social media platforms:</p>
          <ul className={styles.socialLinks}>
            <a
              href="https://www.facebook.com/sujit.thakur.7737769"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/facebook.svg" alt="facebook" />
            </a>
            <a
              href="https://www.instagram.com/_sujit_garg/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              <img src="/images/instagram.svg" alt="instagram" />{" "}
            </a>
            <a
              href="https://www.linkedin.com/in/sujit-thakur-463b45229/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/linkedin.svg" alt="linkedin" />
            </a>
          </ul>
        </section>
      </div>
    </div>
  );
}
