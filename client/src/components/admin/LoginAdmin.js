import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/login/admin', { email, senha });
      localStorage.setItem('tokenAdmin', res.data.token);
      localStorage.setItem('nomeAdmin', res.data.nome);
      localStorage.setItem('idAdmin', res.data.id);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Email ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh", background: "#f5f5f5" }}
    >
      <Card style={{ width: "400px" }} className="p-4 shadow-lg">
        <h1 className="mb-4 text-center text-primary">EducaSIS</h1>
        <h5 className="mb-4 text-center text-secondary">
          Login de <b>Admin</b>
        </h5>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Informe seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="senha" className="mb-3">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Informe sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            style={{ width: "100%", maxWidth: "100%" }}
          >
            Fazer Login
          </Button>
          <Button
            variant="outline-secondary"
            style={{ width: "100%", marginTop: 10 }}
            onClick={() => navigate("/")}
          >
            Voltar para Home
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default LoginAdmin;
