import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const [secondaryButtonHover, setSecondaryButtonHover] = useState(false);
  const navigate = useNavigate();

  // Efecto para animación del título
  useEffect(() => {
    const titleElement = document.getElementById('registro-title');
    if (titleElement) {
      titleElement.classList.add('title-animation');
    }
  }, []);

  const handleRegistro = async () => {
    setError('');
    
    if (!nombre || !correo || !telefono || !contrasena || !confirmarContrasena) {
      setError('Por favor complete todos los campos');
      return;
    }
    
    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    
    try {
      await axios.post('http://localhost:5000/api/usuarios/registro', {
        nombre,
        correo,
        telefono,
        contrasena,
      });

      alert('Registro exitoso. Por favor inicie sesión.');
      navigate('/');
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const volverAlLogin = () => {
    navigate('/');
  };

  // Estilos
  const styles = {
    container: {
      maxWidth: '500px',
      margin: '40px auto',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
      backgroundColor: '#ffffff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)'
    },
    title: {
      textAlign: 'center',
      background: 'linear-gradient(45deg, #2E86C1, #3498db, #21618C)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      marginBottom: '30px',
      fontSize: '32px',
      fontWeight: '700',
      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
      padding: '10px 0',
      position: 'relative',
      overflow: 'hidden'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#34495e',
      fontSize: '14px',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      borderRadius: '8px',
      border: '1px solid #dfe6e9',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      ':focus': {
        outline: 'none',
        borderColor: '#3498db',
        boxShadow: '0 0 0 2px rgba(52, 152, 219, 0.2)'
      }
    },
    button: {
      width: '100%',
      padding: '14px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '10px',
      position: 'relative',
      overflow: 'hidden'
    },
    primaryButton: {
      background: buttonHover 
        ? 'linear-gradient(45deg, #2E86C1, #3498db)'
        : 'linear-gradient(45deg, #3498db, #2E86C1)',
      color: 'white',
      boxShadow: '0 4px 10px rgba(52, 152, 219, 0.3)',
      transform: buttonHover ? 'translateY(-2px)' : 'none'
    },
    secondaryButton: {
      background: secondaryButtonHover
        ? 'linear-gradient(45deg, #dfe4ea, #f1f2f6)'
        : 'linear-gradient(45deg, #f1f2f6, #dfe4ea)',
      color: '#2f3542',
      boxShadow: '0 4px 10px rgba(47, 53, 66, 0.1)',
      transform: secondaryButtonHover ? 'translateY(-2px)' : 'none'
    },
    error: {
      color: '#e74c3c',
      fontSize: '14px',
      marginBottom: '15px',
      textAlign: 'center',
      padding: '10px',
      backgroundColor: 'rgba(231, 76, 60, 0.1)',
      borderRadius: '5px',
      display: error ? 'block' : 'none'
    },
    link: {
      textAlign: 'center',
      marginTop: '20px',
      color: '#7f8c8d'
    },
    linkText: {
      color: '#3498db',
      cursor: 'pointer',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      ':hover': {
        color: '#2E86C1',
        textDecoration: 'underline'
      }
    },
    '@keyframes titleAnimation': {
      '0%': { transform: 'translateY(-20px)', opacity: 0 },
      '100%': { transform: 'translateY(0)', opacity: 1 }
    }
  };

  // Estilos CSS para la animación del título
  const titleAnimationStyle = `
    .title-animation {
      animation: titleFadeIn 0.8s ease forwards;
    }
    @keyframes titleFadeIn {
      0% { transform: translateY(-20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
  `;

  return (
    <div style={styles.container}>
      <style>{titleAnimationStyle}</style>
      <h2 id="registro-title" style={styles.title}>Crear una cuenta</h2>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Nombre completo</label>
        <input 
          type="text" 
          value={nombre} 
          onChange={e => setNombre(e.target.value)} 
          placeholder="Ingrese su nombre completo" 
          style={styles.input}
        />
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Correo electrónico</label>
        <input 
          type="email" 
          value={correo} 
          onChange={e => setCorreo(e.target.value)} 
          placeholder="ejemplo@correo.com" 
          style={styles.input}
        />
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Teléfono</label>
        <input 
          type="tel" 
          value={telefono} 
          onChange={e => setTelefono(e.target.value)} 
          placeholder="Número de teléfono" 
          style={styles.input}
        />
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Contraseña</label>
        <input 
          type="password" 
          value={contrasena} 
          onChange={e => setContrasena(e.target.value)} 
          placeholder="Mínimo 6 caracteres" 
          style={styles.input}
        />
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Confirmar contraseña</label>
        <input 
          type="password" 
          value={confirmarContrasena} 
          onChange={e => setConfirmarContrasena(e.target.value)} 
          placeholder="Confirme su contraseña" 
          style={styles.input}
        />
      </div>
      
      <button 
        onClick={handleRegistro} 
        style={{...styles.button, ...styles.primaryButton}}
        disabled={isLoading}
        onMouseEnter={() => setButtonHover(true)}
        onMouseLeave={() => setButtonHover(false)}
      >
        {isLoading ? 'Registrando...' : 'Registrarse'}
      </button>
      
      <button 
        onClick={volverAlLogin} 
        style={{...styles.button, ...styles.secondaryButton}}
        onMouseEnter={() => setSecondaryButtonHover(true)}
        onMouseLeave={() => setSecondaryButtonHover(false)}
      >
        Volver al inicio de sesión
      </button>
      
      <div style={styles.link}>
        ¿Ya tienes una cuenta?{' '}
        <span style={styles.linkText} onClick={volverAlLogin}>
          Inicia sesión aquí
        </span>
      </div>
    </div>
  );
}

export default Registro;