import React from 'react';
import { Navigate } from 'react-router-dom';

export function PrivateRouteAluno({ children }) {
  const token = localStorage.getItem('tokenAluno');
  return token ? children : <Navigate to="/login/aluno" />;
}

export function PrivateRouteProfessor({ children }) {
  const token = localStorage.getItem('tokenProfessor');
  return token ? children : <Navigate to="/login/professor" />;
}

export function PrivateRouteAdmin({ children }) {
  const token = localStorage.getItem('tokenAdmin');
  return token ? children : <Navigate to="/login/admin" />;
}
