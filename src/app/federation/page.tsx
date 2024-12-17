'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button, Card, Form, Modal, Spinner } from 'react-bootstrap';

export default function FederationPage() {
  const { status } = useSession();
  const router = useRouter();
  
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    location: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (status === 'authenticated' && !userHasFederationRole()) {
    router.push('/');
  }

  function userHasFederationRole() {
    const user = useSession().data?.user;
    return user?.role === 'federation';
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Įvykis sėkmingai sukurtas!');
        setShowModal(true);
      } else {
        toast.error(data.error || 'Nepavyko sukurti įvykio');
      }
    } catch (error) {
      toast.error('Įvyko klaida kuriant įvykį');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card className="shadow-lg p-4 mb-4 animate__animated animate__fadeIn">
            <Card.Body>
              <Card.Title className="text-center">Sukurti naujas varžybas</Card.Title>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Varžybų pavadinimas</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={eventData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Varžybų data ir laikas</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="date"
                    value={eventData.date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Vieta</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={eventData.location}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Aprašymas</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={eventData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <div className="text-center">
                  <Button variant="primary" type="submit">
                    Sukurti varžybas
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Įvykis sėkmingai sukurtas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Jūsų įvykis buvo sėkmingai sukurtas.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Užverti
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
