'use client';
import React from "react";
import { FiAlignJustify } from "react-icons/fi";
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
    if(session?.user?.role === "admin")
    {
      return (
          <Link href="/admin" className="nav-link text-white px-3 py-2" aria-current={pathname === '/admin' ? 'page' : undefined}>
            Admin
          </Link>
      );
    }
  }


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
      return (
        <div className="d-flex align-items-center ms-auto">
          {session && (
            <span className="text-white">
              Prisijungęs, kaip {session?.user?.name}
            </span>
          )}
          <button
            className="btn btn-danger ms-2"
            onClick={() => {
              signOut({ redirect: false }).then(() => {
                router.push("/"); 
              });
            }}
          >
            <IoMdLogOut className="me-2" /> Atsijungti
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
