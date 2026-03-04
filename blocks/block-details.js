// ========================
//  CONFIGURAZIONE DI BASE
// ========================
const apiUrl = "https://mempool.space/api/block/";
const params = new URLSearchParams(window.location.search);
const blockId = params.get("id");

const spinner = document.getElementById("spinner-overlay");
const infoContainer = document.getElementById("block-info");
const txList = document.getElementById("tx-list");
const loadMoreBtn = document.getElementById("load-more-txs");
const txCountElement = document.getElementById("tx-count");

let startIndex = 0;
const txPerPage = 25;
let totalTxCount = 0;

// Se manca l’ID del blocco, reindirizza alla lista
if (!blockId) {
    alert("Nessun ID di blocco specificato.");
    window.location.href = "../blocks/blocks.html";
}

// =====================
//  FUNZIONI PRINCIPALI
// =====================

// Carica dettagli del blocco
async function loadBlockDetails() {
    try {
        showSpinner(true);
        const res = await fetch(`${apiUrl}${blockId}`);
        if (!res.ok) throw new Error(`Errore nel recupero del blocco: ${res.status}`);

        const block = await res.json();
        totalTxCount = block.tx_count;
        renderBlockInfo(block);
        updateTxCountDisplay();
        await loadBlockTransactions(); // carica le prime transazioni
    } catch (err) {
        console.error("Errore:", err);
        infoContainer.innerHTML = `<p>Errore: ${err.message}</p>`;
    } finally {
        showSpinner(false);
    }
}

// Carica transazioni del blocco in batch (paginazione)
async function loadBlockTransactions() {
    try {
        loadMoreBtn.disabled = true;
        const res = await fetch(`${apiUrl}${blockId}/txs/${startIndex}`);
        if (!res.ok) throw new Error("Errore nel recupero delle transazioni.");

        const transactions = await res.json();
        renderTransactions(transactions);

        startIndex += transactions.length;
        updateTxCountDisplay();

        // Se abbiamo caricato tutto, nascondi il pulsante
        if (startIndex >= totalTxCount) {
            loadMoreBtn.style.display = "none";
        } else {
            loadMoreBtn.style.display = "block";
            loadMoreBtn.disabled = false;
        }
    } catch (err) {
        console.error("Errore transazioni:", err);
        txList.innerHTML = `<li>Errore: ${err.message}</li>`;
    }
}

// ===========
//  RENDERING
// ===========

// Mostra info principali del blocco
function renderBlockInfo(block) {
    const formattedHash = `${block.id.slice(0, 10)}...${block.id.slice(-10)}`;
    const date = new Date(block.timestamp * 1000).toLocaleString();

    infoContainer.innerHTML = `
        <div><strong>Hash:</strong> ${formattedHash}</div>
        <div><strong>Altezza:</strong> ${block.height}</div>
        <div><strong>Timestamp:</strong> ${date}</div>
        <div><strong>Dimensione:</strong> ${(block.size / 1000).toFixed(2)} KB</div>
        <div><strong>Transazioni:</strong> ${block.tx_count}</div>
        <div><strong>Nonce:</strong> ${block.nonce}</div>
        <div><strong>Merkle Root:</strong> ${block.merkle_root.slice(0, 10)}...${block.merkle_root.slice(-10)}</div>
        <div><strong>Blocco Precedente:</strong> 
            ${block.previousblockhash 
                ? `<a href="block-details.html?id=${block.previousblockhash}" class="prevblock-link">${block.previousblockhash.slice(0, 12)}...</a>` 
                : "N/A"}
        </div>
    `;
}

// Mostra le transazioni nella lista
function renderTransactions(transactions) {
    if (transactions.length === 0 && startIndex === 0) {
        txList.innerHTML = "<li>Nessuna transazione trovata per questo blocco.</li>";
        return;
    }

    const txItems = transactions.map(tx => `
        <li class="tx-item">
            <a href="../mempool/transaction-details.html?id=${tx.txid}">
                ${tx.txid.slice(0, 14)}...${tx.txid.slice(-14)}
            </a>
            <span class="tx-meta">Fee: ${tx.fee} sat | ${tx.size} B</span>
        </li>
    `).join("");

    txList.innerHTML += txItems;
}

// Aggiorna il contatore di transazioni visualizzate
function updateTxCountDisplay() {
    txCountElement.textContent = `(${Math.min(startIndex, totalTxCount)} di ${totalTxCount})`;
}

// =========
//  SPINNER
// =========
function showSpinner(show) {
    if (show) {
        spinner.style.visibility = "visible";
        spinner.style.opacity = "1";
        document.body.classList.add("blur");
    } else {
        spinner.style.opacity = "0";
        document.body.classList.remove("blur");
        setTimeout(() => (spinner.style.visibility = "hidden"), 300);
    }
}

// =================
//  EVENT LISTENERS
// =================
document.addEventListener("DOMContentLoaded", loadBlockDetails);
loadMoreBtn.addEventListener("click", () => loadBlockTransactions());
