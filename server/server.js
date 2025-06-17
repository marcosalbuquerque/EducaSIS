require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require('bcrypt');
const admin = require('firebase-admin');
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://educasis-d10db-default-rtdb.firebaseio.com/"
});
const db = admin.database();

app.use(cors());
app.use(express.json());

// ===== CRUD ALUNO =====
app.post("/registro/aluno", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: "Dados incompletos" });
  try {
    const senha_hash = await bcrypt.hash(senha, 10);
    const snapshot = await db.ref('alunos').orderByChild('email').equalTo(email).once('value');
    if (snapshot.exists()) return res.status(400).json({ error: "Email já cadastrado" });
    const ref = db.ref('alunos').push();
    await ref.set({ nome, email, senha_hash });
    res.status(201).json({ message: "Aluno cadastrado com sucesso", id: ref.key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar aluno" });
  }
});

app.get("/alunos", async (req, res) => {
  try {
    const snapshot = await db.ref('alunos').once('value');
    const alunosObj = snapshot.val() || {};
    const alunos = Object.entries(alunosObj).map(([id, data]) => ({ id, ...data }));
    alunos.forEach(aluno => delete aluno.senha_hash);
    res.json(alunos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar alunos" });
  }
});

app.delete("/alunos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const alunoRef = db.ref('alunos').child(id);
    const snapshot = await alunoRef.once('value');
    if (!snapshot.exists()) return res.status(404).json({ error: "Aluno não encontrado" });
    await alunoRef.remove();
    res.json({ message: "Aluno removido com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover aluno" });
  }
});

// ===== CRUD PROFESSOR =====
app.post("/registro/professor", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: "Dados incompletos" });
  try {
    const senha_hash = await bcrypt.hash(senha, 10);
    const snapshot = await db.ref('professores').orderByChild('email').equalTo(email).once('value');
    if (snapshot.exists()) return res.status(400).json({ error: "Email já cadastrado" });
    const ref = db.ref('professores').push();
    await ref.set({ nome, email, senha_hash });
    res.status(201).json({ message: "Professor cadastrado com sucesso", id: ref.key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar professor" });
  }
});

app.get("/professores", async (req, res) => {
  try {
    const snapshot = await db.ref('professores').once('value');
    const professoresObj = snapshot.val() || {};
    const professores = Object.entries(professoresObj).map(([id, data]) => ({ id, ...data }));
    professores.forEach(professor => delete professor.senha_hash);
    res.json(professores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar professores" });
  }
});

app.delete("/professores/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const profRef = db.ref('professores').child(id);
    const snapshot = await profRef.once('value');
    if (!snapshot.exists()) return res.status(404).json({ error: "Professor não encontrado" });
    await profRef.remove();
    res.json({ message: "Professor removido com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover professor" });
  }
});

// ===== CRUD ADMIN =====
app.post("/registro/admin", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: "Dados incompletos" });
  try {
    const senha_hash = await bcrypt.hash(senha, 10);
    const snapshot = await db.ref('admins').orderByChild('email').equalTo(email).once('value');
    if (snapshot.exists()) return res.status(400).json({ error: "Email já cadastrado" });
    const ref = db.ref('admins').push();
    await ref.set({ nome, email, senha_hash });
    res.status(201).json({ message: "Admin cadastrado com sucesso", id: ref.key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar admin" });
  }
});

app.get("/admins", async (req, res) => {
  try {
    const snapshot = await db.ref('admins').once('value');
    const adminsObj = snapshot.val() || {};
    const admins = Object.entries(adminsObj).map(([id, data]) => ({ id, ...data }));
    admins.forEach(admin => delete admin.senha_hash);
    res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar admins" });
  }
});

app.delete("/admins/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const adminRef = db.ref('admins').child(id);
    const snapshot = await adminRef.once('value');
    if (!snapshot.exists()) return res.status(404).json({ error: "Admin não encontrado" });
    await adminRef.remove();
    res.json({ message: "Admin removido com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover admin" });
  }
});

// ===== LOGIN =====
app.post("/login/aluno", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ sucesso: false, mensagem: "Email e senha são obrigatórios" });
  try {
    const snapshot = await db.ref('alunos').orderByChild('email').equalTo(email).once('value');
    if (!snapshot.exists()) return res.status(400).json({ sucesso: false, mensagem: "Usuário não encontrado" });
    const alunoData = snapshot.val();
    const userId = Object.keys(alunoData)[0];
    const aluno = alunoData[userId];
    const match = await bcrypt.compare(senha, aluno.senha_hash);
    if (match) {
      res.json({ sucesso: true, mensagem: "Login realizado com sucesso", id: userId, nome: aluno.nome, token: "token-fake" });
    } else {
      res.status(400).json({ sucesso: false, mensagem: "Senha incorreta" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: "Erro ao fazer login" });
  }
});

app.post("/login/professor", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ sucesso: false, mensagem: "Email e senha são obrigatórios" });
  try {
    const snapshot = await db.ref('professores').orderByChild('email').equalTo(email).once('value');
    if (!snapshot.exists()) return res.status(400).json({ sucesso: false, mensagem: "Usuário não encontrado" });
    const profData = snapshot.val();
    const userId = Object.keys(profData)[0];
    const professor = profData[userId];
    const match = await bcrypt.compare(senha, professor.senha_hash);
    if (match) {
      res.json({ sucesso: true, mensagem: "Login realizado com sucesso", id: userId, nome: professor.nome, token: "token-fake" });
    } else {
      res.status(400).json({ sucesso: false, mensagem: "Senha incorreta" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: "Erro ao fazer login" });
  }
});

app.post("/login/admin", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ sucesso: false, mensagem: "Email e senha são obrigatórios" });
  try {
    const snapshot = await db.ref('admins').orderByChild('email').equalTo(email).once('value');
    if (!snapshot.exists()) return res.status(400).json({ sucesso: false, mensagem: "Usuário não encontrado" });
    const adminData = snapshot.val();
    const userId = Object.keys(adminData)[0];
    const adminUser = adminData[userId];
    const match = await bcrypt.compare(senha, adminUser.senha_hash);
    if (match) {
      res.json({ sucesso: true, mensagem: "Login realizado com sucesso", id: userId, nome: adminUser.nome, token: "token-fake" });
    } else {
      res.status(400).json({ sucesso: false, mensagem: "Senha incorreta" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: "Erro ao fazer login" });
  }
});

// ===== CRUD TAREFAS =====
app.get("/api/tarefas", async (req, res) => {
  try {
    const snapshot = await db.ref('tarefas').once('value');
    const tarefasObj = snapshot.val() || {};
    const tarefas = Object.entries(tarefasObj).map(([id, data]) => ({ id, ...data }));
    res.json(tarefas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

// Status de entrega de tarefa por aluno
app.get("/api/tarefas/:id/status", async (req, res) => {
  const { id } = req.params;
  try {
    const alunosSnap = await db.ref('alunos').once('value');
    const alunosObj = alunosSnap.val() || {};
    const alunos = Object.entries(alunosObj).map(([id, data]) => ({ id, nome: data.nome }));
    const entregasSnap = await db.ref('entregas').orderByChild('id_tarefa').equalTo(id).once('value');
    const entregasObj = entregasSnap.val() || {};
    const entregas = Object.values(entregasObj).map(e => e.id_aluno);
    const status = alunos.map(aluno => ({
      id: aluno.id,
      nome: aluno.nome,
      status: entregas.includes(aluno.id) ? 'Concluído' : 'Pendente'
    }));
    res.json(status);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar status dos alunos." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
