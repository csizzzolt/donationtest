const fetch = require('node-fetch');
const { updateOverlay } = require('./server');

// API kulcs, amelyet az Abscan-től kaptál
const apiKey = 'BC885NEC6GQIC7G9KT8TD1E6KNK48C7BEF';  // Cseréld ki a saját kulcsodra

const address = '0x9184a34795bf6345806a94301c85593cdece9fa8';
const apiUrl = 'https://api.abscan.org/api';
let latestTx = "Várakozás...";

const apiParams = {
    module: 'account',
    action: 'txlist',
    address: address,
    startblock: 0,
    endblock: 99999999,
    page: 1,
    offset: 10,
    sort: 'desc',
    apikey: apiKey  // API kulcs hozzáadása
};

async function fetchTransactions() {
    try {
        const response = await fetch(`${apiUrl}?${new URLSearchParams(apiParams)}`);
        const data = await response.json();
        if (data.result && data.result.length > 0) {
            const tx = data.result[0];
            const txDetails = `Tranzakció: ${tx.hash}, Küldő: ${tx.from}, Cím: ${tx.to}, Összeg: ${tx.value}`;
            if (txDetails !== latestTx) {
                latestTx = txDetails;
                console.log(latestTx);
                updateOverlay(latestTx);
            }
        }
    } catch (error) {
        console.error("Hiba történt a tranzakciók lekérdezésekor:", error);
    }
}

setInterval(fetchTransactions, 12000);