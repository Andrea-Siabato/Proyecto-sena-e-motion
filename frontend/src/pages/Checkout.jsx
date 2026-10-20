import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { items = [], total, refresh } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('nequi');
  const [loading, setLoading] = useState(false);

  // Datos de entrega
  const [shipping, setShipping] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: 'Bogotá'
  });

  // Datos de métodos de pago
  const [nequiPhone, setNequiPhone] = useState('');
  const [pseBank, setPseBank] = useState('Bancolombia');
  const [cardData, setCardData] = useState({ numero: '', exp: '', cvc: '' });

  const handleNext = (e) => {
    e.preventDefault();
    if (!shipping.nombre || !shipping.email || !shipping.telefono || !shipping.direccion) {
      alert("Por favor completa todos los campos de entrega.");
      return;
    }
    setStep(2);
  };

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de procesamiento de pago
    setTimeout(() => {
      setLoading(false);
      alert(`¡Pago procesado con éxito vía ${method.toUpperCase()}! 🚀\n\nGracias por tu compra en e-Motion.`);
      localStorage.removeItem('emotion_cart_v1');
      if (refresh) refresh();
      navigate('/');
    }, 2000);
  };

  if (!items || items.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '30px', backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', textAlign: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
        <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>Tu carrito está vacío</h3>
        <button onClick={() => navigate('/catalogo')} style={{ backgroundColor: '#22c55e', color: '#000', fontWeight: '700', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          Volver al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '750px', margin: '40px auto', padding: '0 20px', color: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px', color: '#22c55e' }}>
        Pasarela de Pago e-Motion
      </h2>

      {/* Indicador de pasos */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid #27272a', paddingBottom: '14px' }}>
        <span style={{ color: step >= 1 ? '#22c55e' : '#71717a', fontWeight: '700' }}>1. Datos de Envío</span>
        <span style={{ color: step === 2 ? '#22c55e' : '#71717a', fontWeight: '700' }}>2. Método de Pago & Confirmación</span>
      </div>

      {step === 1 && (
        <form onSubmit={handleNext} style={{ backgroundColor: '#18181b', padding: '28px', borderRadius: '16px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', margin: 0, color: '#ffffff', fontWeight: '600' }}>Información del Comprador</h3>
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', marginBottom: '6px' }}>Nombre Completo</label>
            <input required type="text" value={shipping.nombre} onChange={(e) => setShipping({...shipping, nombre: e.target.value})} placeholder="Ej: Andrea González" style={{ width: '100%', padding: '12px', backgroundColor: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', marginBottom: '6px' }}>Correo Electrónico</label>
            <input required type="email" value={shipping.email} onChange={(e) => setShipping({...shipping, email: e.target.value})} placeholder="andrea@ejemplo.com" style={{ width: '100%', padding: '12px', backgroundColor: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', outline: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', marginBottom: '6px' }}>Teléfono Celular</label>
              <input required type="tel" value={shipping.telefono} onChange={(e) => setShipping({...shipping, telefono: e.target.value})} placeholder="311 000 0000" style={{ width: '100%', padding: '12px', backgroundColor: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', marginBottom: '6px' }}>Dirección de Entrega</label>
              <input required type="text" value={shipping.direccion} onChange={(e) => setShipping({...shipping, direccion: e.target.value})} placeholder="Calle / Carrera..." style={{ width: '100%', padding: '12px', backgroundColor: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', outline: 'none' }} />
            </div>
          </div>

          <button type="submit" style={{ width: '100%', backgroundColor: '#22c55e', color: '#000', fontWeight: '800', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>
            Continuar a Selección de Pago →
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePay} style={{ backgroundColor: '#18181b', padding: '28px', borderRadius: '16px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', margin: 0, color: '#ffffff', fontWeight: '600' }}>Selecciona tu Medio de Pago</h3>

          {/* Opciones de Medios de Pago en Colombia */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { id: 'nequi', name: 'Nequi' },
              { id: 'daviplata', name: 'Daviplata' },
              { id: 'pse', name: 'PSE (Débito)' },
              { id: 'tarjeta', name: 'Tarjeta Crédito/Débito' }
            ].map((m) => (
              <div 
                key={m.id}
                onClick={() => setMethod(m.id)}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: method === m.id ? '2px solid #22c55e' : '1px solid #3f3f46',
                  backgroundColor: method === m.id ? 'rgba(34, 197, 94, 0.1)' : '#27272a',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: '700',
                  color: method === m.id ? '#22c55e' : '#ffffff',
                  transition: 'all 0.2s ease'
                }}
              >
                {m.name}
              </div>
            ))}
          </div>

          {/* Formulario adaptativo según la selección */}
          <div style={{ backgroundColor: '#09090b', padding: '20px', borderRadius: '12px', border: '1px solid #27272a' }}>
            {(method === 'nequi' || method === 'daviplata') && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', marginBottom: '6px' }}>Número de celular {method.toUpperCase()}</label>
                <input required type="tel" value={nequiPhone} onChange={(e) => setNequiPhone(e.target.value)} placeholder="311 000 0000" style={{ width: '100%', padding: '12px', backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', outline: 'none' }} />
                <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '8px', marginBotton: 0 }}>Te llegará una notificación a tu celular para aprobar la transferencia.</p>
              </div>
            )}

            {method === 'pse' && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', marginBottom: '6px' }}>Banco emisor</label>
                <select value={pseBank} onChange={(e) => setPseBank(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', outline: 'none' }}>
                  <option value="Bancolombia">Bancolombia</option>
                  <option value="Banco de Bogotá">Banco de Bogotá</option>
                  <option value="Davivienda">Davivienda</option>
                  <option value="BBVA Colombia">BBVA Colombia</option>
                  <option value="Nu Colombia">Nu Colombia</option>
                </select>
              </div>
            )}

            {method === 'tarjeta' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input required type="text" value={cardData.numero} onChange={(e) => setCardData({...cardData, numero: e.target.value})} placeholder="Número de tarjeta (16 dígitos)" style={{ width: '100%', padding: '10px', backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input required type="text" value={cardData.exp} onChange={(e) => setCardData({...cardData, exp: e.target.value})} placeholder="MM/AA" style={{ padding: '10px', backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }} />
                  <input required type="password" maxLength="4" value={cardData.cvc} onChange={(e) => setCardData({...cardData, cvc: e.target.value})} placeholder="CVC" style={{ padding: '10px', backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }} />
                </div>
              </div>
            )}
          </div>

          {/* Resumen final de costo */}
          <div style={{ borderTop: '1px solid #27272a', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', color: '#a1a1aa' }}>Total a pagar:</span>
            <span style={{ fontSize: '26px', fontWeight: '800', color: '#22c55e' }}>$ {Number(total).toLocaleString()} COP</span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={() => setStep(1)} style={{ width: '35%', backgroundColor: '#27272a', color: '#fff', border: '1px solid #3f3f46', padding: '14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>
              ← Atrás
            </button>
            <button type="submit" disabled={loading} style={{ width: '65%', backgroundColor: '#22c55e', color: '#000', fontWeight: '800', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
              {loading ? "Procesando pago..." : `Pagar $ ${Number(total).toLocaleString()}`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}