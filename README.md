# EducaSIS

Sistema de gerenciamento para alunos e professores para fins educacionais.

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/marcosalbuquerque/educaSIS.git
cd educaSIS
```

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

### 3. Rode o backend

```bash
cd server
node server.js
```

### 4. Rode o frontend

```bash
cd ../client
npm start
```

## Dependências principais

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
- mysql2
- bcrypt

---

**Obs:** As dependências exatas estão listadas nos arquivos `package.json` de cada pasta.
