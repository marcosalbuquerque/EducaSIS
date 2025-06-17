import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginAluno from './components/aluno/LoginAluno';
import LoginProfessor from './components/shared/LoginProfessor';
import { PrivateRouteAluno, PrivateRouteProfessor, PrivateRouteAdmin } from "./components/shared/PrivateRoute";
import DashboardAluno from './components/aluno/DashboardAluno';
import DashboardProfessor from './components/professor/DashboardProfessor';
import DashboardAdmin from './components/admin/DashboardAdmin';
import Home from './components/shared/Home';
import LoginAdmin from './components/admin/LoginAdmin';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/aluno" element={<LoginAluno />} />
          <Route path="/login/professor" element={<LoginProfessor />} />
          <Route path="/login/admin" element={<LoginAdmin />} />
          <Route path="/aluno/dashboard" element={<PrivateRouteAluno><DashboardAluno/></PrivateRouteAluno>} />
          <Route path="/professor/dashboard" element={<PrivateRouteProfessor><DashboardProfessor/></PrivateRouteProfessor>} />
          <Route path="/admin/dashboard" element={<PrivateRouteAdmin><DashboardAdmin/></PrivateRouteAdmin>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
