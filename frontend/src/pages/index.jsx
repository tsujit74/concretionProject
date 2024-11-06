import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <Head>
        <title>Welcome to Our Social Platform</title>
        <meta
          name="description"
          content="Connect with friends genuinely, without the noise."
        />
      </Head>

      <div className={styles.container}>
        <nav className={styles.navBar}>
        <img
        src="images/conclogo.png" alt="" 
          style={{ cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
        />

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

        {/* Hero Section */}
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <h1>Connect with Friends without Exaggeration</h1>
            <p>A true social media platform, with stories, no bluffs!</p>
            <div
              className={styles.buttonJoin}
              onClick={() => router.push("/login")}
            >
              <button>Join Now</button>
            </div>
          </div>
          <div className={styles.mainContainer_right}>
            <img src="images/connectionHome.png" alt="Home Connection Image" />
          </div>
        </div>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <h2>Why Join Us?</h2>
          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <img src="images/authenticity.webp" alt="Authenticity" />
              <h3>Authenticity</h3>
              <p>Real stories from real people, free from exaggeration.</p>
            </div>
            <div className={styles.featureItem}>
              <img src="images/community.webp" alt="Community" />
              <h3>Community</h3>
              <p>A community-driven experience that brings people closer.</p>
            </div>
            <div className={styles.featureItem}>
              <img src="images/privacy.webp" alt="Privacy" />
              <h3>Privacy</h3>
              <p>Your data, your control. We value your privacy.</p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className={styles.ctaSection}>
          <h2>Ready to Make Real Connections?</h2>
          <p>Join your colleagues, classmates, and friends on Concretion.</p>
          <button
            className={styles.ctaButton}
            onClick={() => router.push("/login")}
          >
            Get Started
          </button>
        </section>
      </div>
    </UserLayout>
  );
}
