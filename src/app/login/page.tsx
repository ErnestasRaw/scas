'use client';
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "animate.css/animate.min.css";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) {
      setError(res.error as string);
    }
    if (res?.ok) {
      return router.push("/");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 animate__animated animate__fadeIn">
      <div
        className="card shadow p-4 animate__animated animate__zoomIn animate__delay-1s"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h1 className="text-center mb-4 animate__animated animate__fadeInUp">Prisijungimas</h1>
        {error && <div className="alert alert-danger text-center animate__animated animate__fadeInUp">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3 animate__animated animate__fadeInUp animate__delay-1s">
            <label htmlFor="email" className="form-label">El.pašto adresas</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Įrašyk savo el.pašto adresą"
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
              placeholder="Įvesk savo slaptažodį"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 animate__animated animate__pulse animate__delay-2s">
            Prisijungti
          </button>
        </form>
        <div className="text-center mt-3 animate__animated animate__fadeInUp">
          <Link href="/register" className="text-decoration-none">
            Neturi paskyros? Spausk čia, jog registruotis!
          </Link>
        </div>
      </div>
    </div>
  );
}
