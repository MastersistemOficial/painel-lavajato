
import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  return (
    <div style={{
      backgroundColor: '#1C1C1E',
      color: '#FFFFFF',
      width: '100%',
      minHeight: '100vh',
      padding: 24,
      boxSizing: 'border-box',
      fontFamily: 'Poppins, sans-serif',
      position: 'relative'
    }}>
      {/* Logo superior */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20 }}>
        <div style={{
          backgroundColor: '#E64556',
          borderRadius: 8,
          padding: '6px 12px',
          fontSize: 28
        }}>Pit Stop</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ width: 24, height: 24, backgroundColor: '#fff', borderRadius: 4 }} />
          <span style={{ width: 24, height: 24, backgroundColor: '#fff', borderRadius: 4 }} />
          <span style={{ width: 24, height: 24, backgroundColor: '#fff', borderRadius: 4 }} />
        </div>
      </div>

      <h1 style={{ fontSize: 48, fontWeight: 700, color: '#FFFFFF', margin: '24px 0' }}>Painel Pit Stop</h1>

      {/* Cartões */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {/* Lavagens restantes */}
        <div style={{
          width: 480,
          height: 480,
          backgroundColor: '#E64556',
          borderRadius: 24,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#FFFFFF'
        }}>
          <div style={{ fontSize: 180, fontWeight: 800 }}>4</div>
          <div style={{ fontSize: 32, fontWeight: 400, marginTop: 16 }}>Lavagens restantes</div>
        </div>

        {/* Plano com sobreposição */}
        <div style={{ position: 'relative', width: 480, height: 230 }}>
          <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            width: 480,
            height: 230,
            backgroundColor: '#2C2C2E',
            borderRadius: 24,
            zIndex: 1
          }}></div>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 480,
            height: 230,
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: 24,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: '#000000'
          }}>
            <div style={{ fontSize: 32, fontWeight: 400 }}>Plano: <span style={{ fontSize: 48, fontWeight: 700 }}>Essencial</span></div>
          </div>
        </div>

        {/* Posição na fila */}
        <div style={{
          width: 480,
          height: 230,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: 24,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: '#000000'
        }}>
          <div style={{ fontSize: 32, fontWeight: 400 }}>Posição na fila:</div>
          <div style={{ fontSize: 48, fontWeight: 700, marginTop: 8 }}>1</div>
        </div>

        {/* Data de renovação */}
        <div style={{
          width: 480,
          height: 230,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: 24,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: '#000000'
        }}>
          <div style={{ fontSize: 32, fontWeight: 400 }}>Data de renovação:</div>
          <div style={{ fontSize: 48, fontWeight: 700, marginTop: 8 }}>27/07/2025</div>
        </div>
      </div>

      {/* Botão */}
      <div style={{ marginTop: 48 }}>
        <button style={{
          width: 984,
          height: 96,
          backgroundColor: '#E64556',
          borderRadius: 48,
          border: 'none',
          fontSize: 40,
          fontWeight: 700,
          color: '#FFFFFF',
          display: 'block',
          margin: '48px auto 0 auto'
        }}>
          Agendar Lavagem
        </button>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
