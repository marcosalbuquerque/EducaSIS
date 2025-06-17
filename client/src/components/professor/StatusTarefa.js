import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';

const StatusTarefa = ({ tarefa, show, handleClose }) => {
    const [status, setStatus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (tarefa && show) {
            setLoading(true);
            setError('');
            axios.get(`http://localhost:3001/api/tarefas/${tarefa.id}/status`)
                .then(res => setStatus(res.data))
                .catch(err => setError('Erro ao buscar status dos alunos.'))
                .finally(() => setLoading(false));
        }
    }, [tarefa, show]);

    if (!tarefa) return null;

    const concluidos = status.filter(s => s.status === 'Concluído');
    const pendentes = status.filter(s => s.status === 'Pendente');

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Status da Tarefa: {tarefa.titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <Spinner animation="border" />}
                {error && <Alert variant="danger">{error}</Alert>}
                {!loading && !error && (
                    <>
                        <h5>Alunos que Concluíram:</h5>
                        {concluidos.length === 0 ? null : (
                            <ul>
                                {concluidos.map(aluno => (
                                    <li key={aluno.id}>{aluno.nome}</li>
                                ))}
                            </ul>
                        )}
                        <h5>Alunos Pendentes:</h5>
                        {pendentes.length === 0 ? null : (
                            <ul>
                                {pendentes.map(aluno => (
                                    <li key={aluno.id}>{aluno.nome}</li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Fechar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StatusTarefa;