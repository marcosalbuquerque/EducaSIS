import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginAluno from './components/aluno/LoginAluno';
import LoginProfessor from './components/shared/LoginProfessor';
import RegistroAluno from './components/aluno/RegistroAluno';
import RegistroProfessor from './components/professor/RegistroProfessor';
import { PrivateRouteAluno, PrivateRouteProfessor } from "./components/shared/PrivateRoute";
import DashboardAluno from './components/aluno/DashboardAluno';
import DashboardProfessor from './components/professor/DashboardProfessor';
import Home from './components/shared/Home';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/aluno" element={<LoginAluno />} />
          <Route path="/login/professor" element={<LoginProfessor />} />
          <Route path="/registro/aluno" element={<RegistroAluno />} />
          <Route path="/registro/professor" element={<RegistroProfessor />} />
          <Route path="/aluno/dashboard" element={<PrivateRouteAluno><DashboardAluno/></PrivateRouteAluno>} />
          <Route path="/professor/dashboard" element={<PrivateRouteProfessor><DashboardProfessor/></PrivateRouteProfessor>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
