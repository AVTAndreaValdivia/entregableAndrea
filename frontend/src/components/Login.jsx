import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    
    if (!correo || !contrasena) {
      setError('Por favor ingrese su correo y contraseña');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/usuarios/login', {
        correo,
        contrasena,
      });

      if (response.status === 200) {
        localStorage.setItem('nombreUsuario', response.data.usuario.nombre);
        navigate('/cliente');
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.msg || 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrearUsuario = () => navigate('/registro');
  const visitarSinCuenta = () => navigate('/cliente');
  const visitarAdministrador = () => navigate('/admin');

  // Estilos
  const styles = {
    container: {
      maxWidth: '450px',
      margin: '50px auto',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
      backgroundColor: '#ffffff',
      fontFamily: "'Inter', sans-serif"
    },
    title: {
      textAlign: 'center',
      color: '#2d3436',
      marginBottom: '30px',
      fontSize: '28px',
      fontWeight: '700'
    },
    formGroup: {
      marginBottom: '25px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#636e72',
      fontSize: '14px',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      borderRadius: '8px',
      border: '1px solid #dfe6e9',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      ':focus': {
        outline: 'none',
        borderColor: '#0984e3',
        boxShadow: '0 0 0 3px rgba(9, 132, 227, 0.1)'
      }
    },
    primaryButton: {
      width: '100%',
      padding: '14px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#0984e3',
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      marginBottom: '15px',
      ':hover': {
        backgroundColor: '#0767b3'
      },
      ':disabled': {
        backgroundColor: '#b2bec3',
        cursor: 'not-allowed'
      }
    },
    secondaryButton: {
      width: '100%',
      padding: '14px',
      borderRadius: '8px',
      border: '1px solid #dfe6e9',
      backgroundColor: 'transparent',
      color: '#2d3436',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '15px',
      ':hover': {
        backgroundColor: '#f5f6fa',
        borderColor: '#b2bec3'
      }
    },
    error: {
      color: '#d63031',
      fontSize: '14px',
      marginBottom: '20px',
      textAlign: 'center',
      padding: '10px',
      backgroundColor: '#ffecec',
      borderRadius: '6px'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '20px 0',
      color: '#b2bec3',
      '::before, ::after': {
        content: '""',
        flex: 1,
        borderBottom: '1px solid #dfe6e9'
      },
      span: {
        padding: '0 10px'
      }
    },
    footerLinks: {
      textAlign: 'center',
      marginTop: '25px',
      color: '#636e72',
      fontSize: '14px'
    },
    footerLink: {
      color: '#0984e3',
      cursor: 'pointer',
      textDecoration: 'none',
      margin: '0 5px',
      ':hover': {
        textDecoration: 'underline'
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Iniciar Sesión</h2>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Correo electrónico</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          style={styles.input}
        />
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Contraseña</label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="Ingresa tu contraseña"
          style={styles.input}
        />
      </div>
      
      <button 
        onClick={handleLogin} 
        style={styles.primaryButton}
        disabled={isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
      
      <div style={styles.divider}>
        <span>o</span>
      </div>
      
      <button 
        onClick={handleCrearUsuario} 
        style={styles.secondaryButton}
      >
        Crear una cuenta nueva
      </button>
      
      <button 
        onClick={visitarSinCuenta} 
        style={{...styles.secondaryButton, marginBottom: '10px'}}
      >
        Continuar como invitado
      </button>
      
      <div style={styles.footerLinks}>
        <span>¿Eres administrador?</span>
        <span 
          style={styles.footerLink} 
          onClick={visitarAdministrador}
        >
          Acceder al panel
        </span>
      </div>
    </div>
  );
}

export default Login;