// Carrega os itens quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    loadItems();
});

document.getElementById('itemForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const barcode = document.getElementById('barcode').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    addItemToList(barcode, quantity);
});
let produtos = [];

function loadProdutos() {
    fetch('produtos.json')
        .then(response => response.json())
        .then(data => {
            produtos = data;
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    loadProdutos();
    loadListsNames();
    loadItems(currentListName);
});

function addItemToList(barcode, quantity) {
    const itemsList = document.getElementById('itemsList').getElementsByTagName('tbody')[0];
    let itemExists = false;
    
    // Verifica e atualiza quantidade se o item já existe
    for (let row of itemsList.rows) {
        if (row.cells[0].textContent === barcode) {
            itemExists = true;
            row.cells[1].textContent = parseInt(row.cells[1].textContent) + quantity;
            row.style.backgroundColor = '#FFD700'; // Highlight
            break;
        }
    }
    const produto = produtos.find(p => p.ean === barcode);
    const nomeProduto = produto ? produto.nome : 'Produto não encontrado';


    // Adiciona novo item se não existir
    if (!itemExists) {
        const newRow = itemsList.insertRow();
        const cellBarcode = newRow.insertCell(0);
        const cellQuantity = newRow.insertCell(1);
        const cellNome = newRow.insertCell(2); // Nova célula para o nome do produto

        cellBarcode.textContent = barcode;
        cellQuantity.textContent = quantity;
        cellNome.textContent = nomeProduto; // Define o nome do produto na célula
    }

    saveItems(); // Salva a lista atualizada no LocalStorage

    document.getElementById('barcode').value = '';
    document.getElementById('quantity').value = '1';
    document.getElementById('barcode').focus();
}

function saveItems() {
    const itemsList = document.getElementById('itemsList').getElementsByTagName('tbody')[0];
    const itemsArray = [];

    for (let row of itemsList.rows) {
        itemsArray.push({ barcode: row.cells[0].textContent, quantity: row.cells[1].textContent });
    }

    localStorage.setItem('items', JSON.stringify(itemsArray));
}

function loadItems() {
    const items = JSON.parse(localStorage.getItem('items'));
    if (items) {
        const itemsList = document.getElementById('itemsList').getElementsByTagName('tbody')[0];
        itemsList.innerHTML = ''; // Limpa a lista atual

        for (let item of items) {
            const newRow = itemsList.insertRow();
            const cellBarcode = newRow.insertCell(0);
            const cellQuantity = newRow.insertCell(1);

            cellBarcode.textContent = item.barcode;
            cellQuantity.textContent = item.quantity;
        }
    }
}
