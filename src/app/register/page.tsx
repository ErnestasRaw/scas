'use client';
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@@/actions/register";
import { Alert, Button, Card, Form } from "react-bootstrap"; 
import "animate.css/animate.min.css";

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null); 
    const result = await register({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
    });

    if (result?.error) {
      setError(result.error); 
    } else {
      ref.current?.reset();
      router.push("/login");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 animate__animated animate__fadeIn">
      <Card
        className="shadow p-4 animate__animated animate__zoomIn animate__delay-1s"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <Card.Body>
          <h1 className="text-center mb-4 animate__animated animate__fadeInUp">
            Registracija
          </h1>

          {error && (
            <Alert
              variant="danger"
              className="text-center animate__animated animate__fadeInUp"
            >
              {error}
            </Alert>
          )}

          <Form
            ref={ref}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(ref.current!);
              handleSubmit(formData);
            }}
          >
            <Form.Group controlId="name" className="mb-3 animate__animated animate__fadeInUp animate__delay-1s">
              <Form.Label>Vardas Pavardė</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Vardas Pavardė"
                required
              />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3 animate__animated animate__fadeInUp animate__delay-1s">
              <Form.Label>El.pašto adresas</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="El.pašto adresas"
                required
              />
            </Form.Group>

            <Form.Group controlId="phone" className="mb-3 animate__animated animate__fadeInUp animate__delay-1s">
              <Form.Label>Telefono numeris</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder="Telefono numeris"
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3 animate__animated animate__fadeInUp animate__delay-1s">
              <Form.Label>Slaptažodis</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Slaptažodis"
                required
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 animate__animated animate__pulse animate__delay-3s"
            >
              Registruotis
            </Button>
          </Form>

          <div className="text-center mt-3 animate__animated animate__fadeInUp">
            <Link href="/login" className="text-decoration-none">
              Jau turi paskyrą? Spausk čia, kad prisijungti!
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
