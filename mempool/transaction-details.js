// ========================================
//  CryptoVision - Dettagli Transazione BTC
// ========================================

const TX_API_BASE = 'https://blockstream.info/api/tx/';
const params = new URLSearchParams(window.location.search);
const txHash = params.get('id');

/**
 * Mostra il caricamento
 */
function showSpinner() {
    const overlay = document.getElementById('spinner-overlay');
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
}

/**
 * Nasconde il caricamento
 */
function hideSpinner() {
    const overlay = document.getElementById('spinner-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => (overlay.style.visibility = 'hidden'), 300);
}

/**
 * Recupera i dettagli di una singola transazione.
 * @param {string} hash - L'ID della transazione.
 */
async function getTransactionData(hash) {
    try {
        showSpinner();
        const res = await fetch(`${TX_API_BASE}${hash}`);
        if (!res.ok) {
            throw new Error(`Errore HTTP: ${res.status}`);
        }
        const data = await res.json();
        renderTransactionDetails(data);
    } catch (err) {
        const container = document.getElementById('details-content');
        container.innerHTML = `<p>Errore durante il caricamento: ${err.message}</p>`;
        container.style.display = 'block';
    } finally {
        hideSpinner();
    }
}

/**
 * Genera l’HTML per mostrare input e output della transazione.
 * @param {Object} tx - Dati della transazione.
 */
function renderTransactionDetails(tx) {
    const container = document.getElementById('details-content');
    container.style.display = 'block';

    const isCoinbase = tx.vin.some(v => v.is_coinbase);

    // --- INPUTS ---
    let inputHTML = '';
    if (isCoinbase) {
        inputHTML = `
            <h3>Input</h3>
            <p>Questa è una transazione Coinbase. Nessun input tradizionale disponibile.</p>
        `;
    } else {
        const inputRows = tx.vin.map((v, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${v.prevout.scriptpubkey_address || 'N/A'}</td>
                <td>${(v.prevout.value / 100000000).toFixed(8)} BTC</td>
            </tr>
        `).join('');
        inputHTML = `
            <h3>Input</h3>
            <table class="table">
                <thead>
                    <tr><th>#</th><th>Indirizzo</th><th>Importo</th></tr>
                </thead>
                <tbody>${inputRows}</tbody>
            </table>
        `;
    }

    // --- OUTPUTS ---
    const outputRows = tx.vout.map((v, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${v.scriptpubkey_address || 'N/A'}</td>
            <td>${(v.value / 100000000).toFixed(8)} BTC</td>
            <td>${v.scriptpubkey_type || 'N/A'}</td>
        </tr>
    `).join('');

    const blockInfo = tx.status.confirmed
        ? `
            <p><strong>Blocco Confermato:</strong> 
                <a href="../blocks/block-details.html?id=${tx.status.block_hash}" class="tx-link">
                    ${tx.status.block_hash}
                </a>
            </p>
            <p><strong>Altezza Blocco:</strong> ${tx.status.block_height}</p>
        `
        : `<p><strong>Stato:</strong> In attesa di conferma</p>`;

    // --- INFO GENERALI ---
    container.innerHTML = `
        <h2>Transazione ${tx.txid}</h2>
        ${blockInfo}
        <p><strong>Data:</strong> ${tx.status.confirmed ? new Date(tx.status.block_time * 1000).toLocaleString() : 'N/A'}</p>
        <p><strong>Coinbase:</strong> ${isCoinbase ? 'Sì' : 'No'}</p>
        <p><strong>Commissione:</strong> ${tx.fee} sat</p>
        <p><strong>Dimensione:</strong> ${tx.size} B</p>
        <p><strong>Versione:</strong> ${tx.version}</p>
        <p><strong>Lock Time:</strong> ${tx.locktime}</p>
        ${inputHTML}
        <h3>Output</h3>
        <table class="table">
            <thead>
                <tr><th>#</th><th>Indirizzo</th><th>Importo</th><th>Tipo</th></tr>
            </thead>
            <tbody>${outputRows}</tbody>
        </table>
    `;
}

/**
 * Entry point: carica la transazione se l'id è presente.
 */
if (txHash) {
    getTransactionData(txHash);
} else {
    const container = document.getElementById('details-content');
    container.innerHTML = '<p>ID transazione mancante.</p>';
    container.style.display = 'block';
}
