
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

  return (
    <div style={{ padding: 20 }}>
      <h1>Painel do Cliente</h1>
      <p><strong>Plano:</strong> {cliente?.plano || "---"}</p>
      <p><strong>Lavagens restantes:</strong> {cliente?.lavagens_restantes ?? "---"}</p>
      <p><strong>Total já usadas:</strong> {lavagensHistorico.length}</p>
      <p><strong>Data de renovação:</strong> {proximaRenovacao()}</p>
      {posicaoFila && <p><strong>Posição na fila:</strong> {posicaoFila}</p>}
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
