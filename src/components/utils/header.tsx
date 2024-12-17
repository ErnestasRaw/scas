'use client';
import React from "react";
import { FiAlignJustify, FiUser } from "react-icons/fi";
import { IoMdLogOut } from "react-icons/io";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const showAdminDashboard = () => {
    if(session?.user?.role === "admin") {
      return (
        <Link href="/admin" className="nav-link text-white px-3 py-2" aria-current={pathname === '/admin' ? 'page' : undefined}>
          Admin
        </Link>
      );
    }
  };

  const showNavBar = () => {
    if (status === "authenticated") {
      return (
        <nav className="d-flex">
          <Link href="/" className="nav-link text-white px-3 py-2" aria-current={pathname === '/' ? 'page' : undefined}>
            Pradžia
          </Link>
          <Link href="/venues" className="nav-link text-white px-3 py-2" aria-current={pathname === '/venues' ? 'page' : undefined}>
            Salės
          </Link>
          <Link href="/reservations" className="nav-link text-white px-3 py-2" aria-current={pathname === '/reservations' ? 'page' : undefined}>
            Rezervacijos
          </Link>
        </nav>
      );
    }
  };

  const showSession = () => {
    if (status === "authenticated") {
      const userProfileUrl = `/profile/${session?.user?._id}`;
      return (
        <div className="d-flex align-items-center ms-auto">
          {session && (
            <div className="d-flex align-items-center bg-dark text-white rounded-pill px-3 py-2 gap-3 shadow">
              <span className="text-light fw-bold">
                Prisijungęs, kaip {session?.user?.name}
              </span>
              <button
                className="btn btn-warning text-dark fw-bold d-flex align-items-center justify-content-center gap-2 rounded-pill px-3 py-2 shadow"
                onClick={() => {
                  router.push(userProfileUrl);
                }}
                style={{ width: "auto", height: "auto" }}
              >
                <FiUser size={20} />
              </button>
            </div>
          )}

          <button
            id="logout-button" // Added id attribute here
            className="btn btn-danger ms-2 d-flex align-items-center justify-content-center"
            onClick={() => {
              signOut({ redirect: true }).then(() => {
                router.push("/login"); // Ensure the user is redirected to the login page
              });
            }}
            style={{ width: "auto", height: "auto" }}
          >
            <IoMdLogOut size={20} />
          </button>
        </div>
      );
    } else if (status === "loading") {
      return <span className="ms-3 text-muted">Loading...</span>;
    } else {
      if (pathname !== "/login") {
        return (
          <Link href="/login" passHref>
            <button className="btn btn-success ms-3">Prisijungti</button>
          </Link>
        );
      }
    }
  };

  return (
    <header className="bg-dark text-white py-3">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {showAdminDashboard()}
        <div className="d-flex justify-content-center w-100">
          {showNavBar()}
        </div>
        {showSession()}
      </div>
    </header>
  );
}