import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Inicio from './sidebar/Inicio';
import Ventas from './sidebar/Ventas';
import Productos from './sidebar/Productos';
import Clientes from './sidebar/Clientes';
import Mensajes from './sidebar/Mensajes';
import Ingresos from './sidebar/Ingresos';
import Egresos from './sidebar/Egresos';

const apartados = {
  Inicio,
  Ventas,
  Productos,
  Clientes,
  Mensajes,
  Ingresos,
  Egresos,
};

export default function DashboardAdministrador() {
  const [activo, setActivo] = useState('Inicio');
  const ComponenteActivo = apartados[activo];
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    navigate('/');
  };

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      backgroundColor: '#f4f6f8',
    },
    sidebar: {
      width: '240px',
      backgroundColor: '#fff',
      borderRight: '1px solid #ddd',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.03)',
    },
    sidebarTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '32px',
    },
    menuList: {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
    },
    menuButton: (isActive) => ({
      width: '100%',
      padding: '12px 16px',
      marginBottom: '12px',
      textAlign: 'left',
      border: 'none',
      backgroundColor: isActive ? '#3498db' : 'transparent',
      color: isActive ? 'white' : '#34495e',
      fontWeight: isActive ? 'bold' : 'normal',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.2s ease',
    }),
    logoutButton: {
      width: '100%',
      padding: '12px 16px',
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.2s ease',
    },
    mainContent: {
      flexGrow: 1,
      padding: '32px',
      overflowY: 'auto',
    },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <nav style={styles.sidebar}>
        <div>
          <h2 style={styles.sidebarTitle}>Admin</h2>
          <ul style={styles.menuList}>
            {Object.keys(apartados).map(item => (
              <li key={item}>
                <button
                  style={styles.menuButton(activo === item)}
                  onClick={() => setActivo(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <button
            style={styles.logoutButton}
            onClick={handleCerrarSesion}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#c0392b')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#e74c3c')}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main style={styles.mainContent}>
        <ComponenteActivo />
      </main>
    </div>
  );
}
