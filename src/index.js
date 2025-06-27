
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uhjfjlfelgymieqndbkk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoamZqbGZlbGd5bWllcW5kYmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTg2NTcsImV4cCI6MjA2NjU3NDY1N30.HVCVhPCzF-S1PuVNe3xIC_mqE6nRas0wu7HSssLSKHw"
);

function PainelCliente() {
  const { clienteId } = useParams();
  const [lavagens, setLavagens] = React.useState(null);

  React.useEffect(() => {
    async function buscar() {
      const { data } = await supabase.from("clientes").select("*").eq("painel_url", `https://painel.lavajato.com/${clienteId}`).single();
      setLavagens(data?.lavagens_restantes || 0);
    }
    buscar();
  }, [clienteId]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Painel do Cliente</h1>
      <p>ID: {clienteId}</p>
      <p>Lavagens restantes: {lavagens !== null ? lavagens : "Carregando..."}</p>
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
