'use client';
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, Button, Card, Form } from "react-bootstrap"; 
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
      <Card className="shadow p-4 animate__animated animate__zoomIn animate__delay-1s" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          <h1 className="text-center mb-4 animate__animated animate__fadeInUp">Prisijungimas</h1>
          {error && <Alert variant="danger" className="text-center animate__animated animate__fadeInUp">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email" className="mb-3 animate__animated animate__fadeInUp animate__delay-1s">
              <Form.Label>El.pašto adresas</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Įrašyk savo el.pašto adresą"
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3 animate__animated animate__fadeInUp animate__delay-1s">
              <Form.Label>Slaptažodis</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Įvesk savo slaptažodį"
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 animate__animated animate__pulse animate__delay-2s">
              Prisijungti
            </Button>
          </Form>

          <div className="text-center mt-3 animate__animated animate__fadeInUp">
            <Link href="/register" className="text-decoration-none">
              Neturi paskyros? Spausk čia, jog registruotis!
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
