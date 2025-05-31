import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DashboardCliente() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    setNombre(nombreGuardado || 'cliente');

    const obtenerProductos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/productos');
        setProductos(res.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };
    obtenerProductos();
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem('nombreUsuario');
    navigate('/');
  };

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p._id === producto._id);
      if (existe) {
        return prev.map((p) =>
          p._id === producto._id && p.cantidad < producto.stock
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const quitarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((p) => p._id !== id));
  };

  const aumentarCantidad = (id) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item._id === id && item.cantidad < item.stock
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const disminuirCantidad = (id) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item._id === id && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
    );
  };

  const finalizarCompra = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const productosCompra = carrito.map(({ _id, nombre, precio, cantidad }) => ({
      productoId: _id,
      nombre,
      precio,
      cantidad,
    }));

    const total = productosCompra.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const compra = {
      usuario: nombre,
      productos: productosCompra,
      total,
      fecha: new Date(),
    };

    try {
      await axios.post('http://localhost:5000/api/compras', compra);
      alert('Compra realizada con éxito');
      setCarrito([]);
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      alert('Ocurrió un error al finalizar la compra');
    }
  };

  const toggleAiAssistant = () => {
    setAiAssistantOpen(!aiAssistantOpen);
    if (!aiAssistantOpen && aiMessages.length === 0) {
      setAiMessages([{
        sender: 'assistant',
        text: '¡Hola! Soy tu asistente de compras. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre productos, recomendaciones o ayuda con tu carrito.'
      }]);
    }
  };

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || aiLoading) return;

    const newUserMessage = { sender: 'user', text: userInput };
    setAiMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setAiLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ollama', {
        prompt: `Eres un asistente de compras para una tienda en línea. El usuario ha dicho: "${userInput}". 
        Productos disponibles: ${productos.map(p => p.nombre).join(', ')}. 
        Carrito actual: ${carrito.length > 0 ? carrito.map(i => `${i.nombre} (${i.cantidad})`).join(', ') : 'vacío'}. 
        Responde de manera útil y concisa.`
      });

      setAiMessages(prev => [...prev, {
        sender: 'assistant',
        text: response.data.respuesta
      }]);
    } catch (error) {
      console.error('Error al comunicarse con Ollama:', error);
      setAiMessages(prev => [...prev, {
        sender: 'assistant',
        text: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.'
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Bienvenido, {nombre}</h1>
          <p style={styles.subtitle}>Explora nuestros productos</p>
        </div>
        <button onClick={handleCerrarSesion} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </header>

      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Productos Disponibles</h2>
          {loading ? (
            <div style={styles.loading}>Cargando productos...</div>
          ) : productos.length === 0 ? (
            <p style={styles.emptyMessage}>No hay productos disponibles.</p>
          ) : (
            <div style={styles.productGrid}>
              {productos.map((producto) => (
                <div key={producto._id} style={styles.productCard}>
                  <div style={styles.productImage}>
                    {producto.imagen ? (
                      <img src={producto.imagen} alt={producto.nombre} style={styles.image} />
                    ) : (
                      <div style={styles.imagePlaceholder}>🛒</div>
                    )}
                  </div>
                  <div style={styles.productInfo}>
                    <h3 style={styles.productName}>{producto.nombre}</h3>
                    <p style={styles.productDescription}>{producto.descripcion}</p>
                    <div style={styles.priceStock}>
                      <span style={styles.price}>${producto.precio.toFixed(2)}</span>
                      <span style={producto.stock > 0 ? styles.inStock : styles.outOfStock}>
                        {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
                      </span>
                    </div>
                    <button
                      disabled={producto.stock <= 0}
                      onClick={() => agregarAlCarrito(producto)}
                      style={producto.stock > 0 ? styles.addButton : styles.disabledButton}
                    >
                      {producto.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside style={styles.cartSection}>
          <h2 style={styles.sectionTitle}>Tu Carrito</h2>
          {carrito.length === 0 ? (
            <div style={styles.emptyCart}>
              <p style={styles.emptyMessage}>Tu carrito está vacío</p>
              <p style={styles.emptySubmessage}>Añade productos para continuar</p>
            </div>
          ) : (
            <>
              <ul style={styles.cartList}>
                {carrito.map((item) => (
                  <li key={item._id} style={styles.cartItem}>
                    <div style={styles.cartItemInfo}>
                      <h4 style={styles.cartItemName}>{item.nombre}</h4>
                      <p style={styles.cartItemPrice}>${item.precio.toFixed(2)} c/u</p>
                    </div>
                    <div style={styles.cartItemControls}>
                      <div style={styles.quantityControls}>
                        <button
                          onClick={() => disminuirCantidad(item._id)}
                          style={styles.quantityButton}
                          disabled={item.cantidad <= 1}
                        >
                          -
                        </button>
                        <span style={styles.quantity}>{item.cantidad}</span>
                        <button
                          onClick={() => aumentarCantidad(item._id)}
                          style={styles.quantityButton}
                          disabled={item.cantidad >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      <p style={styles.itemTotal}>
                        ${(item.precio * item.cantidad).toFixed(2)}
                      </p>
                      <button
                        onClick={() => quitarDelCarrito(item._id)}
                        style={styles.removeButton}
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div style={styles.cartSummary}>
                <div style={styles.totalRow}>
                  <span>Subtotal:</span>
                  <span>${carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}</span>
                </div>
                <div style={styles.totalRow}>
                  <span>Envío:</span>
                  <span>$0.00</span>
                </div>
                <div style={{...styles.totalRow, ...styles.grandTotal}}>
                  <span>Total:</span>
                  <span>${carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}</span>
                </div>
                
                <button
                  onClick={finalizarCompra}
                  style={styles.checkoutButton}
                >
                  Finalizar Compra
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Asistente de IA */}
      <button 
        onClick={toggleAiAssistant}
        style={styles.aiButton}
      >
        {aiAssistantOpen ? '×' : 'Asistente IA'}
      </button>

      {aiAssistantOpen && (
        <div style={styles.aiPanel}>
          <div style={styles.aiHeader}>
            <h3 style={styles.aiTitle}>Asistente de Compras</h3>
            <button 
              onClick={toggleAiAssistant}
              style={styles.aiCloseButton}
            >
              ×
            </button>
          </div>
          
          <div style={styles.aiMessagesContainer}>
            {aiMessages.map((message, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.aiMessage,
                  ...(message.sender === 'user' ? styles.userMessage : styles.assistantMessage)
                }}
              >
                {message.text}
              </div>
            ))}
            {aiLoading && (
              <div style={styles.aiLoading}>
                <div style={styles.aiLoadingDot}></div>
                <div style={styles.aiLoadingDot}></div>
                <div style={styles.aiLoadingDot}></div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleAiSubmit} style={styles.aiForm}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              style={styles.aiInput}
              disabled={aiLoading}
            />
            <button 
              type="submit"
              style={styles.aiSubmitButton}
              disabled={aiLoading || !userInput.trim()}
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    padding: '20px',
    color: '#333',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e1e5eb',
  },
  title: {
    fontSize: '28px',
    color: '#2c3e50',
    margin: 0,
  },
  subtitle: {
    fontSize: '16px',
    color: '#7f8c8d',
    margin: '5px 0 0',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '30px',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  cartSection: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    alignSelf: 'start',
    position: 'sticky',
    top: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#2c3e50',
    marginTop: 0,
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#7f8c8d',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '20px',
  },
  emptySubmessage: {
    textAlign: 'center',
    color: '#bdc3c7',
    fontSize: '14px',
    marginTop: '-15px',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  productCard: {
    border: '1px solid #e1e5eb',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  productImage: {
    height: '160px',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imagePlaceholder: {
    fontSize: '40px',
    color: '#bdc3c7',
  },
  productInfo: {
    padding: '15px',
  },
  productName: {
    margin: '0 0 10px',
    fontSize: '16px',
    fontWeight: '600',
  },
  productDescription: {
    fontSize: '14px',
    color: '#7f8c8d',
    margin: '0 0 15px',
    height: '40px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  priceStock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  price: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2c3e50',
  },
  inStock: {
    fontSize: '12px',
    color: '#27ae60',
    backgroundColor: '#e8f5e9',
    padding: '3px 8px',
    borderRadius: '10px',
  },
  outOfStock: {
    fontSize: '12px',
    color: '#e74c3c',
    backgroundColor: '#fdedec',
    padding: '3px 8px',
    borderRadius: '10px',
  },
  addButton: {
    width: '100%',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
  disabledButton: {
    width: '100%',
    backgroundColor: '#bdc3c7',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    cursor: 'not-allowed',
    fontWeight: '600',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '30px 0',
  },
  cartList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  cartItem: {
    padding: '15px 0',
    borderBottom: '1px solid #eee',
  },
  cartItemInfo: {
    marginBottom: '10px',
  },
  cartItemName: {
    margin: '0 0 5px',
    fontSize: '15px',
  },
  cartItemPrice: {
    margin: 0,
    fontSize: '14px',
    color: '#7f8c8d',
  },
  cartItemControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  quantityButton: {
    width: '28px',
    height: '28px',
    backgroundColor: '#f5f7fa',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    minWidth: '20px',
    textAlign: 'center',
    fontSize: '14px',
  },
  itemTotal: {
    fontWeight: '600',
    fontSize: '15px',
    margin: '0 10px',
  },
  removeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#e74c3c',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px',
    marginLeft: '10px',
  },
  cartSummary: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontSize: '15px',
  },
  grandTotal: {
    fontWeight: '600',
    fontSize: '16px',
    margin: '15px 0',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
  },
  checkoutButton: {
    width: '100%',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  aiButton: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiPanel: {
    position: 'fixed',
    bottom: '100px',
    right: '30px',
    width: '350px',
    maxHeight: '500px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    overflow: 'hidden'
  },
  aiHeader: {
    padding: '15px',
    backgroundColor: '#2c3e50',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  aiTitle: {
    margin: 0,
    fontSize: '16px'
  },
  aiCloseButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0',
    lineHeight: '1'
  },
  aiMessagesContainer: {
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  aiMessage: {
    padding: '10px 15px',
    borderRadius: '18px',
    maxWidth: '80%',
    wordWrap: 'break-word'
  },
  userMessage: {
    backgroundColor: '#3498db',
    color: 'white',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '5px'
  },
  assistantMessage: {
    backgroundColor: '#f1f1f1',
    color: '#333',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '5px'
  },
  aiLoading: {
    display: 'flex',
    gap: '5px',
    justifyContent: 'center',
    padding: '10px'
  },
  aiLoadingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#ccc'
  },
  aiForm: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #eee'
  },
  aiInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    outline: 'none'
  },
  aiSubmitButton: {
    marginLeft: '10px',
    padding: '10px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer'
  }
};

export default DashboardCliente;