import React, { useState, useEffect } from "react";
import { Button, Form, Card, Row, Col, Nav, Alert } from "react-bootstrap";
import { FaChalkboardTeacher, FaListUl, FaUserGraduate, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ListaAlunos from "./ListaAlunos";
import axios from "axios";

function formatarData(iso) {
  const [ano, mes, dia] = iso.split("T")[0].split("-");
  return `${dia}/${mes}/${ano}`;
}

function DashboardProfessor() {
  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split("T")[0]);
  const [dataFim, setDataFim] = useState('');
  const [editId, setEditId] = useState(null);
  const [activeView, setActiveView] = useState('postar');
  const [showSuccess, setShowSuccess] = useState(false); // Estado para mensagem de sucesso

  const navigate = useNavigate();

  const nome = localStorage.getItem('nomeProfessor') || 'Professor';

  useEffect(() => {
    fetchTarefas();
  }, []);

  const fetchTarefas = async () => {
    try {
      const res = await axios.get('http://localhost:3001/tarefas');
      setTasks(res.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`http://localhost:3001/tarefas/${editId}`, { titulo, descricao, dataInicio, dataFim });
      } else {
        await axios.post('http://localhost:3001/tarefas', { titulo, descricao, dataInicio, dataFim });
      }
      setEditId(null);
      setTitulo('');
      setDescricao('');
      setDataInicio(new Date().toISOString().split("T")[0]);
      setDataFim('');
      fetchTarefas();

      // Mostrar mensagem de sucesso
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar tarefa", error);
    }
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setTitulo(task.titulo);
    setDescricao(task.descricao);
    setDataInicio(task.dataInicio?.split("T")[0] || '');
    setDataFim(task.dataFim?.split("T")[0] || '');
    setActiveView('postar');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tarefas/${id}`);
      fetchTarefas();
    } catch (error) {
      console.error("Erro ao excluir tarefa", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tokenProfessor');
    localStorage.removeItem('nomeProfessor');
    navigate('/login/professor');
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{
        width: "250px",
        background: "#ffffff",
        padding: "20px",
        borderRight: "1px solid #ddd",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ marginBottom: '30px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.8rem', color: '#0d6efd' }}>
            EducaSIS
          </div>
          <Nav className="flex-column">
            <Nav.Link
              onClick={() => setActiveView('postar')}
              active={activeView === 'postar'}
              style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}
            >
              <FaChalkboardTeacher style={{ marginRight: 10 }} />
              Postar Tarefa
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveView('tarefas')}
              active={activeView === 'tarefas'}
              style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}
            >
              <FaListUl style={{ marginRight: 10 }} />
              Ver Tarefas
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveView('alunos')}
              active={activeView === 'alunos'}
              style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}
            >
              <FaUserGraduate style={{ marginRight: 10 }} />
              Ver Alunos
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
        <h2>Seja Bem-vindo, <strong>{nome}</strong>!</h2>

        {activeView === 'postar' && (
          <Card className="p-4 shadow mb-4">
            <h5>{editId ? "Editar Tarefa" : "Criar Nova Tarefa"}</h5>

            {showSuccess && (
              <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                Tarefa {editId ? "atualizada" : "criada"} com sucesso!
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="titulo" className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="descricao" className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group controlId="dataInicio" className="mb-3">
                    <Form.Label>Data Início</Form.Label>
                    <Form.Control
                      type="date"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="dataFim" className="mb-3">
                    <Form.Label>Data Fim</Form.Label>
                    <Form.Control
                      type="date"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" type="submit">
                {editId ? "Atualizar Tarefa" : "Criar Tarefa"}
              </Button>
            </Form>
          </Card>
        )}

        {activeView === 'tarefas' && (
          <div className="mt-4">
            {tasks?.map((task) => (
              <Card key={task.id} className="mb-3 p-3 shadow">
                <h5>
                  {task.titulo}
                  {task.concluida ? <span style={{ color: 'green', marginLeft: 10 }}>✅ Concluída</span> : <span style={{ color: 'orange', marginLeft: 10 }}>⏳ Pendente</span>}
                </h5>
                <p>{task.descricao}</p>
                <p>De {formatarData(task.dataInicio)} até {formatarData(task.dataFim)}</p>
                <Button variant="outline-warning" onClick={() => handleEdit(task)}>
                  Editar
                </Button>{' '}
                <Button variant="outline-danger" onClick={() => handleDelete(task.id)}>
                  Excluir
                </Button>
              </Card>
            ))}
          </div>
        )}

        {activeView === 'alunos' && <ListaAlunos />}
      </div>
    </div>
  );
}

export default DashboardProfessor;
