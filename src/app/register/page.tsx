'use client';
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@@/actions/register";
import "animate.css/animate.min.css";

export default function Register() {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    console.log(formData.get("phone"));
    const r = await register({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
    });
    ref.current?.reset();
    if (r?.error) {
      setError(r.error);
      return;
    } else {
      return router.push("/login");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 animate__animated animate__fadeIn">
      <div
        className="card shadow p-4 animate__animated animate__zoomIn animate__delay-1s"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h1 className="text-center mb-4 animate__animated animate__fadeInUp">Registracija</h1>
        {error && <div className="alert alert-danger text-center animate__animated animate__fadeInUp">{error}</div>}
        <form
          ref={ref}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(ref.current!);
            handleSubmit(formData);
          }}
        >
          <div className="mb-3 animate__animated animate__fadeInUp animate__delay-1s">
            <label htmlFor="name" className="form-label">Vardas Pavardė</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="Vardas Pavardė"
              required
            />
          </div>
          <div className="mb-3 animate__animated animate__fadeInUp animate__delay-1s">
            <label htmlFor="email" className="form-label">El.pašto adresas</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="El.pašto adresas"
              required
            />
          </div>
          <div className="mb-3 animate__animated animate__fadeInUp animate__delay-1s">
            <label htmlFor="phone" className="form-label">Telefono numeris</label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="form-control"
              placeholder="Telefono numeris"
              required
            />
          </div>
          <div className="mb-3 animate__animated animate__fadeInUp animate__delay-1s">
            <label htmlFor="password" className="form-label">Slaptažodis</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Slaptažodis"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 animate__animated animate__pulse animate__delay-3s">
            Registruotis
          </button>
        </form>
        <div className="text-center mt-3 animate__animated animate__fadeInUp">
          <Link href="/login" className="text-decoration-none">
            Jau turi paskyrą? Spausk čia, kad prisijungti!
          </Link>
        </div>
      </div>
    </div>
  );
}
