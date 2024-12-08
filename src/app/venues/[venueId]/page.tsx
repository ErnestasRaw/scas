'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { Venue } from "@/models/Venues";
import { useSession } from "next-auth/react";

const VenuePage = () => {
  const { venueId } = useParams();
  const { data: session, status } = useSession();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [filteredTimeSlots, setFilteredTimeSlots] = useState<string[]>([]);
  const timeSlots = Array.from({ length: 15 }, (_, i) => `${(9 + i).toString().padStart(2, '0')}:00`);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(`/api/venues/${venueId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Klaida užklausoj");
        }
        const data: Venue = await response.json();
        setVenue(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Klaida");
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchVenue();
    }
  }, [venueId]);

  const fetchReservationTimes = async (selectedDate: Date) => {
    if (!selectedDate) return;

    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const url = `/api/reservations/${venueId}?date=${formattedDate}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Nepavyko gauti užsakymų");
      }

      const data = await res.json();

      if (!Array.isArray(data.reservedTimes)) {
        throw new Error("Užsakymų duomenys formatas neteisingas");
      }

      filterReservedTimes(data.reservedTimes);
    } catch (error) {
      console.error("Klaida gaunant užsakymus:", error);
    }
  };

  const filterReservedTimes = (reservedTimes: string[]) => {
    const availableTimeSlots = timeSlots.filter((time) => !reservedTimes.includes(time));

    setFilteredTimeSlots(availableTimeSlots);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    fetchReservationTimes(date);
  };

  const handleReserve = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }
  
    try {
      // Create a new reservation
      const url = `/api/reservations`;
      const body = JSON.stringify({
        venueId,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
        userId: session?.user?._id,
        status: "pending",
      });
  
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
  
      if (!res.ok) {
        throw new Error("Nepavyko išsaugoti užsakymo");
      }
  
      fetchReservationTimes(selectedDate);
  
      setSelectedTime(null);
  
    } catch (error) {
      console.error("Klaida kuriant užsakymą:", error);
    }
  };
  

  if (loading) {
    return <div className="text-center my-5"><p>Įkeliama...</p></div>;
  }

  if (error) {
    return <div className="text-center my-5"><p className="text-danger">Klaida: {error}</p></div>;
  }

  if (!venue) {
    return <div className="text-center my-5"><p>Vieta neegzistuoja.</p></div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-lg h-100">
            <div className="card-body">
              <h1 className="card-title text-primary">{venue.name}</h1>
              <p className="card-text mt-3">{venue.description}</p>
              <p className="card-text">
                <strong>Talpa:</strong> {venue.capacity}
              </p>
              {venue.contactPhone && (
                <p className="card-text">
                  <strong>Kontaktai:</strong> {venue.contactPhone}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-lg h-100">
            <div className="card-body">
              <h5 className="card-title text-center">Pasirinkite rezervacijos datą</h5>
              <div className="d-flex justify-content-center my-3">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  minDate={new Date()} 
                />
              </div>
              {selectedDate && (
                <>
                  <h5 className="card-title text-center mt-4">Pasirinkite laiką</h5>
                  <div className="d-flex flex-wrap justify-content-center my-3">
                    {filteredTimeSlots.map((time) => (
                      <button
                        key={time}
                        className={`btn btn-outline-primary m-1 ${selectedTime === time ? "active" : ""}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div className="text-center mt-4">
                <button
                  className="btn btn-success w-100"
                  onClick={handleReserve}
                  disabled={!selectedDate || !selectedTime}
                >
                  Rezervuoti
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenuePage;
