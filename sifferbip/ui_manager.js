/** UI_MANAGER.JS - Interface e Modais */

function toggleAccordion() {
    const content = document.getElementById('acc-content');
    const icon = document.getElementById('acc-icon');
    content.classList.toggle('active');
    icon.textContent = content.classList.contains('active') ? '▲' : '▼';
}

function showConfirmModal(texto, onConfirm) {
    const modal = document.getElementById('customModal');
    document.getElementById('modalTitle').textContent = "Confirmação";
    document.getElementById('modalBody').innerHTML = `<p>${texto}</p>`;
    document.getElementById('modalBtnCancel').style.display = "block";
    const btnConfirm = document.getElementById('modalBtnConfirm');
    btnConfirm.onclick = () => { onConfirm(); closeModal(); };
    modal.style.display = "flex";
}

function showPromptModal() {
    const modal = document.getElementById('customModal');
    document.getElementById('modalTitle').textContent = "Nova Lista";
    document.getElementById('modalBody').innerHTML = `<input type="text" id="modalInput" placeholder="Nome da lista..." style="width:100%">`;
    document.getElementById('modalBtnCancel').style.display = "block";
    const btnConfirm = document.getElementById('modalBtnConfirm');
    btnConfirm.onclick = () => {
        const val = document.getElementById('modalInput').value;
        if(val) { 
            if(typeof createNewListLogic === "function") {
                createNewListLogic(val); 
                closeModal(); 
            }
        }
    };
    modal.style.display = "flex";
}

function showAlert(titulo, texto) {
    const modal = document.getElementById('customModal');
    document.getElementById('modalTitle').textContent = titulo;
    document.getElementById('modalBody').innerHTML = `<p>${texto}</p>`;
    document.getElementById('modalBtnCancel').style.display = "none";
    document.getElementById('modalBtnConfirm').onclick = closeModal;
    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById('customModal').style.display = "none";
}