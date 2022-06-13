import { LocalStorage } from "./localStorage.js";
import { BitmexHandler } from "./bitmexHandler.js";
import { popWalletHistory, popOpenOrders, popOrders, popPositions, popOrderBook, createTableRows } from "./popTable.js"

const localStorage = new LocalStorage();
let keys = localStorage.load();
let bitmex;

function disableTrade() {
    const buttons = document.querySelectorAll(`button`);
    for (let button of buttons) {
        button.disabled = true;
    }

    apiID.value = keys.apiID || "";
    apiSecret.value = keys.apiSecret || "";
    testnet.checked = keys.testnet || false;

    editKeys.classList.remove("displayOn")
    addKeys.classList = "displayOn";
    addKeys.addEventListener('click', () => formKeys.classList = "displayOn");
}

function enableTrade() {
    if (keys == "" || keys.apiID == "" || keys.apiSecret == "") {
        disableTrade();
    }
    else {
        const buttons = document.querySelectorAll(`button`);
        for (let button of buttons) {
            button.disabled = false;
        }

        addKeys.classList.remove("displayOn")
        editKeys.classList = "displayOn";
        editKeys.addEventListener('click', () => formKeys.classList = "displayOn");

        apiID.value = keys.apiID;
        apiSecret.value = keys.apiSecret;
        testnet.checked = keys.testnet;
    }
    bitmex = new BitmexHandler(keys);
    countDown();
}

enableTrade();

saveKeys.addEventListener('click', () => {
    keys = localStorage.add({ apiID: apiID.value, apiSecret: apiSecret.value, testnet: testnet.checked });
    enableTrade();
});

closeDiv.addEventListener('click', () => formKeys.classList.remove("displayOn"));


const actions = {
    popWalletHistory : async()                    => popWalletHistory(mainTable, await bitmex.get("getWalletHistory")),
    popOpenOrders : async ()                      => popOpenOrders(mainTable, await bitmex.get("getOpenOrders"), bitmex),
    popOrders :     async ()                      => popOrders(mainTable, await bitmex.get("getOrders")),
    popPositions :  async ()                      => popPositions(openPositions, await bitmex.get("getOpenPositions")),
    createOrder :   async (name, price, quantity) => {
        if(name && price && quantity){
            if(confirm(`Enviar ${ name } order de ${quantity} contratos no valor de: $ ${price} ? `)){
                await bitmex.createOrder("createOrder", "Limit", name, price, quantity);
                await actions['popOpenOrders']();
                await actions['popPositions']();
            }

        }
    },
}

quantity.addEventListener('keydown', () => volume.value = (quantity.value / price.value).toFixed(4));
price.addEventListener('keydown', () => volume.value = (quantity.value / price.value).toFixed(4));

const buttons   = document.querySelectorAll(`button`);
for (let button of buttons){
    button.addEventListener('click', await handle) 
}

async function handle(e){
    e.preventDefault();

    const {value: action, name: param} = e.path[0];
    await actions[action](param, price.value, quantity.value);
}

function countDown() {
    setTimeout(async function () {
        popOrderBook(bookOffers, await bitmex.get("getOrderBook"));
        countDown();
    }, 5000)
}

createTableRows(bookOffers, 50);
