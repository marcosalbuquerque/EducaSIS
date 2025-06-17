import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function RegistroAluno() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nome || !email || !senha) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/registro/aluno', { nome, email, senha });
      if (res.data.message) {
        setSuccess(res.data.message);
        setTimeout(() => {
          navigate('/login/aluno');
        }, 1000); // redireciona após 2s para login
      }
    } catch (err) {
      console.error('Erro no registro!', err);
      setError(err.response?.data?.error || 'Erro ao registrar aluno.');
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
        <h5 className="mb-4 text-center text-secondary">Crie sua conta de <b>aluno</b> para começar.</h5>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleRegistro}>
          <Form.Group controlId="nome" className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Informe seu nome" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              required
            />
          </Form.Group>

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
            Registrar
          </Button>
        </Form>

        <div className="mt-3 text-center">
          <span>Já tem conta? </span>
          <Link to="/login/aluno">Faça login</Link>
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
  );
}

export default RegistroAluno;
