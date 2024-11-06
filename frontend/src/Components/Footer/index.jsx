import React from "react";
import Link from "next/link";
import styles from "./style.module.css";
import { useRouter } from "next/router";

export default function Footer() {
  const router = useRouter();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img
            src="/images/conclogo.png"
            alt=""
            onClick={() => router.push("/")}
          />
          <p>Join your colleagues, classmates, and friends on Concretion.</p>
        </div>

        <div className={styles.links}>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className={styles.contact}>
          <h3>Contact Us</h3>
          <p>Email: tsujeet440@gmail.com</p>
          <p>Phone: +91 7479713290</p>
          <div className={styles.socialMedia}>
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
          </div>
        </div>
      </div>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} Concretion. All rights reserved.
      </p>
    </footer>
  );
}
