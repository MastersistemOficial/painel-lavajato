
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
    <div style={{ minHeight: "100vh", padding: 20, maxWidth: 440, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <h1 style={{ fontSize: 24, marginBottom: 28, textAlign: "center", color: "#fff" }}>Painel Pit Stop</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{
            backgroundColor: "#dc0000",
            borderRadius: 20,
            textAlign: "center",
            padding: "36px 10px",
            fontSize: 34,
            fontWeight: 700,
            color: "#fff"
          }}>
            {cliente?.lavagens_restantes ?? "-"}
            <div style={{ fontSize: 13, marginTop: 8 }}>Lavagens restantes</div>
          </div>

          <div style={{
            backgroundColor: "#fff",
            color: "#111",
            borderRadius: 20,
            padding: "20px 12px",
            fontWeight: 600,
            fontSize: 15,
            display: "flex",
            alignItems: "center"
          }}>
            Plano: {cliente?.plano || "---"}
          </div>

          <div style={{
            backgroundColor: "#fff",
            color: "#111",
            borderRadius: 20,
            padding: "36px 12px",
            fontWeight: "bold",
            fontSize: 20,
            textAlign: "center",
            boxShadow: isProximo ? "0 0 15px 2px #facc15" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
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
      </div>

      <button style={{
        marginTop: 40,
        width: "100%",
        padding: "16px 0",
        backgroundColor: "#dc0000",
        color: "#fff",
        fontSize: 16,
        border: "none",
        borderRadius: 100,
        fontWeight: 700
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
