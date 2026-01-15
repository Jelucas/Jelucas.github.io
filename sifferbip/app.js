/** APP.JS - Lógica de Dados e Core */
let currentListName = 'listaPadrao';
let produtos = [];

document.addEventListener('DOMContentLoaded', () => {
    loadProdutos();
    loadListsNames();
    const selector = document.getElementById('listSelector');
    if (selector && selector.value) currentListName = selector.value;
    loadItems(currentListName);
    document.getElementById('barcode').focus();
});

function loadProdutos() {
    fetch('produtos.json')
        .then(r => r.json())
        .then(data => { produtos = data; })
        .catch(() => console.log("Produtos.json offline"));
}

function loadListsNames() {
    let lists = JSON.parse(localStorage.getItem('lists')) || { 'listaPadrao': [] };
    const selector = document.getElementById('listSelector');
    if (!selector) return;
    selector.innerHTML = '';
    Object.keys(lists).forEach(name => selector.add(new Option(name, name)));
    selector.value = currentListName;
}

function createNewListLogic(name) {
    let lists = JSON.parse(localStorage.getItem('lists')) || {};
    if (lists[name]) return showAlert("Erro", "Esta lista já existe.");
    lists[name] = [];
    localStorage.setItem('lists', JSON.stringify(lists));
    currentListName = name;
    loadListsNames();
    loadItems(name);
}

function changeList(name) {
    currentListName = name;
    loadItems(name);
}

function removeCurrentList() {
    if (currentListName === 'listaPadrao') return showAlert("Aviso", "A lista padrão não pode ser excluída.");
    let lists = JSON.parse(localStorage.getItem('lists')) || {};
    delete lists[currentListName];
    localStorage.setItem('lists', JSON.stringify(lists));
    location.reload();
}

document.getElementById('itemForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const bInp = document.getElementById('barcode');
    const qInp = document.getElementById('quantity');
    let barcode = bInp.value.trim().replace(/\D/g, '');
    const qty = parseInt(qInp.value, 10);

    if (!barcode) return;

    const prod = produtos.find(p => p.ean && p.ean.toString() === barcode);
    const nome = prod ? prod.nome : 'Produto não cadastrado';
    const isNovo = !prod;

    if (!isNovo) { 
        if(window.playSuccessSound) playSuccessSound(); 
    } else { 
        if(window.playErrorSound) playErrorSound(); 
    }

    updateOrAddRow(barcode, qty, nome, isNovo);
    bInp.value = ''; qInp.value = '1'; bInp.focus();
});

function updateOrAddRow(barcode, qty, nome, isNovo) {
    const tbody = document.querySelector('#itemsList tbody');
    for (let row of tbody.rows) {
        if (row.cells[0].getAttribute('data-ean') === barcode) {
            const span = row.querySelector('.qty-val');
            span.textContent = parseInt(span.textContent) + qty;
            tbody.insertBefore(row, tbody.firstChild);
            return saveItems();
        }
    }

    const row = tbody.insertRow(0);
    if (isNovo) row.classList.add('linha-nao-cadastrada');

    const c1 = row.insertCell(0); c1.setAttribute('data-ean', barcode);
    c1.innerHTML = `<strong>${barcode}</strong><span class="item-nome">${nome}</span>`;
    
    const c2 = row.insertCell(1); c2.style.textAlign = "center";
    c2.innerHTML = `<span class="qty-val">${qty}</span>`;
    
    const c3 = row.insertCell(2);
    c3.innerHTML = `<button onclick="showConfirmModal('Remover item?', () => { this.closest('tr').remove(); saveItems(); })" style="border:none; background:none; font-size:1.2rem;">❌</button>`;
    
    saveItems();
}

function saveItems() {
    const items = Array.from(document.querySelectorAll('#itemsList tbody tr')).map(row => ({
        barcode: row.cells[0].getAttribute('data-ean'),
        quantity: row.querySelector('.qty-val').textContent,
        nome: row.querySelector('.item-nome').textContent
    }));
    let lists = JSON.parse(localStorage.getItem('lists')) || {};
    lists[currentListName] = items;
    localStorage.setItem('lists', JSON.stringify(lists));
}

function loadItems(name) {
    const lists = JSON.parse(localStorage.getItem('lists')) || {};
    const items = lists[name] || [];
    const tbody = document.querySelector('#itemsList tbody');
    tbody.innerHTML = '';
    items.forEach(item => {
        const row = tbody.insertRow(-1);
        if (item.nome === 'Produto não cadastrado') row.classList.add('linha-nao-cadastrada');
        const c1 = row.insertCell(0); c1.setAttribute('data-ean', item.barcode);
        c1.innerHTML = `<strong>${item.barcode}</strong><span class="item-nome">${item.nome}</span>`;
        const c2 = row.insertCell(1); c2.style.textAlign = "center";
        c2.innerHTML = `<span class="qty-val">${item.quantity}</span>`;
        const c3 = row.insertCell(2);
        c3.innerHTML = `<button onclick="showConfirmModal('Remover item?', () => { this.closest('tr').remove(); saveItems(); })" style="border:none; background:none; font-size:1.2rem;">❌</button>`;
    });
}