import { useRouter } from "next/router";
import styles from './style.module.css'

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // Navigates to the previous page in history
  };

  return (
    <div className={styles.backButton} onClick={handleBack}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
        width={25}
        height={25}
        cursor="pointer"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>
    </div>
  );
}
