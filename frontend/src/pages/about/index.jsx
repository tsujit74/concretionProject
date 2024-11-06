import React from "react";
import styles from "./style.module.css";
import BackButton from "@/Components/Backbutton";

export default function About() {
  return (
    <div>
      <BackButton />
      <div className={styles.aboutContainer}>
        <section className={styles.introSection}>
          <h2>About Concretion</h2>
          <p>
            Welcome to Concretion, where professionals, students, and teams come
            together to connect, grow, and build impactful relationships. Our
            platform is designed to help you expand your network, discover
            opportunities, and advance your career.
          </p>
        </section>

        <section className={styles.missionSection}>
          <h3>Our Mission</h3>
          <p>
            Our mission is to foster a supportive and engaging space for
            professionals from all industries. We believe in empowering
            individuals by connecting them to resources, insights, and
            communities that drive personal and professional growth.
          </p>
        </section>

        <section className={styles.visionSection}>
          <h3>Our Vision</h3>
          <p>
            To become the go-to platform for meaningful professional connections
            and knowledge-sharing. We envision a world where every professional
            has access to a thriving network and the tools needed for success.
          </p>
        </section>

        <section className={styles.valuesSection}>
          <h3>Our Core Values</h3>
          <ul>
            <li>
              <strong>Collaboration:</strong> Bringing people together to
              inspire growth and innovation.
            </li>
            <li>
              <strong>Integrity:</strong> Building trust through transparency
              and authenticity.
            </li>
            <li>
              <strong>Diversity:</strong> Embracing different perspectives and
              fostering inclusive communities.
            </li>
            <li>
              <strong>Empowerment:</strong> Equipping individuals with
              opportunities and resources to succeed.
            </li>
          </ul>
        </section>

        <section className={styles.teamSection}>
          <h3>Meet Our Team</h3>
          <p>
            Our team is a dedicated group of professionals passionate about
            helping you make the most of your network. We're here to support
            your journey, whether you're looking to connect with colleagues,
            discover mentors, or find your next big opportunity.
          </p>
        </section>
      </div>
    </div>
  );
}
