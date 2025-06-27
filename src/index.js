
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
  const [fila, setFila] = useState([]);
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

        if (fila) {
          setFila(fila);
          const pos = fila.filter(f => f.status !== "finalizado").findIndex(f => f.cliente_id === cliente.id);
          setPosicaoFila(pos >= 0 ? pos + 1 : null);
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

  const isProximo = posicaoFila && posicaoFila <= 2;

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, marginBottom: 20, color: "#fff" }}>Painel Pit Stop</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{
          backgroundColor: "#ef4444",
          borderRadius: 20,
          textAlign: "center",
          padding: "30px 10px",
          fontSize: 32,
          fontWeight: "bold",
          color: "#fff"
        }}>
          {cliente?.lavagens_restantes ?? "-"}
          <div style={{ fontSize: 12, marginTop: 8 }}>Lavagens restantes</div>
        </div>

        <div style={{
          backgroundColor: "#fff",
          color: "#111",
          borderRadius: 20,
          padding: "20px 12px",
          fontWeight: 500,
          fontSize: 14
        }}>
          Plano: {cliente?.plano || "---"}
        </div>

        <div style={{
          backgroundColor: "#fff",
          color: "#111",
          borderRadius: 20,
          padding: "20px 12px",
          fontWeight: "bold",
          fontSize: 16,
          boxShadow: isProximo ? "0 0 15px 2px #facc15" : "none"
        }}>
          Posição na fila: {posicaoFila ?? "-"}
        </div>

        <div style={{
          backgroundColor: "#fff",
          color: "#111",
          borderRadius: 20,
          padding: "20px 12px",
          fontWeight: 500,
          fontSize: 14
        }}>
          Data de renovação:<br /> <strong>{proximaRenovacao()}</strong>
        </div>
      </div>

      <button style={{
        marginTop: 30,
        width: "100%",
        padding: "14px 0",
        backgroundColor: "#ef4444",
        color: "#fff",
        fontSize: 16,
        border: "none",
        borderRadius: 100,
        fontWeight: "bold"
      }}>
        Agendar Lavagem
      </button>
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
