# EducaSIS

Sistema de gerenciamento para alunos, professores e administradores.

## Como baixar e rodar o projeto

### 1. Baixe o projeto

- Clique no botão verde "Code" no topo da página do repositório no GitHub.
- Selecione "Download ZIP" e extraia o conteúdo em seu computador.

### 2. Instale as dependências

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd ../server
npm install
```

### 3. Configure as variáveis de ambiente e chaves

- Coloque o arquivo `firebaseServiceAccountKey.json` na pasta `server` (peça ao admin do projeto se não tiver).
- Se necessário, crie um arquivo `.env` na pasta `server` para definir variáveis como a porta (exemplo: `PORT=3001`).

### 4. Rode o backend

```bash
cd server
node server.js
```

O backend roda por padrão em `http://localhost:3001`.

### 5. Rode o frontend

Abra outro terminal e execute:

```bash
cd client
npm start
```

O frontend roda por padrão em `http://localhost:3000`.

## Fluxo de uso

- Apenas o administrador pode criar e remover contas de alunos e professores.
- Alunos e professores só podem fazer login (não existe opção de cadastro público).
- O admin acessa `/login/admin` para gerenciar usuários.

## Principais dependências

### Frontend (`client/package.json`)

- react
- react-dom
- react-router-dom
- react-bootstrap
- bootstrap
- axios
- react-icons
- recharts

### Backend (`server/package.json`)

- express
- cors
- bcrypt
- firebase-admin

---

**Obs:** As dependências exatas estão listadas nos arquivos `package.json` de cada pasta.

## Segurança

- Não suba arquivos `.env` ou `firebaseServiceAccountKey.json` para o GitHub.
- O `.gitignore` já está configurado para proteger esses arquivos.

## Dúvidas?

Abra uma issue ou entre em contato com o admin do projeto.
