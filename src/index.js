
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uhjfjlfelgymieqndbkk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoamZqbGZlbGd5bWllcW5kYmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTg2NTcsImV4cCI6MjA2NjU3NDY1N30.HVCVhPCzF-S1PuVNe3xIC_mqE6nRas0wu7HSssLSKHw"
);

function PainelCliente() {
  const { clienteId } = useParams();
  const [cliente, setCliente] = useState(null);
  const [fila, setFila] = useState(null);
  const [lavagensHistorico, setLavagensHistorico] = useState([]);
  const [posicaoFila, setPosicaoFila] = useState(null);

  useEffect(() => {
    async function fetchCliente() {
      const { data: cliente } = await supabase
        .from("clientes")
        .select("*")
        .eq("painel_url", `https://painel.lavajato.com/${clienteId}`)
        .single();

      if (cliente) {
        setCliente(cliente);

        const { data: fila } = await supabase
          .from("fila")
          .select("*")
          .order("entrada_fila", { ascending: true });

        if (fila && fila.length > 0) {
          const ativa = fila.find(f => f.status !== "finalizado" && f.cliente_id === cliente.id);
          setFila(ativa);

          const posicao = fila.filter(f => f.status !== "finalizado").findIndex(f => f.cliente_id === cliente.id);
          setPosicaoFila(posicao >= 0 ? posicao + 1 : null);
        }

        const { data: lavagens } = await supabase
          .from("lavagens")
          .select("*")
          .eq("cliente_id", cliente.id);

        if (lavagens) {
          setLavagensHistorico(lavagens);
        }
      }
    }

    fetchCliente();
    const interval = setInterval(fetchCliente, 30000);
    return () => clearInterval(interval);
  }, [clienteId]);

  const proximaRenovacao = () => {
    if (!cliente?.renovacao_dia) return "--";
    const hoje = new Date();
    const renovacao = new Date(hoje.getFullYear(), hoje.getMonth(), cliente.renovacao_dia);
    if (renovacao < hoje) renovacao.setMonth(renovacao.getMonth() + 1);
    return renovacao.toLocaleDateString();
  };

  const Card = ({ title, value, highlight }) => (
    <div style={{
      background: highlight ? '#2563eb' : 'rgba(15,23,42,0.85)',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      boxShadow: highlight ? '0 0 12px #3b82f6' : '0 1px 4px rgba(0,0,0,0.2)'
    }}>
      <h3 style={{ margin: '0 0 8px', fontSize: 14, color: '#cbd5e1' }}>{title}</h3>
      <div style={{ fontSize: highlight ? 28 : 22, fontWeight: 700 }}>{value}</div>
    </div>
  );

  return (
    <div style={{
      padding: 24, maxWidth: 460, margin: '0 auto',
      backgroundColor: 'rgba(0,0,0,0.4)',
      borderRadius: 16, marginTop: 40
    }}>
      <h1 style={{ fontSize: 26, marginBottom: 24, textAlign: 'center', color: '#38bdf8' }}>
        Painel Pit Stop
      </h1>
      <Card title="Plano" value={cliente?.plano || "---"} />
      <Card title="Lavagens restantes" value={cliente?.lavagens_restantes ?? "---"} />
      <Card title="Total já usadas" value={lavagensHistorico.length} />
      <Card title="Data de renovação" value={proximaRenovacao()} />
      {posicaoFila && <Card title="Posição na fila" value={posicaoFila} highlight />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/:clienteId" element={<PainelCliente />} />
    </Routes>
  </BrowserRouter>
);
