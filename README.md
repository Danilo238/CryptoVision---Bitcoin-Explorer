# CryptoVision – Bitcoin Blockchain Explorer

## Indice

1. [Panoramica del Progetto](#panoramica-del-progetto)  
2. [Funzionalità Principali](#funzionalità-principali)  
3. [Struttura dell’Interfaccia](#struttura-dellinterfaccia)  
4. [Richiami Teorici sulla Blockchain](#richiami-teorici-sulla-blockchain)  
   - [Struttura dei Blocchi](#struttura-dei-blocchi)  
   - [Mempool](#mempool)  
   - [Nodi della Rete](#nodi-della-rete)  
   - [Mining e Proof-of-Work](#mining-e-proof-of-work)  
5. [Analisi di Blocchi e Transazioni](#analisi-di-blocchi-e-transazioni)  
   - [Dettaglio di un Blocco](#dettaglio-di-un-blocco)  
   - [Dettaglio di una Transazione](#dettaglio-di-una-transazione)  
6. [Architettura del Progetto](#architettura-del-progetto)  
7. [Guida all’Esecuzione](#guida-allesecuzione)  
8. [API](#api)  

---

## Panoramica del Progetto

**CryptoVision** è un Blockchain Explorer dedicato alla rete **Bitcoin**, progettato con finalità didattiche e dimostrative.

L’applicazione consente di esplorare blocchi e transazioni in modo semplice e interattivo, offrendo una visualizzazione chiara della struttura della blockchain e delle informazioni principali associate ai dati on-chain.

L’obiettivo non è solo consultare dati, ma comprendere:

- Come i blocchi vengono concatenati tra loro  
- Come le transazioni vengono validate  
- Come funziona il processo di mining  
- Che ruolo hanno mempool e nodi nella rete  

Il progetto è pensato come supporto allo studio della blockchain e come esempio pratico di integrazione con API pubbliche.

---

## Funzionalità Principali

L’applicazione mette a disposizione le seguenti sezioni principali:

- 📦 **Lista dei blocchi recenti**
- 🔎 **Ricerca e visualizzazione del dettaglio di un blocco**
- 💸 **Visualizzazione delle transazioni**
- ⏳ **Consultazione della mempool**
- 📄 **Dettaglio completo di una singola transazione**

L’interfaccia è interamente sviluppata lato client ed è orientata alla chiarezza dei dati.

---

## Struttura dell’Interfaccia

### Dashboard

Pagina iniziale da cui l’utente può:

- Accedere alla lista dei blocchi
- Accedere alla mempool

---

### Lista dei Blocchi

Mostra gli ultimi blocchi minati sulla rete Bitcoin.

Per ogni blocco vengono riportati:

- Hash identificativo
- Altezza (block height)
- Numero di transazioni
- Dimensione (byte)
- Peso (weight units)

Ogni elemento è cliccabile e rimanda alla pagina di dettaglio.

---

### Dettaglio di un Blocco

La pagina di dettaglio mostra informazioni complete:

- Altezza
- Hash
- Timestamp
- Numero totale di transazioni
- Dimensione
- Peso
- Merkle Root
- Nonce
- Hash del blocco precedente (navigabile)
- Difficoltà
- Bits
- Tempo mediano
- Lista delle transazioni incluse

È possibile navigare nella blockchain passando da un blocco al precedente, osservando concretamente la concatenazione crittografica.

---

### Vista Mempool

La sezione *Mempool* elenca le transazioni non ancora confermate.

Per ciascuna transazione vengono mostrati:

- Transaction ID (Txid)
- Importo totale trasferito
- Dimensione
- Commissione (fee)

Questa sezione permette di comprendere cosa accade prima che una transazione venga inclusa in un blocco.

---

### Dettaglio di una Transazione

Ogni transazione contiene:

- Txid
- Stato (confermata / non confermata)
- Blocco di inclusione (se presente)
- Altezza del blocco
- Data di conferma
- Commissione pagata
- Dimensione
- Versione
- Locktime
- Input (Vin)
- Output (Vout)
- Indicazione se coinbase

Nel caso di **coinbase transaction**, viene evidenziato che si tratta della transazione che assegna la ricompensa al miner.

---

## Richiami Teorici sulla Blockchain

### Struttura dei Blocchi

Un blocco è composto da:

- Header (contenente hash precedente, Merkle Root, timestamp, nonce, difficulty)
- Lista delle transazioni

Ogni blocco è identificato da un hash crittografico calcolato tramite SHA-256.  
La presenza dell’hash del blocco precedente garantisce l’immutabilità della catena.

Una modifica a un blocco comporterebbe la modifica di tutti i successivi, rendendo l’attacco computazionalmente impraticabile.

---

### Mempool

La mempool è una struttura dati temporanea mantenuta dai nodi della rete.

Quando una transazione viene trasmessa:

1. Viene validata dai nodi
2. Inserita nella mempool
3. Selezionata da un miner
4. Inclusa in un blocco valido

Le transazioni con fee più alte hanno maggiore probabilità di essere incluse rapidamente.

---

### Nodi della Rete

I nodi Bitcoin:

- Mantengono una copia completa o parziale della blockchain
- Verificano firme digitali e regole di consenso
- Rifiutano blocchi o transazioni non validi
- Propagano informazioni nella rete peer-to-peer

La decentralizzazione della rete garantisce sicurezza e resistenza alla censura.

---

### Mining e Proof-of-Work

Il mining è il processo attraverso il quale vengono creati nuovi blocchi.

Attraverso la **Proof-of-Work (PoW)**, i miner:

- Calcolano hash variando il nonce
- Cercano un valore inferiore al target di difficoltà
- Competono tra loro per trovare la soluzione valida

Il primo miner che trova un hash valido:

- Propone il blocco alla rete
- Riceve la block reward
- Incassa le commissioni delle transazioni incluse

La difficoltà viene regolata ogni 2016 blocchi per mantenere un tempo medio di circa 10 minuti per blocco.

---

## Analisi di Blocchi e Transazioni

### Dettaglio di un Blocco

Nel dettaglio di un blocco è possibile osservare:

- Altezza
- Hash
- Timestamp
- Numero di transazioni
- Dimensione
- Peso
- Difficoltà
- Bits
- Tempo mediano
- Merkle Root
- Nonce
- Hash del blocco precedente
- Elenco completo delle transazioni

Questa sezione permette di analizzare in modo concreto la struttura di un blocco reale della rete Bitcoin.

---

### Dettaglio di una Transazione

Ogni transazione mostra:

- Txid
- Stato
- Altezza del blocco (se confermata)
- Data di conferma
- Commissione
- Dimensione
- Locktime
- Input (indirizzi mittenti e importi)
- Output (indirizzi destinatari e importi)

L’analisi di input e output permette di comprendere il modello UTXO (Unspent Transaction Output) su cui si basa Bitcoin.

---

## Architettura del Progetto

Il progetto è sviluppato interamente lato client utilizzando:

- HTML
- CSS
- JavaScript (Vanilla)

Non sono presenti framework frontend: la logica applicativa si basa su chiamate HTTP alle API pubbliche e manipolazione dinamica del DOM.

Struttura principale dei file:

- `dashboard.html`
- `blocks.html`
- `mempool.html`
- `block-details.html`
- `transaction-details.html`
- `assets/` (stili e script)

---

## Guida all’Esecuzione

### Clonare il repository

```bash
git clone https://github.com/Danilo238/CryptoVision---Bitcoin-Explorer.git

cd CryptoVision---Bitcoin-Explorer

python3 -m http.server 8000
```

Aprire infine: http://localhost:8000/dashboard/dashboard.html

Non è richiesto alcun backend.

---

## API

Il progetto utilizza le API pubbliche di Blockstream per ottenere:
- Lista dei blocchi
- Dettagli dei blocchi
- Informazioni sulle transazioni
- Stato della mempool
- Le API vengono interrogate tramite richieste fetch asincrone.

---

## Realizzato da: Danilo Verde
