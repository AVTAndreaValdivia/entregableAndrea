import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Productos.css';

export default function Productos() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [productos, setProductos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleAgregar = async () => {
    if (!nombre || !descripcion || !precio || !stock) {
      alert('Por favor complete todos los campos');
      return;
    }

    const nuevoProducto = { nombre, descripcion, precio, stock };

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/productos/${editId}`, nuevoProducto);
        setEditId(null);
        setEditIndex(null);
      } else {
        await axios.post('http://localhost:5000/api/productos', nuevoProducto);
      }

      obtenerProductos();
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setStock('');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Ocurrió un error al guardar el producto.');
    }
  };

  const handleEditar = (index) => {
    const producto = productos[index];
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setPrecio(producto.precio);
    setStock(producto.stock);
    setEditIndex(index);
    setEditId(producto._id);
  };

  const handleEliminar = async (index) => {
    const producto = productos[index];
    if (!window.confirm(`¿Seguro que quieres eliminar el producto "${producto.nombre}"?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/productos/${producto._id}`);
      obtenerProductos();

      if (editIndex === index) {
        setEditIndex(null);
        setEditId(null);
        setNombre('');
        setDescripcion('');
        setPrecio('');
        setStock('');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('No se pudo eliminar el producto.');
    }
  };

  return (
    <div className="productos-container">
      <h2 className="titulo">Gestión de Productos</h2>

      <div className="formulario">
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del producto" />
        <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" />
        <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio" />
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" />

        <button onClick={handleAgregar}>
          {editIndex !== null ? 'Guardar Cambios' : 'Agregar Producto'}
        </button>
      </div>

      <h3 className="subtitulo">Lista de Productos</h3>
      {productos.length === 0 && <p className="mensaje">No hay productos agregados.</p>}

      <div className="lista-productos">
        {productos.map((producto, index) => (
          <div className="producto-card" key={producto._id}>
            <div className="info">
              <strong>{producto.nombre}</strong>
              <p>{producto.descripcion}</p>
              <p>Precio: ${producto.precio}</p>
              <p>Stock: {producto.stock}</p>
            </div>
            <div className="acciones">
              <button className="btn-editar" onClick={() => handleEditar(index)}>Editar</button>
              <button className="btn-eliminar" onClick={() => handleEliminar(index)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
