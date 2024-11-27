'use client';
import React, { useState } from "react";
import styles from "@/app/styles/header.module.css";
import { FiAlignJustify } from "react-icons/fi";
import { IoMdLogOut } from "react-icons/io";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <div className={styles.Hamburger} onClick={toggleMenu}>
        <FiAlignJustify size={24} />
      </div>

      <nav className={`${styles.Nav} ${isOpen ? styles.Show : ""}`}>
        <ul>
          <li>Prisijungęs, kaip ...Value...</li>
        </ul>
        <div className={styles.Logout} title="Atsijungti">
          <IoMdLogOut />
        </div>
      </nav>
    </header>
  );
}
