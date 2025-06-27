
async function carregarPainel() {
  const clientId = document.getElementById("clientId").value.trim();
  if (!clientId) return alert("Informe seu código.");

  const res = await fetch("https://uhjfjlfelgymieqndbkk.supabase.co/rest/v1/clientes?painel_url=eq." + clientId, {
    headers: {
      apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz..."
    }
  });

  const data = await res.json();
  if (data.length === 0) return alert("Cliente não encontrado!");

  const cliente = data[0];
  document.getElementById("lavagensRestantes").innerText = cliente.lavagens_restantes;
  document.getElementById("plano").innerText = cliente.plano;
  document.getElementById("posicaoFila").innerText = cliente.posicao_na_fila || "--";
  document.getElementById("renovacao").innerText = cliente.data_renovacao || "--";
  document.getElementById("usadas").innerText = cliente.total_usadas || "0";

  document.getElementById("input-area").style.display = "none";
  document.getElementById("painel").style.display = "block";
}
