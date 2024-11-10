import { setFlashMessage } from "@/config/reducer/flashMessage";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from './style.module.css'

export default function Search() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      setFlashMessage({
        message: "Enter a name or username",
        type: "error",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div class={styles.search_container}>
      <div>
        <input
          type="search"
          name="q"
          class={styles.search_input}
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
        />
      </div>
      <div onClick={handleSearch} className={styles.searchButton}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
          height={22}
          width={18}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
    </div>
  );
}
