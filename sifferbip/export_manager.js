/** EXPORT_MANAGER.JS - Exportação de Dados */
function exportarCSV() {
    const rows = document.querySelectorAll('#itemsList tbody tr');
    if (rows.length === 0) {
        if(window.showAlert) showAlert("Aviso", "A lista está vazia!");
        else alert("Lista vazia!");
        return;
    }

    // Estrutura do CSV conforme solicitado: ean;nome;quantidade
    let csv = "";
    rows.forEach(r => {
        const ean = r.cells[0].getAttribute('data-ean');
        const nome = r.querySelector('.item-nome').textContent;
        const qty = r.querySelector('.qty-val').textContent;
        csv += `${ean};${nome};${qty}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const nomeArq = `estoque_${currentListName}_${new Date().toISOString().slice(0,10)}.csv`;

    // Compartilhamento Nativo (Celular)
    if (navigator.share) {
        const file = new File([blob], nomeArq, { type: 'text/csv' });
        navigator.share({ 
            title: 'Contagem de Estoque', 
            text: `Segue a contagem da lista: ${currentListName}`,
            files: [file] 
        }).catch(err => {
            console.log("Erro no compartilhamento ou cancelado:", err);
            executarDownload(blob, nomeArq);
        });
    } else {
        // Fallback para Computador
        executarDownload(blob, nomeArq);
    }
}

function executarDownload(blob, nomeArq) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nomeArq;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}