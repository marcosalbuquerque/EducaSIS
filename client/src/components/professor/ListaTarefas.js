import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatusTarefa from './StatusTarefa';

const ListaTarefas = () => {
    const [tarefas, setTarefas] = useState([]);
    const [tarefaSelecionada, setTarefaSelecionada] = useState(null);

    useEffect(() => {
        axios.get('/api/tarefas')
            .then(res => setTarefas(res.data))
            .catch(err => console.error(err));
    }, []);

    const verStatus = (tarefa) => {
        setTarefaSelecionada(tarefa);
    };

    return (
        <div>
            <h2>Lista de Tarefas</h2>
            <ul>
                {tarefas.map(tarefa => (
                    <li key={tarefa.id}>
                        {tarefa.titulo}
                        <button onClick={() => verStatus(tarefa)}>Ver Status</button>
                    </li>
                ))}
            </ul>
            {tarefaSelecionada && <StatusTarefa tarefa={tarefaSelecionada} />}
        </div>
    );
};

export default ListaTarefas;