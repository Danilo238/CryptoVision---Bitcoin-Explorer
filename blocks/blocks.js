// ========================
//  CONFIGURAZIONE DI BASE
// ========================
const API_BASE = "https://mempool.space/api/blocks";
const tableBody = document.querySelector("#blocks-table tbody");
const spinner = document.getElementById("spinner-overlay");
const loadMoreBtn = document.getElementById("load-more-btn");

let lastHeight = null;
let isLoading = false; 

// =====================ß
//  FUNZIONI PRINCIPALI
// =====================

// Recupera i blocchi dall'API e aggiorna la tabella
async function fetchBlocks() {
    if (isLoading) return; // Evita chiamate multiple
    isLoading = true;
    showSpinner(true);

    try {
        // Se lastHeight è definito, carica i blocchi precedenti
        const endpoint = lastHeight ? `${API_BASE}/${lastHeight - 10}` : API_BASE;
        const response = await fetch(endpoint);

        if (!response.ok) throw new Error("Errore nel recupero dei blocchi");

        const blocks = await response.json();

        // Disabilita il bottone se non ci sono altri blocchi
        if (blocks.length === 0) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = "Nessun altro blocco disponibile";
            return;
        }

        // Aggiorna lastHeight per la prossima richiesta
        lastHeight = blocks[blocks.length - 1].height;
        renderBlocks(blocks);
    } catch (err) {
        console.error(err);
        alert("Errore durante il caricamento dei blocchi.");
    } finally {
        showSpinner(false);
        isLoading = false;
    }
}

// Inserisce i blocchi nella tabella HTML
function renderBlocks(blocks) {
    blocks.forEach(block => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${block.height}</td>
            <td>${block.id.slice(0, 15)}...</td>
            <td>${block.tx_count}</td>
            <td>${new Date(block.timestamp * 1000).toLocaleTimeString()}</td>
            <td>${(block.size / 1000).toFixed(1)} kB</td>
        `;
        // Clicca sulla riga per vedere i dettagli del blocco
        row.addEventListener("click", () => {
            window.location.href = `block-details.html?id=${block.id}`;
        });
        tableBody.appendChild(row);
    });
}

// Mostra o nasconde lo spinner di caricamento
function showSpinner(show) {
    if (show) {
        spinner.style.visibility = "visible";
        spinner.style.opacity = "1";
        document.body.classList.add("blur");
    } else {
        spinner.style.opacity = "0";
        document.body.classList.remove("blur");
        setTimeout(() => spinner.style.visibility = "hidden", 300);
    }
}

// =====================
//  EVENTI INIZIALI
// =====================

loadMoreBtn.addEventListener("click", fetchBlocks);
document.addEventListener("DOMContentLoaded", fetchBlocks);
