'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession(); 
  const router = useRouter();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (session?.user.role !== "admin") {
      throw new Error("Neturi pakankamų teisių!");
      return;
    }

    setLoading(false); 
  }, [session, status, router]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Administratoriaus Valdymo Panelė</h1>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-4">
            <h2>Peržiūra</h2>
            <p>Visas Inventorius: 123</p>
            <p>Laukiantys Užsakymai: 5</p>
            <p>Trūkstami Daiktai: 2</p>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-4">
            <h2>Inventoriaus Valdymas</h2>
            <ul>
              <li><a href="/admin/inventory">Peržiūrėti Inventorių</a></li>
              <li><a href="/admin/inventory/order">Užsisakyti Naują Inventorių</a></li>
              <li><a href="/admin/reports">Generuoti Ataskaitas</a></li>
            </ul>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-4">
            <h2>Klientų Valdymas</h2>
            <ul>
              <li><a href="/admin/users">Peržiūrėti Klientus</a></li>
              <li><a href="/admin/clients/orders">Klientų Užsakymų Istorija</a></li>
            </ul>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-4">
            <h2>Pranešimai</h2>
            <p>Turite 3 naujus pranešimus</p>
            <a href="/admin/notifications">Peržiūrėti Visus Pranešimus</a>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-4">
            <h2>Salės</h2>
            <a href="/admin/venues">Tvarkyti sales</a>

          </div>
        </div>
      </div>
    </div>
  );
}
