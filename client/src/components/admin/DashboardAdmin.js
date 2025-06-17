import React, { useState, useEffect } from "react";
import { Button, Form, Card, Nav, Alert, Table, Spinner, Modal } from "react-bootstrap";
import { FaUserGraduate, FaChalkboardTeacher, FaPlus, FaTrash, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DashboardAdmin() {
  const [activeView, setActiveView] = useState('alunos');
  const [alunos, setAlunos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('aluno');
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlunos();
    fetchProfessores();
  }, []);

  const fetchAlunos = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/alunos");
      setAlunos(res.data);
    } catch {
      setError('Erro ao carregar alunos.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessores = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/professores");
      setProfessores(res.data);
    } catch {
      setError('Erro ao carregar professores.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Tem certeza que deseja remover este usuário?')) return;
    try {
      await axios.delete(`http://localhost:3001/${type}/${id}`);
      if (type === 'alunos') fetchAlunos();
      else fetchProfessores();
    } catch {
      setError('Erro ao remover usuário.');
    }
  };

  const handleShowModal = (type) => {
    setModalType(type);
    setForm({ nome: '', email: '', senha: '' });
    setShowModal(true);
    setSuccess('');
    setError('');
  };

  const handleCloseModal = () => setShowModal(false);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const url = modalType === 'aluno' ? '/registro/aluno' : '/registro/professor';
      await axios.post(`http://localhost:3001${url}`, form);
      setSuccess('Usuário criado com sucesso!');
      if (modalType === 'aluno') fetchAlunos();
      else fetchProfessores();
      setShowModal(false);
    } catch {
      setError('Erro ao criar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tokenAdmin');
    localStorage.removeItem('nomeAdmin');
    navigate('/login/admin');
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{
        width: "250px",
        background: "#fff",
        padding: "20px",
        borderRight: "1px solid #ddd",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between' // para alinhar o botão de sair embaixo
      }}>
        <div>
          <div style={{ marginBottom: '30px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.8rem', color: '#0d6efd' }}>
            EducaSIS
          </div>
          <Nav className="flex-column">
            <Nav.Link
              onClick={() => setActiveView('alunos')}
              active={activeView === 'alunos'}
              style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}
            >
              <FaUserGraduate style={{ marginRight: 10 }} /> Gerenciar Alunos
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveView('professores')}
              active={activeView === 'professores'}
              style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}
            >
              <FaChalkboardTeacher style={{ marginRight: 10 }} /> Gerenciar Professores
            </Nav.Link>
          </Nav>
        </div>
        <div>
          <Button
            variant="outline-danger"
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FaSignOutAlt style={{ marginRight: 8 }} /> Sair
          </Button>
        </div>
      </div>
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Dashboard Admin</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        {activeView === 'alunos' && (
          <Card className="p-4 shadow mb-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5>Alunos</h5>
              <Button variant="primary" onClick={() => handleShowModal('aluno')}><FaPlus /> Novo Aluno</Button>
            </div>
            {loading ? <Spinner animation="border" /> : (
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.length === 0 ? (
                    <tr><td colSpan="4">Nenhum aluno cadastrado.</td></tr>
                  ) : (
                    alunos.map(aluno => (
                      <tr key={aluno.id}>
                        <td>{aluno.id}</td>
                        <td>{aluno.nome}</td>
                        <td>{aluno.email}</td>
                        <td>
                          <Button variant="danger" size="sm" onClick={() => handleDelete('alunos', aluno.id)}><FaTrash /></Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            )}
          </Card>
        )}
        {activeView === 'professores' && (
          <Card className="p-4 shadow mb-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5>Professores</h5>
              <Button variant="primary" onClick={() => handleShowModal('professor')}><FaPlus /> Novo Professor</Button>
            </div>
            {loading ? <Spinner animation="border" /> : (
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {professores.length === 0 ? (
                    <tr><td colSpan="4">Nenhum professor cadastrado.</td></tr>
                  ) : (
                    professores.map(professor => (
                      <tr key={professor.id}>
                        <td>{professor.id}</td>
                        <td>{professor.nome}</td>
                        <td>{professor.email}</td>
                        <td>
                          <Button variant="danger" size="sm" onClick={() => handleDelete('professores', professor.id)}><FaTrash /></Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            )}
          </Card>
        )}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Novo {modalType === 'aluno' ? 'Aluno' : 'Professor'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCreate}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control name="nome" value={form.nome} onChange={handleFormChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" type="email" value={form.email} onChange={handleFormChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control name="senha" type="password" value={form.senha} onChange={handleFormChange} required />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
              <Button variant="primary" type="submit" disabled={loading}>Salvar</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default DashboardAdmin;
