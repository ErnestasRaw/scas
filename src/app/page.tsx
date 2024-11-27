'use client';
import Image from "next/image";
import styles from "@/app/styles/page.module.css";
import { signOut, useSession } from "next-auth/react";
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const { data: session, status } = useSession(); 
  function handleReserve() {
    if (status === "authenticated") {
      toast.success("Rezervacija sėkminga");
    }
    else 
    {
      toast.error("Jūs turite prisijungti, kad galėtumėte rezervuoti"); 
    }
    
  }
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <Image 
          src="/images/SCAS.png" 
          alt="Logo" 
          width={150} 
          height={150} 
          className={styles.logo} 
        />
        <h1 className={styles.title}>SCAS</h1>
        <p className={styles.description}>
          JŪSŲ SPORTO CENTRAS NR. 1
        </p>
      </section>

      <section className={styles.venues}>
        <h2 className={styles.sectionTitle}>Laisvos salės</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Krepšinio aikštė</h3>
            <button onClick={handleReserve}>Rezervuoti</button>
          </div>
        </div>
      </section>
    </main>
  );
}
