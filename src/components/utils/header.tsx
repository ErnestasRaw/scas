'use client';
import React, { useState } from "react";
import styles from "@/app/styles/header.module.css";
import { FiAlignJustify } from "react-icons/fi";
import { IoMdLogOut } from "react-icons/io";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession(); 
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const showSession = () => {
    if (status === "authenticated") {
      return (
        <div className={styles.logoutButton}
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              router.push("/");
            });
          }}
        >
          <IoMdLogOut />
        </div>
      );
    } else if (status === "loading") {
      return (
        <span>Loading...</span>
      );
    } else {
      return (
        <Link
          href="/login"
          className={styles.signInButton}        
          >
          Prisijungti
        </Link>
      );
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.Hamburger} onClick={toggleMenu}>
        <FiAlignJustify size={24} />
      </div>

      <nav className={`${styles.Nav} ${isOpen ? styles.Show : ""}`}>
        <ul>
        {status === "authenticated" && (
          <li>Prisijungęs, kaip {session?.user?.name}</li>
           )}
        </ul>
        <div className={styles.Logout} title="Atsijungti"></div>
      </nav>
      {showSession()}
    </header>
  );
}
