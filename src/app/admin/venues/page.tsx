'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import Venue from '@/models/Venues';

export default function VenueManagement() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  

  useEffect(() => {
    async function fetchVenues() {
      try {
        const res = await fetch('/api/admin/venues');
        if (!res.ok) throw new Error('Failed to fetch venues');
        const data = await res.json();
        setVenues(data);
      } catch (err) {
        setError('Klaida įkeliant vietų sąrašą');
      } finally {
        setLoading(false);
      }
    }
    fetchVenues();
  }, []);

  const openModal = (venue: Venue | null) => {
    setSelectedVenue(venue || { name: '', description: '', capacity: 0, contactPhone: '', status: 'active' });
    setIsEditing(!!venue); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVenue(null);
    setIsEditing(false); 
  };

  const saveVenue = async (venueData: Venue) => {
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/admin/venues?id=${venueData._id}` : '/api/admin/venues';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venueData),
      });

      if (!res.ok) throw new Error('Nepavyko išsaugot ');

      const updatedVenue = await res.json();
      setVenues((prev) =>
        isEditing
          ? prev.map((v) => (v._id === updatedVenue._id ? updatedVenue : v))
          : [...prev, updatedVenue]
      );
      closeModal();
    } catch {
      setError('Klaida įrašant salę');
    }
  };

  const deleteVenue = async (venueId: string) => {
    try {
      const res = await fetch(`/api/admin/venues?id=${venueId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Nepavyko ištrinti');

      setVenues((prev) => prev.filter((v) => v._id !== venueId));
    } catch {
      setError('Klaida šalinant salę');
    }
  };

  if (loading) return <p>Įkeliama...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Salių Valdymas</h1>

      <button className="btn btn-primary mb-4" onClick={() => openModal(null)}>
        Pridėti naują salę
      </button>

      <div className="card shadow-sm p-4">
        <h2>Vietų Sąrašas</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Pavadinimas</th>
              <th>Vieta</th>
              <th>Talpa</th>
              <th>Kontaktinis telefonas</th>
              <th>Statusas</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {venues.map((venue) => (
              <tr key={venue._id}>
                <td>{venue.name}</td>
                <td>{venue.location}</td>
                <td>{venue.capacity}</td>
                <td>{venue.contactPhone || 'Nėra'}</td>
                <td>{venue.status}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => openModal(venue)}
                  >
                    Redaguoti
                  </button>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => deleteVenue(venue._id)}
                  >
                    Pašalinti
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditing ? 'Redaguoti salę' : 'Pridėti naują salę'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>

              <div className="modal-body">
  <form
    onSubmit={(e) => {
      e.preventDefault();
      saveVenue(selectedVenue!);
    }}
  >
    <div className="mb-3">
      <label htmlFor="name" className="form-label">
        Pavadinimas
      </label>
      <input
        type="text"
        className="form-control"
        id="name"
        value={selectedVenue?.name || ''}
        onChange={(e) =>
          setSelectedVenue((prev) => ({ ...prev!, name: e.target.value }))
        }
        required
      />
    </div>

    <div className="mb-3">
      <label htmlFor="location" className="form-label">
        Vieta
      </label>
      <input
        type="text"
        className="form-control"
        id="location"
        value={selectedVenue?.location || ''}
        onChange={(e) =>
          setSelectedVenue((prev) => ({ ...prev!, location: e.target.value }))
        }
        required
      />
    </div>
    <div className="mb-3">
      <label htmlFor="description" className="form-label">
        Aprašymas
      </label>
      <textarea
        className="form-control"
        id="description"
        value={selectedVenue?.description || ''}
        onChange={(e) =>
          setSelectedVenue((prev) => ({ ...prev!, description: e.target.value }))
        }
      />
    </div>
    <div className="mb-3">
      <label htmlFor="capacity" className="form-label">
        Talpa
      </label>
      <input
        type="number"
        className="form-control"
        id="capacity"
        value={selectedVenue?.capacity || 0}
        onChange={(e) =>
          setSelectedVenue((prev) => ({
            ...prev!,
            capacity: parseInt(e.target.value, 10) || 0,
          }))
        }
        required
        min={1}
      />
    </div>
    <div className="mb-3">
      <label htmlFor="contactPhone" className="form-label">
        Kontaktinis telefonas
      </label>
      <input
        type="tel"
        className="form-control"
        id="contactPhone"
        value={selectedVenue?.contactPhone || ''}
        onChange={(e) =>
          setSelectedVenue((prev) => ({ ...prev!, contactPhone: e.target.value }))
        }
        pattern="^\+?\d{10,15}$"
        title="Netinkamas formatas"
      />
    </div>
    <div className="mb-3">
      <label htmlFor="status" className="form-label">
        Statusas
      </label>
      <select
        className="form-select"
        id="status"
        value={selectedVenue?.status || 'active'}
        onChange={(e) =>
          setSelectedVenue((prev) => ({ ...prev!, status: e.target.value as "active" | "inactive" }))
        }
        required
      >
        <option value="active">Aktyvus</option>
        <option value="inactive">Neaktyvus</option>
      </select>
    </div>
    <button type="submit" className="btn btn-primary">
      {isEditing ? 'Atnaujinti salę' : 'Pridėti salę'}
    </button>
  </form>
</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
