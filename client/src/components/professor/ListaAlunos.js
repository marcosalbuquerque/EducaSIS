import React, { useState, useEffect } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

function ListaAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const res = await axios.get("http://localhost:3001/alunos");
        setAlunos(res.data);
      } catch (err) {
        setError("Erro ao carregar alunos.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Matrícula</th>
          <th>Nome</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {alunos.map((aluno) => (
          <tr key={aluno.id}>
            <td>{aluno.id}</td>
            <td>{aluno.nome}</td>
            <td>{aluno.email}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ListaAlunos;
