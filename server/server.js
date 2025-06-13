const express = require("express");
const app = express();
const mysql = require('mysql2'); 
const cors = require("cors")
const bcrypt = require('bcrypt'); 

const db = mysql.createPool({ 
    host:"localhost",
    user:"root",
    port:3306,
    password:"BdMarcos@123",
    database:"EducaSIS",
})

app.use(cors()); 
app.use(express.json());

// ===== REGISTRAR ALUNO =====
app.post("/registro/aluno", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Dados incompletos" });
    }
    const senha_hash = await bcrypt.hash(senha, 10);
    let SQL = "INSERT INTO alunos (nome, email, senha_hash) VALUES (?,?,?)";

    db.query(SQL, [nome, email, senha_hash], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao registrar aluno" });
        } else {
            res.json({ message: "Aluno cadastrado com sucesso" });
        }
    })
});

// ===== REGISTRAR PROFESSOR =====
app.post("/registro/professor", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Dados incompletos" });
    }
    const senha_hash = await bcrypt.hash(senha, 10);
    let SQL = "INSERT INTO professores (nome, email, senha_hash) VALUES (?,?,?)";

    db.query(SQL, [nome, email, senha_hash], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao registrar professor" });
        } else {
            res.json({ message: "Professor cadastrado com sucesso" });
        }
    })
});

// ===== LOGIN ALUNO =====
app.post("/login/aluno", (req, res) => {
    const { email, senha } = req.body;

    let SQL = "SELECT * FROM alunos WHERE email = ?";
    db.query(SQL, [email], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ sucesso: false, mensagem: "Erro ao fazer login" });
        }
        if (result.length === 0) {
            return res.status(400).json({ sucesso: false, mensagem: "Usuário não encontrado" });
        }
        
        const aluno = result[0];
        const match = await bcrypt.compare(senha, aluno.senha_hash);
        if (match) {
            res.json({ sucesso: true, mensagem: "Login realizado com sucesso" });
        } else {
            res.status(400).json({ sucesso: false, mensagem: "Senha incorreta" });
        }
    })
});

// ===== LOGIN PROFESSOR =====
app.post("/login/professor", (req, res) => {
    const { email, senha } = req.body;

    let SQL = "SELECT * FROM professores WHERE email = ?";
    db.query(SQL, [email], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ sucesso: false, mensagem: "Erro ao fazer login" });
        }
        if (result.length === 0) {
            return res.status(400).json({ sucesso: false, mensagem: "Usuário não encontrado" });
        }
        
        const professor = result[0];
        const match = await bcrypt.compare(senha, professor.senha_hash);
        if (match) {
            // Inclua o nome na resposta!
            res.json({ sucesso: true, mensagem: "Login realizado com sucesso", nome: professor.nome, token: "token-fake" });
        } else {
            res.status(400).json({ sucesso: false, mensagem: "Senha incorreta" });
        }
    })
});

// ===== GET ALUNOS =====
app.get("/alunos", (req, res) => {
  const SQL = "SELECT id, nome, email FROM alunos";
  db.query(SQL, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao listar alunos" });
    }
    res.json(result);
  });
});

// ===== GET PROFESSORES =====
app.get("/professores", (req, res) => {
  const SQL = "SELECT id, nome, email FROM professores";
  db.query(SQL, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao listar professores" });
    }
    res.json(result);
  });
});

// ===== CRUD TAREFAS =====
app.use(express.json());

app.get("/tarefas", (req, res) => {
    const SQL = "SELECT * FROM tarefas";
    db.query(SQL, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao buscar tarefas" });
        }
        res.json(result);
    });
});

app.post("/tarefas", (req, res) => {
    const { titulo, descricao, dataInicio, dataFim } = req.body;
    const SQL = "INSERT INTO tarefas (titulo, descricao, dataInicio, dataFim, concluida) VALUES (?, ?, ?, ?, false)";
    db.query(SQL, [titulo, descricao, dataInicio, dataFim], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao criar tarefa" });
        }
        res.json({ message: "Tarefa criada com sucesso" });
    });
});

app.put("/tarefas/:id", (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, dataInicio, dataFim } = req.body;
    const SQL = "UPDATE tarefas SET titulo=?, descricao=?, dataInicio=?, dataFim=? WHERE id=?";
    db.query(SQL, [titulo, descricao, dataInicio, dataFim, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao atualizar tarefa" });
        }
        res.json({ message: "Tarefa atualizada com sucesso" });
    });
});

app.delete("/tarefas/:id", (req, res) => {
    const { id } = req.params;
    const SQL = "DELETE FROM tarefas WHERE id=?";
    db.query(SQL, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao excluir tarefa" });
        }
        res.json({ message: "Tarefa excluída com sucesso" });
    });
});

app.patch("/tarefas/:id", (req, res) => {
    const { id } = req.params;
    const { concluida } = req.body;
    const SQL = "UPDATE tarefas SET concluida=? WHERE id=?";
    db.query(SQL, [concluida, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao marcar tarefa" });
        }
        res.json({ message: "Tarefa atualizada com sucesso" });
    });
});

app.listen(3001, () => {
    console.log("Servidor iniciado na porta 3001.");
});
