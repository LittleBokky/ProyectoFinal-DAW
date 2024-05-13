import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data = await response.json();

      const userSession = data.user;
      const token = data.token;
      const userId = data.user_id;

      // Guardar userSession y token en localStorage
      localStorage.setItem("userSession", userSession);
      localStorage.setItem("user_id", userId);
      localStorage.setItem("token", token);

      // Redirigir al usuario a la página principal
      window.location.href = "/";
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">Log In</Card.Title>
              <Form onSubmit={handleSubmit} method="POST">
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username:</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Log In
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
