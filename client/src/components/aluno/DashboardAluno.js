import React, { useState, useEffect } from "react";
import { Button, Card, Row, Col, Nav } from "react-bootstrap";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaTasks, FaHourglassHalf, FaCheckCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function DashboardAluno() {
  const [tasks, setTasks] = useState([]);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'pendentes', 'feitas'
  const navigate = useNavigate();

  const nome = localStorage.getItem('nomeAluno') || 'Aluno';

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

  const handleToggleConcluida = async (id, concluida) => {
    try {
      await axios.patch(`http://localhost:3001/tarefas/${id}`, { concluida: !concluida });
      fetchTarefas();
    } catch (error) {
      console.error("Erro ao atualizar tarefa", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tokenAluno');
    localStorage.removeItem('nomeAluno');
    navigate('/login/aluno');
  };

  const tarefasPendentes = tasks.filter(t => !t.concluida);
  const tarefasConcluidas = tasks.filter(t => t.concluida);

  const dadosGrafico = [
    { name: 'Pendentes', qtd: tarefasPendentes.length },
    { name: 'Concluídas', qtd: tarefasConcluidas.length },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar branca */}
      <div style={{ width: "250px", background: "#ffffff", padding: "20px", borderRight: "1px solid #ddd", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
        <div style={{ marginBottom: '30px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.8rem', color: '#0d6efd' }}>
          EducaSIS
        </div>
          <Nav className="flex-column">
            <Nav.Link
              onClick={() => setActiveView('dashboard')}
              active={activeView === 'dashboard'}
              style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}
            >
              <FaTasks style={{ marginRight: 10 }} />
              Dashboard de Tarefas
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveView('pendentes')}
              active={activeView === 'pendentes'}
              style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}
            >
              <FaHourglassHalf style={{ marginRight: 10 }} />
              Tarefas Pendentes
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveView('feitas')}
              active={activeView === 'feitas'}
              style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}
            >
              <FaCheckCircle style={{ marginRight: 10 }} />
              Tarefas Feitas
            </Nav.Link>
          </Nav>
        </div>

        <div>
          <Button variant="outline-danger" onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaSignOutAlt style={{ marginRight: 8 }} /> Sair
          </Button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2 className="mb-4">Seja bem-vindo, <strong>{nome}</strong>!</h2>

        {activeView === 'dashboard' && (
          <>
            <h4 className="mb-4 text-secondary">Resumo do seu progresso</h4>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="qtd" fill="#0d6efd" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeView === 'pendentes' && (
          <>
            <h4 className="mb-4 text-primary">Tarefas Pendentes</h4>
            {tarefasPendentes.length === 0 && <p>Você não tem tarefas pendentes. Parabéns!</p>}
            {tarefasPendentes.map(task => (
              <Card key={task.id} className="mb-3 shadow-sm">
                <Card.Body>
                  <Card.Title>{task.titulo}</Card.Title>
                  <Card.Text>{task.descricao}</Card.Text>
                  <Card.Text><small>De {task.dataInicio} até {task.dataFim}</small></Card.Text>
                  <Button variant="success" onClick={() => handleToggleConcluida(task.id, task.concluida)}>Marcar como Concluída</Button>
                </Card.Body>
              </Card>
            ))}
          </>
        )}

        {activeView === 'feitas' && (
          <>
            <h4 className="mb-4 text-success">Tarefas Feitas</h4>
            {tarefasConcluidas.length === 0 && <p>Você ainda não concluiu nenhuma tarefa.</p>}
            {tarefasConcluidas.map(task => (
              <Card key={task.id} className="mb-3 shadow-sm bg-light">
                <Card.Body>
                  <Card.Title>{task.titulo} ✅</Card.Title>
                  <Card.Text>{task.descricao}</Card.Text>
                  <Card.Text><small>De {task.dataInicio} até {task.dataFim}</small></Card.Text>
                  <Button variant="outline-danger" onClick={() => handleToggleConcluida(task.id, task.concluida)}>Desmarcar como Concluída</Button>
                </Card.Body>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardAluno;
