'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { User } from '@/models/User';
import { toast } from "react-hot-toast";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [expandedOrdersId, setExpandedOrdersId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data);
      } catch {
        setError('Klaida įkeliant vartotojų sąrašą');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const openModal = (user: User | null) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  const toggleUserDetails = (userId: string) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
    if (expandedOrdersId === userId) {
      setExpandedOrdersId(null);
    }
  };

  const retrieveUserReservations = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/reservations/user/${userId}`);
      if (!res.ok) throw new Error("Klaida gaunant rezervacijas");
      const data = await res.json();
      if (data.reservationDetails.length === 0) {
        setReservations([]); 
        toast.error("Vartotojas neturi užsakymų");  
      } else {
        setReservations(data.reservationDetails);
      }
      setExpandedOrdersId(userId);
    } catch (error) {
      console.error("Klaida gaunant rezervacijas:", error);
      toast.error("Klaida įkeliant užsakymus");
    }
  };
  

  const cancelReservation = async (reservationId: string) => {
    if (!window.confirm("Ar tikrai norite atšaukti šią rezervaciją?")) return;

    try {
        const res = await fetch(`/api/admin/reservations/${reservationId}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error("Klaida atšaukiant rezervaciją");

        toast.success("Rezervacija atšaukta");

        setReservations((prev) => prev.filter((res) => res.reservationId !== reservationId));
    } catch (error) {
        toast.error("Klaida atšaukiant rezervaciją");
        console.error(error);
    }
};


  const resetPassword = (userId: string) => {
    alert(`Slaptažodis vartotojui ${userId} buvo atstatytas`);
  };

  const editUser = async (updatedUser: User) => {
    try {
      const res = await fetch(`/api/admin/users?id=${updatedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error('Nepavyko atnaujinti vartotojo');

      const data = await res.json();
      setUsers((prev) =>
        prev.map((user) => (user._id === data._id ? data : user))
      );
      closeModal();
    } catch {
      setError('Klaida atnaujinant vartotoją');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Nepavyko pašalinti vartotojo');

      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch {
      setError('Klaida šalinant vartotoją');
    }
  };

  if (loading) return <p>Įkeliama...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Vartotojų Valdymas</h1>

      <div className="card shadow-sm p-4">
        <h2>Vartotojų Sąrašas</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Vardas Pavardė</th>
              <th>El. paštas</th>
              <th>Telefonas</th>
              <th>Sukurta</th>
              <th>Užsakymai</th>
              <th>Rolė</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <React.Fragment key={user._id}>
                <tr>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>{user.orderHistory ? user.orderHistory.length : 0}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="btn btn-info btn-sm" onClick={() => toggleUserDetails(user._id)}>
                      Peržiūrėti
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => retrieveUserReservations(user._id)}>
                      Užsakymai
                    </button>
                  </td>
                </tr>

                {expandedUserId === user._id && (
                  <tr>
                    <td colSpan={7}>
                      <div className="expanded-details">
                        <p><strong>Vartotojo informacija</strong></p>
                        <p><strong>Vardas Pavardė:</strong> {user.name}</p>
                        <p><strong>El. paštas:</strong> {user.email}</p>
                        <p><strong>Telefonas:</strong> {user.phone}</p>
                        <p><strong>Sukurta:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                        <p><strong>Rolė:</strong> {user.role}</p>

                        <button className="btn btn-warning btn-sm me-2" onClick={() => resetPassword(user._id)}>
                          Atstatyti slaptažodį
                        </button>
                        <button className="btn btn-info btn-sm me-2" onClick={() => openModal(user)}>
                          Redaguoti duomenis
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user._id)}>
                          Pašalinti vartotoją
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {expandedOrdersId === user._id && (
                  <tr>
                    <td colSpan={7}>
                      <div className="order-history">
                        <h5>Užsakymų Istorija</h5>
                        {reservations.length > 0 ? (
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Užsakymo ID</th>
                                <th>Salė - Vieta</th>
                                <th>Data</th>
                                <th>Svečiai</th>
                                <th>Statusas</th>
                                <th>Veiksmai</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reservations.map((reservation) => (
                                <tr key={reservation.reservationId}>
                                  <td>{reservation.reservationId}</td>
                                  <td>{reservation.venueName} - {reservation.venueLocation}</td>
                                  <td>{reservation.reservationDate}</td>
                                  <td>{reservation.guests}</td>
                                  <td>{reservation.status}</td>
                                  <td>
                                    {reservation.status !== 'canceled' && (
                                      <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => cancelReservation(reservation.reservationId)}
                                      >
                                        Atšaukti rezervaciją
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>Vartotojas neturi užsakymų.</p> 
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedUser && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Redaguoti vartotoją</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (selectedUser) {
                      editUser(selectedUser);
                    }
                  }}
                >
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Vardas Pavardė</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={selectedUser.name}
                      onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Telefono numeris</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      value={selectedUser.phone}
                      onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Rolė</label>
                    <select
                      id="role"
                      className="form-select"
                      value={selectedUser.role}
                      onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                    >
                      <option value="user">Vartotojas</option>
                      <option value="admin">Administratorius</option>
                      <option value="employee">Darbuotojas</option>
                      <option value="federation">Federacija</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary">Išsaugoti pakeitimus</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
