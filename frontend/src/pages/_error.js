// pages/_error.js
import DashboardLayout from "@/layout/DashbordLayout";
import UserLayout from "@/layout/UserLayout";
import Link from "next/link";
import styles from "@/styles/Error.module.css";


function Error({ statusCode }) {
  return (
    <UserLayout>
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>
          {statusCode ? `Error ${statusCode}` : "An error occurred"}
        </h1>
        <p className={styles.errorMessage}>
          Something went wrong. Please try again or go back to the homepage.
        </p>
        <Link href="/" passHref>
          <button className={styles.button}>Go Back Home</button>
        </Link>
      </div>
    </UserLayout>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
