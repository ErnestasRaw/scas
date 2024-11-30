'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; 
import { toast } from "react-hot-toast";
import Image from "next/image";
import styles from "@/app/styles/page.module.css";
import { useEffect, useState } from "react";
import { Venue } from "@/models/Venues";

export default function HomePage() {
  const { status } = useSession();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch("/api/venues");
        const data: typeof Venue[] = await response.json();
        setVenues(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching venues:", error);
        toast.error("Nepavyko įkelti salių duomenų");
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  function handleReserve(venueId: string) {
    if (status === "authenticated") {
      router.push(`/venues/${venueId}`);
    } else {
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
        <p className={styles.description}>JŪSŲ SPORTO CENTRAS NR. 1</p>
      </section>

      <section className={styles.venues}>
        <h2 className={styles.sectionTitle}>Laisvos salės</h2>
        <div className={styles.grid}>
          {loading ? (
            <p>Kraunama...</p>
          ) : venues.length > 0 ? (
            venues.map((venue) => (
              <div key={venue._id} className={styles.card}>
                <h3>{venue.name}</h3>
                <p>Vieta: {venue.location}</p>
                <p>Talpa: {venue.capacity}</p>
                <button onClick={() => handleReserve(venue._id)}>
                  Rezervuoti
                </button>
              </div>
            ))
          ) : (
            <p>Nėra laisvų salių.</p>
          )}
        </div>
      </section>
    </main>
  );
}
