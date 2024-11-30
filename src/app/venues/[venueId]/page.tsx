'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type  { Venue } from "@/models/Venues";
import styles from "@/app/styles/venue.module.css";


const VenuePage = () => {
  const { venueId } = useParams(); 
  const [venue, setVenue] = useState<typeof Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await fetch(`/api/venues/${venueId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch venue");
        }

        const data: typeof Venue = await response.json();
        setVenue(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (venueId) {
      fetchVenue();
    }
  }, [venueId]);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!venue) {
    return <p>Venue not found.</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.venueCard}>
        <h1 className={styles.venueName}>{venue?.name}</h1>
        <p className={styles.venueDescription}>{venue?.description}</p>
        <p className={styles.venueCapacity}>Capacity: {venue?.capacity}</p>
        {venue?.contactPhone && (
          <p className={styles.venuePhone}>Contact: {venue.contactPhone}</p>
        )}
        <button className={styles.reserveButton}>Reserve</button>
      </div>
    </div>
  );
}

export default VenuePage;
