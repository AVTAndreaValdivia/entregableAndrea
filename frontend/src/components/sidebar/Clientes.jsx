import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Clientes() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formEditar, setFormEditar] = useState({
    nombre: '',
    correo: '',
    telefono: '',
  });

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${id}`);
      obtenerUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const editarUsuario = (usuario) => {
    setEditandoId(usuario._id);
    setFormEditar({
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono,
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormEditar({ nombre: '', correo: '', telefono: '' });
  };

  const guardarEdicion = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/usuarios/${id}`, formEditar);
      setEditandoId(null);
      obtenerUsuarios();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const handleChange = (e) => {
    setFormEditar({ ...formEditar, [e.target.name]: e.target.value });
  };

  const styles = {
    container: {
      padding: '30px',
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#f9f9f9',
    },
    heading: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#2c3e50',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    th: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '12px',
      textAlign: 'left',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
    },
    input: {
      padding: '6px',
      width: '95%',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    button: {
      marginRight: '8px',
      padding: '6px 12px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    editar: {
      backgroundColor: '#f39c12',
      color: 'white',
    },
    eliminar: {
      backgroundColor: '#e74c3c',
      color: 'white',
    },
    guardar: {
      backgroundColor: '#2ecc71',
      color: 'white',
    },
    cancelar: {
      backgroundColor: '#7f8c8d',
      color: 'white',
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Clientes Registrados</h3>
      {usuarios.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Correo</th>
              <th style={styles.th}>Teléfono</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario._id}>
                <td style={styles.td}>
                  {editandoId === usuario._id ? (
                    <input
                      type="text"
                      name="nombre"
                      value={formEditar.nombre}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  ) : (
                    usuario.nombre
                  )}
                </td>
                <td style={styles.td}>
                  {editandoId === usuario._id ? (
                    <input
                      type="email"
                      name="correo"
                      value={formEditar.correo}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  ) : (
                    usuario.correo
                  )}
                </td>
                <td style={styles.td}>
                  {editandoId === usuario._id ? (
                    <input
                      type="text"
                      name="telefono"
                      value={formEditar.telefono}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  ) : (
                    usuario.telefono
                  )}
                </td>
                <td style={styles.td}>
                  {editandoId === usuario._id ? (
                    <>
                      <button
                        style={{ ...styles.button, ...styles.guardar }}
                        onClick={() => guardarEdicion(usuario._id)}
                      >
                        Guardar
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.cancelar }}
                        onClick={cancelarEdicion}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        style={{ ...styles.button, ...styles.editar }}
                        onClick={() => editarUsuario(usuario)}
                      >
                        Editar
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.eliminar }}
                        onClick={() => eliminarUsuario(usuario._id)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
