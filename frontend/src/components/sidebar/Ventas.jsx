import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ventas.css';

export default function Ventas() {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const obtenerCompras = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/compras');
        setCompras(res.data);
      } catch (error) {
        console.error('Error al obtener historial de compras:', error);
      }
    };

    obtenerCompras();
  }, []);

  return (
    <div className="ventas-container">
      <h2 className="ventas-titulo">Historial de Ventas</h2>
      {compras.length === 0 ? (
        <p className="mensaje">No hay compras registradas.</p>
      ) : (
        <div className="lista-compras">
          {compras.map((compra, index) => (
            <div className="compra-card" key={index}>
              <p><strong>Usuario:</strong> {compra.usuario}</p>
              <p><strong>Fecha:</strong> {new Date(compra.fecha).toLocaleString()}</p>
              <p><strong>Total:</strong> ${compra.total}</p>
              <div className="productos-compra">
                <p><strong>Productos:</strong></p>
                <ul>
                  {compra.productos.map((producto, idx) => (
                    <li key={idx}>
                      {producto.nombre} - Cantidad: {producto.cantidad} - Precio: ${producto.precio}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
