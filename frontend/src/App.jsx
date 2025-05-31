import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Registro from './components/Registro'; // ✅ importar Registro
import DashboardCliente from './components/DashboardCliente';
import DashboardAdministrador from './components/DashboardAdministrador';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} /> {/* ✅ nueva ruta */}
        <Route path="/cliente" element={<DashboardCliente />} />
        <Route path="/admin" element={<DashboardAdministrador />} />
      </Routes>
    </Router>
  );
}

export default App;
