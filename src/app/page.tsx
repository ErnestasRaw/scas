'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; 
import { toast } from "react-hot-toast";
import Image from "next/image";
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
        const data: Venue[] = await response.json();
        setVenues(data);
        setLoading(false);
      } catch (error) {
        console.error("Nepavyko gauti salių:", error);
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
    <main className="bg-light py-5">
      <section className="container text-center mb-5">
        <div className="d-flex justify-content-center align-items-center mb-4">
          <Image
            src="/images/SCAS.png"
            alt="SCAS Logo"
            width={150}
            height={150}
            className="shadow-lg"
          />
        </div>
        <p className="text-muted fs-4">JŪSŲ SPORTO CENTRAS NR. 1</p>
      </section>

      <section className="container">
        <h2 className="text-success text-center mb-4">Laisvos salės</h2>
        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : venues.length > 0 ? (
          <div className="row">
            {venues.map((venue) => (
              <div key={venue._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-lg border-0 rounded-3">
                  {/* <img
                   // src="/images/venue-placeholder.jpg"
                    className="card-img-top rounded-3"
                    alt={venue.name}
                  /> */}
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h4 className="card-title"><strong>{venue.name}</strong></h4>
                    <p className="card-description"> <strong>Aprašymas: </strong>{venue.description}</p>
                    <p className="card-text">
                      <strong>Vieta:</strong> {venue.location}
                    </p>
                    <p className="card-text">
                      <strong>Talpa:</strong> {venue.capacity}
                    </p>
                    <div className="mt-3 text-center">
                      <button
                        className="btn btn-success w-100 py-2 rounded-pill shadow-sm"
                        onClick={() => handleReserve(venue._id)}
                      >
                        Rezervuoti
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">Nėra laisvų salių.</p>
        )}
      </section>
    </main>
  );
}
