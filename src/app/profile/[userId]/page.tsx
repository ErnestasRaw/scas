'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button, Card, Spinner, Modal, Form } from 'react-bootstrap';
import { UserDocument } from '@/models/User';
import { ReservationDocument } from '@/models/Reservations';

export default function ProfilePage() {
  const { status } = useSession();
  const { userId } = useParams();
  const router = useRouter();
  
  const [user, setUser] = useState<UserDocument | null>(null);
  const [reservations, setReservations] = useState<ReservationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UserDocument | null>(null); 
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [venueInfo, setVenueInfo] = useState(null);
  const [showVenueModal, setShowVenueModal] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      if (userId) {
        async function fetchUserProfile() {
          try {
            const response = await fetch(`/api/users/${userId}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
              setUser(data);
              setUpdatedUser(data);
            } else {
              toast.error(data.error || 'Klaida užkraunant profilį');
            }
          } catch (error) {
            toast.error('Nepavyko užkrauti profilio');
          } finally {
            setLoading(false);
          }
        }

        async function fetchUserReservations() {
          try {
            const response = await fetch(`/api/users/${userId}/get-reservations`);
            const data = await response.json();
            if (response.ok) {
              setReservations(data);
            } else {
              toast.error(data.error || 'Klaida užkraunant rezervacijas');
            }
          } catch (error) {
            toast.error('Nepavyko užkrauti rezervacijų');
          }
        }

        fetchUserProfile();
        fetchUserReservations();
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [userId, status, router]);

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(updatedUser);
        toast.success('Profilis atnaujintas');
        setShowProfileModal(false);
        signOut({ redirect: true });
      } else {
        toast.error(data.error || 'Nepavyko atnaujinti profilio');
      }
    } catch (error) {
      toast.error('Nepavyko atnaujinti profilio');
    }
  };

  // pabaigti
  const handleCancelReservation = async (reservationId: string) => {
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Slaptažodžiai nesutampa');
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Slaptažodis sėkmingai pakeistas');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }); 
        signOut({ redirect: true });
      } else {
        toast.error(data.error || 'Nepavyko pakeisti slaptažodžio');
      }
    } catch (error) {
      console.error(error);
      toast.error('Nepavyko pakeisti slaptažodžio');
    }
  };

  const handleMoreInfo = async (venueId: string) => {
    try {
      const response = await fetch(`/api/venues/${venueId}`);
      const data = await response.json();
      if (response.ok) {
        setVenueInfo(data);
        setShowVenueModal(true);
      } else {
        toast.error(data.error || 'Nepavyko gauti informacijos apie salę');
      }
    } catch (error) {
      toast.error('Nepavyko gauti informacijos apie salę');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!user) {
    return <div>Profilis nerastas</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card className="shadow-lg p-4 mb-4 animate__animated animate__fadeIn">
            <Card.Body>
              <Card.Title className="text-center">{user.name}'s Profilis</Card.Title>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p><strong>El. paštas:</strong> {user.email}</p>
                  <p><strong>Telefonas:</strong> {user.phone}</p>
                </div>
                <div className="text-end">
                  <Button variant="primary" onClick={() => setShowProfileModal(true)}>
                    Redaguoti profilį
                  </Button>
                  <Button variant="warning" onClick={() => setShowPasswordModal(true)}>
                    Keisti slaptažodį
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow-lg p-4 mb-4 animate__animated animate__fadeIn">
            <Card.Body>
              <Card.Title className="text-center">Mano rezervacijos</Card.Title>
              {reservations.length === 0 ? (
                <p>Rezervacijų nerasta</p>
              ) : (
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Rezervacijos data</th>
                      <th>Statusas</th>
                      <th>Veiksmas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation._id}>
                        <td>{new Date(reservation.reservationDate).toLocaleString()}</td>
                        <td>{reservation.status}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="danger"
                              onClick={() => handleCancelReservation(reservation._id)}
                              disabled={reservation.status === 'Cancelled'}
                            >
                              Atšaukti
                            </Button>
                            <Button
                              variant="info"
                              onClick={() => handleMoreInfo(reservation.venueId._id)}
                            >
                              Daugiau informacijos
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card.Body>
          </Card>

          <Modal show={showVenueModal} onHide={() => setShowVenueModal(false)} centered size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Salės informacija</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {venueInfo ? (
                <div>
                  <h4 className="text-center">{venueInfo.name}</h4>
                  <p><strong>Vieta:</strong> {venueInfo.location}</p>
                  <p><strong>Aprašymas:</strong> {venueInfo.description}</p>
                  <p><strong>Talpa:</strong> {venueInfo.capacity}</p>
                  <p><strong>Kontaktinis telefonas:</strong> {venueInfo.contactPhone}</p>
                  <p><strong>Salės tipas:</strong> {venueInfo.venueType}</p>
                </div>
              ) : (
                <p>Kraunama salės informacija...</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowVenueModal(false)}>
                Uždaryti
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Pakeisti slaptažodį</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Esamas slaptažodis</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Naujas slaptažodis</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Pakartoti naują slaptažodį</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                Uždaryti
              </Button>
              <Button variant="primary" onClick={handleChangePassword}>
                Pakeisti slaptažodį
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Redaguoti profilį</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Vardas</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedUser?.name || ''}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>El. paštas</Form.Label>
                  <Form.Control
                    type="email"
                    value={updatedUser?.email || ''}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Telefono numeris</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedUser?.phone || ''}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, phone: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
                Uždaryti
              </Button>
              <Button variant="primary" onClick={handleUpdateUser}>
                Išsaugoti pakeitimus
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}
