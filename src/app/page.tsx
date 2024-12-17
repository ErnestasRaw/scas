'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; 
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Venue, venueTypes } from "@/models/Venues";
import { Button, Form, Spinner, Card, Row, Col } from "react-bootstrap"; 
import "animate.css/animate.min.css";

export default function HomePage() {
  const { status } = useSession();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [capacityFilter, setCapacityFilter] = useState<number | "">("");
  const router = useRouter();
  const venueTypeLabels: Record<venueTypes, string> = {
    [venueTypes.Conference]: "Konferencijų salė",
    [venueTypes.Sport]: "Sporto salė",
    [venueTypes.Event]: "Renginių salė",
  };

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch("/api/venues");
        const data: Venue[] = await response.json();
        setVenues(data);
        setFilteredVenues(data);
        setLoading(false);
      } catch (error) {
        console.error("Nepavyko gauti salių:", error);
        toast.error("Nepavyko įkelti salių duomenų");
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  useEffect(() => {
    let results = venues;

    if (searchQuery) {
      results = results.filter((venue) =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter) {
      results = results.filter((venue) => venue.venueType === typeFilter);
    }

    if (capacityFilter) {
      results = results.filter((venue) => venue.capacity >= capacityFilter);
    }

    setFilteredVenues(results);
  }, [searchQuery, typeFilter, capacityFilter, venues]);

  function handleReserve(venueId: string) {
    if (status === "authenticated") {
      router.push(`/venues/${venueId}`);
    } else {
      toast.error("Jūs turite prisijungti, kad galėtumėte rezervuoti");
    }
  }

  return (
    <main className="bg-light py-5 animate__animated animate__fadeIn">
      {/* <section className="container text-center mb-5">
        <div className="d-flex justify-content-center align-items-center mb-4 animate__animated animate__fadeIn animate__delay-1s">
          <Image
            src="/images/SCAS.png"
            alt="SCAS Logo"
            width={100}
            height={100}
            className="shadow-lg d-relative"
          />
        </div>
        <p className="text-muted fs-4 animate__animated animate__fadeIn animate__delay-2s">JŪSŲ SPORTO CENTRAS NR. 1</p>
      </section> */}

      <section className="container mb-4">
        <h3 className="mb-3 text-success">Filtrai</h3>
        <Row className="g-3">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Ieškoti pagal raktažodį"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Pasirinkti tipą</option>
              <option value="sport">Sporto salė</option>
              <option value="conference">Konferencijų salė</option>
              <option value="event">Renginių salė</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Control
              type="number"
              placeholder="Minimalus dydis (talpa)"
              value={capacityFilter || ""}
              onChange={(e) =>
                setCapacityFilter(e.target.value ? parseInt(e.target.value, 10) : "")
              }
            />
          </Col>
        </Row>
      </section>

      <section className="container">
        <h2 className="text-success text-center mb-4 animate__animated animate__fadeInUp">Laisvos salės</h2>
        {loading ? (
          <div className="d-flex justify-content-center animate__animated animate__fadeIn animate__delay-1s">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : filteredVenues.length > 0 ? (
          <Row>
            {filteredVenues.map((venue) => (
              <Col key={venue._id} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-lg border-0 rounded-3 animate__animated animate__fadeInUp">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <Card.Title><strong>{venue.name}</strong></Card.Title>
                    <Card.Text><strong>Aprašymas: </strong>{venue.description}</Card.Text>
                    <Card.Text><strong>Vieta:</strong> {venue.location}</Card.Text>
                    <Card.Text><strong>Talpa:</strong> {venue.capacity}</Card.Text>
                    <Card.Text><strong>Tipas:</strong> {venueTypeLabels[venue.venueType as venueTypes]}</Card.Text>
                    <div className="mt-3 text-center">
                      <Button
                        variant="success"
                        className="w-100 py-2 rounded-pill shadow-sm animate__animated animate__pulse animate__delay-2s"
                        onClick={() => handleReserve(venue._id)}
                      >
                        Rezervuoti
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center animate__animated animate__fadeOut">Pagal pasirinktus kriterijus salių nerasta.</p>
        )}
      </section>
    </main>
  );
}
