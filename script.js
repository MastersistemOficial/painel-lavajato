async function carregarPainel() {
  const clientId = document.getElementById("clientId").value.trim();
  if (!clientId) return alert("Informe seu código.");

  try {
    const res = await fetch("https://uhjfjlfelgymieqndbkk.supabase.co/rest/v1/clientes?select=*&painel_url=eq." + clientId, {
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoamZqbGZlbGd5bWllcW5kYmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTg2NTcsImV4cCI6MjA2NjU3NDY1N30.HVCVhPCzF-S1PuVNe3xIC_mqE6nRas0wu7HSssLSKHw",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoamZqbGZlbGd5bWllcW5kYmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTg2NTcsImV4cCI6MjA2NjU3NDY1N30.HVCVhPCzF-S1PuVNe3xIC_mqE6nRas0wu7HSssLSKHw"
      }
    });

    const data = await res.json();
    if (!data || data.length === 0) {
      alert("Cliente não encontrado.");
      return;
    }

    const cliente = data[0];
    document.getElementById("lavagensRestantes").innerText = cliente.lavagens_restantes ?? "--";
    document.getElementById("plano").innerText = cliente.plano ?? "--";
    document.getElementById("posicaoFila").innerText = cliente.posicao_na_fila ?? "--";
    document.getElementById("renovacao").innerText = cliente.data_renovacao ?? "--";
    document.getElementById("usadas").innerText = cliente.total_usadas ?? "0";

    document.getElementById("input-area").style.display = "none";
    document.getElementById("painel").style.display = "block";
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    alert("Erro ao conectar com o servidor.");
  }
}