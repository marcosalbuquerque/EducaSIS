import React, { useState, useEffect } from "react";
import { Button, Form, Card, Row, Col, Nav, Alert, Modal } from "react-bootstrap"; // Adicionei Modal
import { FaChalkboardTeacher, FaListUl, FaUserGraduate, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ListaAlunos from "./ListaAlunos";
import axios from "axios";

// Este será o novo componente para ver o status, vamos criá-lo em seguida
import StatusTarefa from './StatusTarefa'; 

function formatarData(iso) {
  if (!iso) return '';
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
  const [showSuccess, setShowSuccess] = useState(false);
  
  // NOVO ESTADO: para controlar a tarefa que queremos ver o status
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);

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

  // NOVA FUNÇÃO: para abrir o modal de status
  const handleVerStatus = (task) => {
    setTarefaSelecionada(task);
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
            {tasks?.length === 0 && (
              <div className="text-center text-muted" style={{ fontSize: '1.1rem', marginTop: 40 }}>
                Nenhuma tarefa cadastrada.
              </div>
            )}
            <div className="row">
              {tasks?.map((task) => (
                <div key={task.id} className="col-md-6 col-lg-4 mb-4">
                  <Card className="shadow-sm h-100" style={{ borderRadius: 16, border: '1px solid #e3e6f0' }}>
                    <Card.Body className="d-flex flex-column">
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <Card.Title style={{ fontWeight: 700, fontSize: '1.2rem', color: '#0d6efd', flex: 1 }}>
                          {task.titulo}
                        </Card.Title>
                        <span className="badge bg-light text-secondary" style={{ fontSize: 12, border: '1px solid #dee2e6' }}>
                          #{task.id}
                        </span>
                      </div>
                      <Card.Text style={{ color: '#444', minHeight: 60 }}>
                        {task.descricao}
                      </Card.Text>
                      <div className="mb-2" style={{ fontSize: 13, color: '#888' }}>
                        <span className="me-2">
                          <strong>Início:</strong> {formatarData(task.dataInicio)}
                        </span>
                        <span>
                          <strong>Fim:</strong> {formatarData(task.dataFim)}
                        </span>
                      </div>
                      <div className="mt-auto d-flex gap-2">
                        <Button variant="outline-info" size="sm" onClick={() => handleVerStatus(task)}>
                          Ver Status
                        </Button>
                        <Button variant="outline-warning" size="sm" onClick={() => handleEdit(task)}>
                          Editar
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(task.id)}>
                          Excluir
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'alunos' && <ListaAlunos />}

        {/* NOVO MODAL PARA EXIBIR O STATUS DA TAREFA */}
        {tarefaSelecionada && (
          <StatusTarefa 
            show={!!tarefaSelecionada} 
            handleClose={() => setTarefaSelecionada(null)}
            tarefa={tarefaSelecionada}
          />
        )}
      </div>
    </div>
  );
}

export default DashboardProfessor;