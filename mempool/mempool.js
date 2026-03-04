// =============================
//  CryptoVision - Mempool View
// =============================

const MEMPOOL_API = 'https://blockstream.info/api/mempool/recent';

/**
 * Mostra l'overlay di caricamento.
 */
function showLoading() {
    const overlay = document.getElementById('spinner-overlay');
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    document.body.classList.add('blur');
}

/**
 * Nasconde l'overlay di caricamento.
 */
function hideLoading() {
    const overlay = document.getElementById('spinner-overlay');
    overlay.style.opacity = '0';
    document.body.classList.remove('blur');
    setTimeout(() => {
        overlay.style.visibility = 'hidden';
    }, 300);
}

/**
 * Recupera le transazioni recenti della mempool da Blockstream API.
 */
async function fetchMempoolData() {
    try {
        showLoading();
        const res = await fetch(MEMPOOL_API);
        if (!res.ok) {
            throw new Error(`Richiesta fallita: ${res.status}`);
        }
        return await res.json();
    } catch (err) {
        console.error('Errore nel recupero delle transazioni:', err);
        return [];
    } finally {
        hideLoading();
    }
}

/**
 * Inserisce le transazioni nella tabella HTML.
 * @param {Array} txList - Lista di transazioni.
 */
function renderMempoolTable(txList) {
    const tbody = document.querySelector('#mempool-table tbody');
    tbody.innerHTML = ''; // pulizia
    txList.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tx.txid}</td>
            <td>${(tx.value / 100000000).toFixed(8)} BTC</td>
            <td>${tx.vsize} vB</td>
            <td>${tx.fee} sat</td>
        `;
        row.addEventListener('click', () => {
            window.location.href = `./transaction-details.html?id=${tx.txid}`;
        });
        tbody.appendChild(row);
    });
}

/**
 * Inizializza la pagina caricando i dati e aggiornando la tabella.
 */
(async function initMempoolView() {
    const transactions = await fetchMempoolData();
    if (transactions.length > 0) {
        renderMempoolTable(transactions);
    } else {
        alert('Impossibile recuperare i dati della mempool. Riprova più tardi.');
    }
})();
