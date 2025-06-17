import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginProfessor() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(''); // estado para mensagem de erro
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // limpa erro ao tentar logar


  try {
        const res = await axios.post('http://localhost:3001/login/professor', { email, senha });
        console.log('Login realizado!', res.data);
        // supondo que o servidor retorne um token:
        localStorage.setItem('tokenProfessor', res.data.token);
        localStorage.setItem('nomeProfessor', res.data.nome);
        navigate('/professor/dashboard');
    } catch (err) {
        console.error('Erro no login!', err);
    }
    };

  const handleBackHome = () => {
    navigate('/');
  };
  
  return (
    <Container 
      fluid 
      className="d-flex align-items-center justify-content-center" 
      style={{ height: "100vh", background: "#f5f5f5" }}
    >
      <Card style={{ width: "400px" }} className="p-4 shadow-lg">
        <h1 className="mb-4 text-center text-primary">EducaSIS</h1>
        <h5 className="mb-4 text-center text-secondary">Bem-vindo de volta! Faça login para acessar sua conta de <b>professor.</b></h5>

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
        </Form>

        <div className="mt-3 text-center">
          <span>Ainda não tem conta? </span>
          <Link to="/registro/professor">Cadastre-se</Link>
        </div>

        <Button 
          variant="outline-secondary" 
          onClick={handleBackHome} 
          className="mt-3"
          style={{ width: "100%", maxWidth: "100%" }}
        >
          Voltar para Home
        </Button>
      </Card>
    </Container>
  )
}

export default LoginProfessor;
