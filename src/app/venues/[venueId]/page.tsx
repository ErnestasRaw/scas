'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use the `useParams` hook to access the venueId from the URL
import  Venue  from "@/models/Venues";


const VenuePage = () => {
  const { venueId } = useParams(); 
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVenue() {
      try {
        console.log(venueId);
        const response = await fetch(`/api/venues/${venueId}`);
        console.log(response);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch venue");
        }

        const data: Venue = await response.json();
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
    <div>
      <h1>{venue.name}</h1>
      <p>{venue.description}</p>
      <p>Capacity: {venue.capacity}</p>
      <p>Status: {venue.status}</p>
      {venue.contactPhone && <p>Contact: {venue.contactPhone}</p>}
    </div>
  );
};

export default VenuePage;
