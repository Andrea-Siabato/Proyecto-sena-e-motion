import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, login, logout } = useAuth();

  // Estados para el formulario de Login
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');

  // Estados para datos de perfil (cuando ya está logueado)
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [direccion, setDireccion] = useState(user?.direccion || '');
  const [passwordNueva, setPasswordNueva] = useState('');

  // Historial de pedidos
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

  // Mensajes de feedback
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:8080/api/pedidos/cliente/${user.id}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          setPedidos(data);
          setCargandoPedidos(false);
        })
        .catch(() => setCargandoPedidos(false));
    }
  }, [user]);

  // Manejar el inicio de sesión
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      const response = await fetch('http://localhost:8080/api/clientes/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLogin, password: passwordLogin })
      });

      if (response.ok) {
        const clienteLogueado = await response.json();
        login(clienteLogueado);
        window.location.reload();
      } else {
        setError('Correo o contraseña incorrectos.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor backend.');
    }
  };

  // Si NO ha iniciado sesión, mostramos el formulario de acceso
  if (!user) {
    return (
      <div style={{ padding: '40px', color: '#fff', maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
        <h2 style={{ color: '#00ff66', marginBottom: '20px', textAlign: 'center' }}>Iniciar Sesión</h2>
        
        {error && (
          <div style={{ padding: '10px', backgroundColor: '#331111', color: '#ff6666', border: '1px solid #ff6666', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>Correo Electrónico:</label>
            <input 
              type="email" 
              value={emailLogin} 
              onChange={(e) => setEmailLogin(e.target.value)} 
              required
              style={{ width: '100%', padding: '10px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} 
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>Contraseña:</label>
            <input 
              type="password" 
              value={passwordLogin} 
              onChange={(e) => setPasswordLogin(e.target.value)} 
              required
              style={{ width: '100%', padding: '10px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} 
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00ff66', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
            Entrar
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#aaa' }}>
          ¿No tienes una cuenta? <a href="/registro" style={{ color: '#00ff66', textDecoration: 'none' }}>Regístrate aquí</a>
        </p>
      </div>
    );
  }

  // Panel de usuario autenticado
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/clientes/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, direccion })
      });

      if (response.ok) {
        setMensaje('¡Perfil actualizado con éxito!');
      } else {
        setError('Error al actualizar el perfil.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor backend.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!passwordNueva || passwordNueva.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/clientes/cambiar-password/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordNueva })
      });

      if (response.ok) {
        setMensaje('¡Contraseña actualizada con éxito!');
        setPasswordNueva('');
      } else {
        setError('No se pudo cambiar la contraseña.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor backend.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Estás segura de que deseas cancelar tu cuenta en e-Motion?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/clientes/${user.id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Cuenta eliminada correctamente.');
        logout();
        window.location.href = '/';
      } else {
        setError('No se pudo eliminar la cuenta.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor backend.');
    }
  };

  return (
    <div style={{ padding: '40px', color: '#fff', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#00ff66', marginBottom: '20px' }}>Mi Cuenta e-Motion</h2>
      
      {mensaje && <div style={{ padding: '10px', backgroundColor: '#113311', color: '#00ff66', borderRadius: '4px', marginBottom: '20px' }}>{mensaje}</div>}
      {error && <div style={{ padding: '10px', backgroundColor: '#331111', color: '#ff6666', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

      {/* Historial de Pedidos */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333', marginBottom: '20px' }}>
        <h3 style={{ color: '#00ff66', marginBottom: '15px' }}>Historial de Pedidos</h3>
        {cargandoPedidos ? (
          <p style={{ color: '#aaa', fontSize: '14px' }}>Cargando tus pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: '14px' }}>Aún no has realizado ninguna compra en e-Motion.</p>
        ) : (
          pedidos.map((p, idx) => (
            <div key={idx} style={{ backgroundColor: '#222', padding: '12px', borderRadius: '6px', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', color: '#00ff66' }}>Pedido #{p.pedido_id}</span>
              <p style={{ fontSize: '14px', margin: '4px 0' }}>Total: ${p.total}</p>
            </div>
          ))
        )}
      </div>

      {/* Datos Personales */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333', marginBottom: '20px' }}>
        <h3 style={{ color: '#00ff66', marginBottom: '15px' }}>Datos Personales</h3>
        <form onSubmit={handleUpdateProfile}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>Nombre:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>Correo (No modificable):</label>
            <input type="email" value={user?.email || ''} disabled style={{ width: '100%', padding: '8px', backgroundColor: '#111', border: '1px solid #333', color: '#777', borderRadius: '4px' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>Teléfono:</label>
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>Dirección:</label>
            <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} />
          </div>
          <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#00ff66', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            Guardar Cambios
          </button>
        </form>
      </div>

      {/* Seguridad y Contraseña */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333', marginBottom: '20px' }}>
        <h3 style={{ color: '#00ff66', marginBottom: '15px' }}>Seguridad</h3>
        <form onSubmit={handlePasswordChange}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>Nueva Contraseña:</label>
            <input type="password" value={passwordNueva} onChange={(e) => setPasswordNueva(e.target.value)} placeholder="Mínimo 8 caracteres" style={{ width: '100%', padding: '8px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} />
          </div>
          <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#333', color: '#00ff66', border: '1px solid #00ff66', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            Cambiar Contraseña
          </button>
        </form>
      </div>

      {/* Eliminar cuenta */}
      <div style={{ backgroundColor: '#2a1111', padding: '20px', borderRadius: '8px', border: '1px solid #552222' }}>
        <h3 style={{ color: '#ff6666', marginBottom: '10px' }}>Cancelar Cuenta</h3>
        <button onClick={handleDeleteAccount} style={{ padding: '10px 15px', backgroundColor: '#cc0000', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Eliminar mi cuenta
        </button>
      </div>
    </div>
  );
}