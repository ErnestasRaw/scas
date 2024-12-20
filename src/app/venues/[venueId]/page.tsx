'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { Venue } from "@/models/Venues";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Button, Card, Col, Row, Spinner } from "react-bootstrap";
import "animate.css/animate.min.css";

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
      toast.success('Rezervacija atlikta');
      setSelectedTime(null);

    } catch (error) {
      console.error("Klaida kuriant užsakymą:", error);
      toast.error("Klaida kuriant užsakymą");
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5 animate__animated animate__fadeIn">
        <Spinner animation="border" variant="primary" />
        <p>Įkeliama...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-5 animate__animated animate__shakeX">
        <p className="text-danger">Klaida: {error}</p>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="text-center my-5 animate__animated animate__fadeOut">
        <p>Vieta neegzistuoja.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 animate__animated animate__fadeInUp">
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-lg h-100">
            <Card.Body>
              <h1 className="card-title text-primary display-4 animate__animated animate__zoomIn">{venue.name}</h1>
              <p className="card-text mt-3"><strong>Aprašymas: </strong> {venue.description}</p>
              <p className="card-text"><strong>Vieta: </strong> {venue.location}</p>
              <p className="card-text"><strong>Talpa: </strong> {venue.capacity}</p>
              {venue.contactPhone && (
                <p className="card-text"><strong>Kontaktai:</strong> {venue.contactPhone}</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-lg h-100">
            <Card.Body>
              <h5 className="card-title text-center animate__animated animate__fadeInUp">Pasirinkite rezervacijos datą</h5>
              <div className="d-flex justify-content-center my-3">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  minDate={new Date()}
                  className="animate__animated animate__fadeIn animate__delay-1s"
                />
              </div>
              {selectedDate && (
                <>
                  <h5 className="card-title text-center mt-4 animate__animated animate__fadeInUp">Pasirinkite laiką</h5>
                  <div className="d-flex flex-wrap justify-content-center my-3">
                    {filteredTimeSlots.map((time) => (
                      <Button
                        key={time}
                        variant="outline-primary"
                        className={`m-1 ${selectedTime === time ? "active" : ""} animate__animated animate__fadeIn`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </>
              )}
              <div className="text-center mt-4">
                <Button
                  variant="success"
                  className="w-100 animate__animated animate__pulse animate__delay-2s"
                  onClick={handleReserve}
                  disabled={!selectedDate || !selectedTime}
                >
                  Rezervuoti
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VenuePage;
